cd ms
hyperfine "bun test src" "vitest run src --globals" "../dist/linux-x64/pulgar src --globals" "pnpm test"
cd ..

