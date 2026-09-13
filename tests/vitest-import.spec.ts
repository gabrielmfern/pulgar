import { test, expect, describe, it, beforeAll, afterAll, beforeEach, afterEach } from "vitest";

describe("imports from vitest", () => {
  let hooks = "";

  beforeAll(() => {
    hooks += "beforeAll";
  });

  beforeEach(() => {
    hooks += " beforeEach";
  });

  afterEach(() => {
    hooks += " afterEach";
  });

  afterAll(() => {
    hooks += " afterAll";
  });

  it("runs a suite with its hooks", () => {
    expect(hooks).toBe("beforeAll beforeEach");
  });

  test("sees the hooks that ran between tests", () => {
    expect(hooks).toBe("beforeAll beforeEach afterEach beforeEach");
  });
});
