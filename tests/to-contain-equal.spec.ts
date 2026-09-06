describe("toContainEqual", () => {
  test("arrays of objects", () => {
    expect([{ a: 1 }, { b: 2 }]).toContainEqual({ b: 2 });
    expect([{ a: { deep: [1, 2] } }]).toContainEqual({ a: { deep: [1, 2] } });
    expect([[1, 2], [3]]).toContainEqual([3]);
    expect([{ a: 1 }]).not.toContainEqual({ a: 2 });
    expect([{ a: 1 }]).toContainEqual({ a: 1, b: undefined });
  });

  test("primitives use the same equality as toEqual", () => {
    expect([1, 2, 3]).toContainEqual(2);
    expect([NaN]).toContainEqual(NaN);
    expect([0]).not.toContainEqual(-0);
    expect([1]).not.toContainEqual("1");
  });

  test("other iterables", () => {
    expect(new Set([{ a: 1 }])).toContainEqual({ a: 1 });
    expect(new Map([["k", "v"]])).toContainEqual(["k", "v"]);
    expect(new Map([["k", "v"]])).not.toContainEqual("v");
    expect(new Uint8Array([1, 2])).toContainEqual(2);
  });

  test("strings are split into characters", () => {
    expect("abc").toContainEqual("b");
    expect("abc").not.toContainEqual("bc");
  });

  test.failing("no equal element", () => {
    expect([{ a: 1 }]).toContainEqual({ a: 2 });
  });

  test.failing("negated equal element", () => {
    expect([{ a: 1 }]).not.toContainEqual({ a: 1 });
  });

  test.failing("actual is a number", () => {
    expect(123).toContainEqual(2);
  });

  test.failing("actual is undefined", () => {
    expect(undefined).toContainEqual(2);
  });
});
