import { unlinkSync, symlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

if (process.platform !== 'win32') {
    let binary;
    try {
        binary = createRequire(import.meta.url).resolve(`@testajs/${process.platform}-${process.arch}/testa`);
    } catch {
        process.exit(0);
    }
    const launcher = fileURLToPath(new URL('bin/testa.mjs', import.meta.url));
    unlinkSync(launcher);
    symlinkSync(binary, launcher);
}
