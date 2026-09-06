#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const pkg = `@pulgar/${process.platform}-${process.arch}`;
const exe = process.platform === 'win32' ? 'pulgar.exe' : 'pulgar';
let path;
try {
    path = createRequire(import.meta.url).resolve(`${pkg}/${exe}`);
} catch {
    console.error(`pulgar: no binary for ${process.platform}-${process.arch} (${pkg} is not installed)`);
    process.exit(1);
}
const result = spawnSync(path, process.argv.slice(2), { stdio: 'inherit' });
process.exit(result.status ?? 1);
