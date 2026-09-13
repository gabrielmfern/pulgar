import { state } from "./js-extension.js";
import { state as stateFromTs } from "./js-extension.ts";

test("an import ending in .js loads the .ts file next to it", () => {
  expect(state.from).toBe("js-extension.ts");
});

test("the .js and .ts paths load a single module", () => {
  expect(stateFromTs).toBe(state);
});
