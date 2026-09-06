describe("toBeGreaterThan", () => {
  test("numbers", () => {
    expect(2).toBeGreaterThan(1);
    expect(0.2).toBeGreaterThan(0.1);
    expect(-1).toBeGreaterThan(-2);
    expect(Infinity).toBeGreaterThan(Number.MAX_VALUE);
    expect(1).not.toBeGreaterThan(1);
    expect(1).not.toBeGreaterThan(2);
    expect(0).not.toBeGreaterThan(-0);
  });

  test("NaN is never greater", () => {
    expect(NaN).not.toBeGreaterThan(0);
    expect(0).not.toBeGreaterThan(NaN);
    expect(NaN).not.toBeGreaterThan(NaN);
  });

  test("bigints", () => {
    expect(2n).toBeGreaterThan(1n);
    expect(0n).toBeGreaterThan(-1n);
    expect(-3n).toBeGreaterThan(-5n);
    expect(2n ** 64n + 1n).toBeGreaterThan(2n ** 64n);
    expect(2n ** 128n).toBeGreaterThan(2n ** 64n);
    expect(-(2n ** 64n)).toBeGreaterThan(-(2n ** 64n) - 1n);
    expect(2n ** 64n).not.toBeGreaterThan(2n ** 64n);
    expect(-(2n ** 128n)).not.toBeGreaterThan(-(2n ** 64n));
  });

  test("mixed number and bigint", () => {
    expect(2n).toBeGreaterThan(1);
    expect(2).toBeGreaterThan(1n);
    expect(1n).not.toBeGreaterThan(1);
    expect(2n ** 64n).toBeGreaterThan(1e18);
    expect(NaN).not.toBeGreaterThan(0n);
  });

  test.failing("smaller", () => {
    expect(1).toBeGreaterThan(2);
  });

  test.failing("equal", () => {
    expect(1).toBeGreaterThan(1);
  });

  test.failing("NaN", () => {
    expect(NaN).toBeGreaterThan(0);
  });

  test.failing("negated", () => {
    expect(2).not.toBeGreaterThan(1);
  });

  test.failing("actual is not numeric", () => {
    expect("2").toBeGreaterThan(1);
  });

  test.failing("expected is not numeric", () => {
    // @ts-expect-error
    expect(2).toBeGreaterThan("1");
  });
});

describe("toBeGreaterThanOrEqual", () => {
  test("numbers and bigints", () => {
    expect(2).toBeGreaterThanOrEqual(1);
    expect(1).toBeGreaterThanOrEqual(1);
    expect(0).toBeGreaterThanOrEqual(-0);
    expect(-0).toBeGreaterThanOrEqual(0);
    expect(1).not.toBeGreaterThanOrEqual(2);
    expect(2n ** 70n).toBeGreaterThanOrEqual(2n ** 70n);
    expect(1n).toBeGreaterThanOrEqual(1);
    expect(1).toBeGreaterThanOrEqual(1n);
    expect(NaN).not.toBeGreaterThanOrEqual(NaN);
  });

  test.failing("smaller", () => {
    expect(1).toBeGreaterThanOrEqual(2);
  });

  test.failing("negated equal", () => {
    expect(1).not.toBeGreaterThanOrEqual(1);
  });
});

describe("toBeLessThan", () => {
  test("numbers and bigints", () => {
    expect(1).toBeLessThan(2);
    expect(-Infinity).toBeLessThan(-Number.MAX_VALUE);
    expect(1).not.toBeLessThan(1);
    expect(2).not.toBeLessThan(1);
    expect(NaN).not.toBeLessThan(0);
    expect(1n).toBeLessThan(2n);
    expect(-(2n ** 64n) - 1n).toBeLessThan(-(2n ** 64n));
    expect(1).toBeLessThan(2n);
    expect(1n).toBeLessThan(1.5);
  });

  test.failing("greater", () => {
    expect(2).toBeLessThan(1);
  });

  test.failing("equal", () => {
    expect(1).toBeLessThan(1);
  });

  test.failing("negated", () => {
    expect(1).not.toBeLessThan(2);
  });
});

describe("toBeLessThanOrEqual", () => {
  test("numbers and bigints", () => {
    expect(1).toBeLessThanOrEqual(2);
    expect(1).toBeLessThanOrEqual(1);
    expect(2).not.toBeLessThanOrEqual(1);
    expect(NaN).not.toBeLessThanOrEqual(NaN);
    expect(2n ** 70n).toBeLessThanOrEqual(2n ** 70n);
    expect(1n).toBeLessThanOrEqual(1);
    expect(0n).toBeLessThanOrEqual(0);
  });

  test.failing("greater", () => {
    expect(2).toBeLessThanOrEqual(1);
  });

  test.failing("negated equal", () => {
    expect(1).not.toBeLessThanOrEqual(1);
  });
});
