describe("toBeTruthy", () => {
  test("truthy values", () => {
    expect(true).toBeTruthy();
    expect(1).toBeTruthy();
    expect(-1).toBeTruthy();
    expect("0").toBeTruthy();
    expect(" ").toBeTruthy();
    expect({}).toBeTruthy();
    expect([]).toBeTruthy();
    expect(() => {}).toBeTruthy();
    expect(1n).toBeTruthy();
    expect(Infinity).toBeTruthy();
    expect(new Boolean(false)).toBeTruthy();
  });

  test("falsy values are not truthy", () => {
    expect(false).not.toBeTruthy();
    expect(0).not.toBeTruthy();
    expect(-0).not.toBeTruthy();
    expect(0n).not.toBeTruthy();
    expect("").not.toBeTruthy();
    expect(null).not.toBeTruthy();
    expect(undefined).not.toBeTruthy();
    expect(NaN).not.toBeTruthy();
  });

  test.failing("0 is not truthy", () => {
    expect(0).toBeTruthy();
  });

  test.failing("negated truthy", () => {
    expect("a").not.toBeTruthy();
  });
});

describe("toBeFalsy", () => {
  test("falsy values", () => {
    expect(false).toBeFalsy();
    expect(0).toBeFalsy();
    expect(-0).toBeFalsy();
    expect(0n).toBeFalsy();
    expect("").toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
    expect(NaN).toBeFalsy();
  });

  test("truthy values are not falsy", () => {
    expect(true).not.toBeFalsy();
    expect(1).not.toBeFalsy();
    expect("0").not.toBeFalsy();
    expect({}).not.toBeFalsy();
    expect([]).not.toBeFalsy();
    expect(new Boolean(false)).not.toBeFalsy();
  });

  test.failing("empty object is not falsy", () => {
    expect({}).toBeFalsy();
  });

  test.failing("negated falsy", () => {
    expect(null).not.toBeFalsy();
  });
});
