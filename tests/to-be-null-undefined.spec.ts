describe("toBeNull", () => {
  test("null", () => {
    expect(null).toBeNull();
  });

  test("everything else is not null", () => {
    expect(undefined).not.toBeNull();
    expect(0).not.toBeNull();
    expect("").not.toBeNull();
    expect(false).not.toBeNull();
    expect(NaN).not.toBeNull();
    expect({}).not.toBeNull();
    expect([]).not.toBeNull();
    expect(() => {}).not.toBeNull();
  });

  test.failing("undefined is not null", () => {
    expect(undefined).toBeNull();
  });

  test.failing("0 is not null", () => {
    expect(0).toBeNull();
  });

  test.failing("negated null", () => {
    expect(null).not.toBeNull();
  });
});

describe("toBeUndefined", () => {
  test("undefined", () => {
    expect(undefined).toBeUndefined();
    expect(void 0).toBeUndefined();
    expect(({} as { a?: number }).a).toBeUndefined();
  });

  test("everything else is not undefined", () => {
    expect(null).not.toBeUndefined();
    expect(0).not.toBeUndefined();
    expect("").not.toBeUndefined();
    expect(false).not.toBeUndefined();
    expect(NaN).not.toBeUndefined();
    expect({}).not.toBeUndefined();
    expect([]).not.toBeUndefined();
    expect(() => {}).not.toBeUndefined();
  });

  test.failing("null is not undefined", () => {
    expect(null).toBeUndefined();
  });

  test.failing("0 is not undefined", () => {
    expect(0).toBeUndefined();
  });

  test.failing("negated undefined", () => {
    expect(undefined).not.toBeUndefined();
  });
});
