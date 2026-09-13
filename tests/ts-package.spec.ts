import { greet } from "#ts-package";

test("a bare specifier that resolves to TypeScript runs through our loader", () => {
  expect(greet()).toBe("hello from ts-package");
});
