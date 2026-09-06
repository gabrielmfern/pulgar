process._linkedBinding('testa');
import vm from 'node:vm';
import fs from 'node:fs';
import { inspect } from 'node:util';
import { stripTypeScriptTypes, isBuiltin } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { createHook } from 'node:async_hooks';

globalThis.__testa_inspect = inspect;

// TODO: this is always on for now. it should be off in CI (detect via env
// vars like CI, GITHUB_ACTIONS) and controllable by a boolean cli flag that
// bypasses any heuristic.
const births = new Map();
createHook({
  init(asyncId, type) {
    births.set(asyncId, { type, stack: new Error().stack });
  },
  destroy(asyncId) {
    births.delete(asyncId);
  },
}).enable();

globalThis.__testa_stack = asyncId => births.get(asyncId)?.stack ?? '';

// we do this so that we can warmup the import and WASM whatever that node uses to strip types, so that if tests teardown really fast because of a short timeout, the other tests won't error during type stripping.
stripTypeScriptTypes('const x: number = 1')
// this also warms up stdout and stuff so that they don't get "leaked" in between tests
process.stdout.write('');
process.stderr.write('');

const cache = new Map();
const hostImport = new vm.Script('specifier => import(specifier)', {
  importModuleDynamically: vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
}).runInThisContext();
const { resolve } = await hostImport('data:text/javascript,export const resolve = import.meta.resolve');

function isTypeScript(url) {
  return url.endsWith('.ts') || url.endsWith('.mts') || url.endsWith('.cts');
}

function initializeImportMeta(meta, url) {
  meta.url = url;
  if (!url.startsWith('file:')) return;
  const filename = fileURLToPath(url);
  meta.filename = filename;
  meta.dirname = dirname(filename);
  meta.dir = meta.dirname;
}

async function loadModule(url) {
  let mod = cache.get(url);
  if (mod) return mod;
  let code = fs.readFileSync(new URL(url), 'utf8');
  if (isTypeScript(url)) code = stripTypeScriptTypes(code);
  if (url.startsWith('file:')) {
    const filename = fileURLToPath(url);
    code = `const __filename = ${JSON.stringify(filename)}, __dirname = ${JSON.stringify(dirname(filename))};` + code;
  }
  mod = new vm.SourceTextModule(code, {
    identifier: url,
    importModuleDynamically: linker,
    initializeImportMeta: meta => initializeImportMeta(meta, url),
  });
  cache.set(url, mod);
  await mod.link(linker);
  await mod.evaluate();
  return mod;
}

async function loadBuiltin(specifier) {
  let mod = cache.get(specifier);
  if (mod) return mod;
  const exports = process.getBuiltinModule(specifier);
  mod = new vm.SyntheticModule([...Object.keys(exports), 'default'], function() {
    for (const key of Object.keys(exports)) this.setExport(key, exports[key]);
    this.setExport('default', exports);
  });
  cache.set(specifier, mod);
  await mod.link(linker);
  await mod.evaluate();
  return mod;
}

async function loadPackage(url) {
  let mod = cache.get(url);
  if (mod) return mod;
  const namespace = await hostImport(url);
  mod = new vm.SyntheticModule(Object.keys(namespace), function() {
    for (const key of Object.keys(namespace)) this.setExport(key, namespace[key]);
  });
  cache.set(url, mod);
  await mod.link(linker);
  await mod.evaluate();
  return mod;
}

function isBare(specifier) {
  if (specifier.startsWith('./') || specifier.startsWith('../') || specifier.startsWith('/')) return false;
  return !URL.canParse(specifier);
}

function linker(specifier, referencingModule) {
  if (isBuiltin(specifier)) return loadBuiltin(specifier);
  if (isBare(specifier)) return loadPackage(resolve(specifier, referencingModule.identifier));
  return loadModule(new URL(specifier, referencingModule.identifier).href);
}

globalThis.__testa_run = path => loadModule(pathToFileURL(path).href);
