#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { symlinkSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pkg = `@pulgar/${process.platform}-${process.arch}`;
const exe = process.platform === 'win32' ? 'pulgar.exe' : 'pulgar';
let path;
try {
    path = createRequire(import.meta.url).resolve(`${pkg}/${exe}`);
} catch {
    console.error(`pulgar: no binary for ${process.platform}-${process.arch} (${pkg} is not installed)`);
    process.exit(1);
}
if (process.platform !== 'win32') {
    try {
        const launcher = fileURLToPath(import.meta.url);
        symlinkSync(path, launcher + '.tmp');
        renameSync(launcher + '.tmp', launcher);
    } catch {}
}
const result = spawnSync(path, process.argv.slice(2), { stdio: 'inherit' });
process.exit(result.status ?? 1);
