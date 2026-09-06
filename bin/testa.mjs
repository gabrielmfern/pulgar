#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const pkg = `@testajs/${process.platform}-${process.arch}`;
const exe = process.platform === 'win32' ? 'testa.exe' : 'testa';
let path;
try {
    path = createRequire(import.meta.url).resolve(`${pkg}/${exe}`);
} catch {
    console.error(`testa: no binary for ${process.platform}-${process.arch} (${pkg} is not installed)`);
    process.exit(1);
}
const result = spawnSync(path, process.argv.slice(2), { stdio: 'inherit' });
process.exit(result.status ?? 1);
