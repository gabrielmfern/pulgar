# pulgar

```sh
npx pulgar@latest
```

a small js test runner with Node.js embedded in a single, simple binary

![pulgar running the ms test suite](docs/demo.gif)

## why?

the main motivation was to find out whether vitest is really the baseline for node.js test runner performance, 
and I also wanted to learn jai so things coincided into this project.

vitest is fast, but it's not as fast as the computer can go. javascript itself is not as fast as the computer can 
go, but even with the bottleneck that javascript can be, current test runners are not bottlenecked by the test code. 

I am yet to properly and rigorously benchmark this test runner against other test runners in real projects, 
since pulgar's feature-set is quite small. 

## usage

```sh
pulgar            # runs every test file under the current directory
pulgar parse      # runs files whose path contains "parse"
pulgar ./src/     # runs files whose path starts with src/
```

arguments are filters on the relative file path. a filter starting with `./` or
`/` anchors to the start of the path, anything else matches anywhere. matching
is case-insensitive.

files ending in `.test` or `.spec` with `.ts`, `.mts`, `.cts`, `.js`, `.mjs` or `.cjs` are picked up.

there is no config file.

## what works

- `describe`, `test` and `it`, with `skip`, `todo`, `fails`, `skipIf` and `runIf`
- `beforeAll`, `afterAll`, `beforeEach`, `afterEach`
- `expect` with `.not`, `expect.unreachable` and `expectTypeOf`
- matchers: `toBe`, `toEqual`, `toStrictEqual`, `toBeNull`, `toBeUndefined`, `toBeDefined`, `toBeTruthy`, 
  `toBeFalsy`, `toThrow`, `toBeTypeOf`, `toBeInstanceOf`, `toBeGreaterThan`, `toBeGreaterThanOrEqual`, 
  `toBeLessThan`, `toBeLessThanOrEqual`, `toContain`, `toContainEqual`, `toHaveLength`
- `import { ... } from 'vitest'` and `import { ... } from '@jest/globals'` resolves to pulgar's own api
- typescript, through node's type stripping. so no enums, namespaces, decorators or jsx
- extensionless relative imports resolve to `.ts`, `.js` or an `index` file
- `import.meta.url`, `import.meta.dirname`, `__filename` and `__dirname`

see [TODO.md](TODO.md).

## building from source

you need the jai compiler and a node checkout built as a shared library.

```sh
git submodule update --init vendor/node
cd vendor/node && ./configure --shared --ninja && ninja -C out/Release && cd ../..
jai build.jai -optimized
```

node takes a while to build. on windows use `vcbuild.bat dll` instead of configure and ninja.

