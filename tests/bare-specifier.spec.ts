import pc from "picocolors";
import * as colors from "picocolors";
import { join } from "pathe";

test("default import from a CommonJS package", () => {
  expect(typeof pc.red).toBe("function");
});

test("namespace import of a CommonJS package has the exports as default", () => {
  expect(colors.default).toBe(pc);
});

test("named import from a package with exports conditions", () => {
  expect(join("a", "b")).toBe("a/b");
});

test("dynamic import of a bare specifier", async () => {
  const mod = await import("pathe");
  expect(mod.join).toBe(join);
});
