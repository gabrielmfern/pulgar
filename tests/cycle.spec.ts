import { a, bFromA } from "./cycle-a.js";
import { b, aFromB } from "./cycle-b.js";

test("modules in a cycle see each other's exports", () => {
  expect(bFromA()).toBe(b);
  expect(aFromB()).toBe(a);
});
