import { expectTypeOf, expect } from "vitest";

test("expectTypeOf chains are no-ops at runtime", () => {
  expectTypeOf<string>().toEqualTypeOf<string>();
  expectTypeOf({ a: 1 }).not.toEqualTypeOf<{ b: number }>();
  expectTypeOf(1).toBeNumber();
  expectTypeOf(() => {}).toBeFunction();
});

test("expect.unreachable throws with the default message", () => {
  expect(() => expect.unreachable()).toThrow("unreachable");
});

test("expect.unreachable throws with a custom message", () => {
  expect(() => expect.unreachable("should not get here")).toThrow("should not get here");
});
