describe("toHaveLength", () => {
  test("arrays and strings", () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect([]).toHaveLength(0);
    expect("abc").toHaveLength(3);
    expect("").toHaveLength(0);
    expect([1, 2, 3]).not.toHaveLength(2);
  });

  test("maps and sets use size", () => {
    expect(new Set([1, 2])).toHaveLength(2);
    expect(new Map([["a", 1]])).toHaveLength(1);
    expect(new Set()).not.toHaveLength(1);
  });

  test("anything with a length property", () => {
    expect({ length: 5 }).toHaveLength(5);
    expect(new Uint8Array(4)).toHaveLength(4);
    expect((a: number, b: number) => a + b).toHaveLength(2);
    expect(Buffer.from("hi")).toHaveLength(2);
  });

  test.failing("wrong length", () => {
    expect([1, 2, 3]).toHaveLength(2);
  });

  test.failing("wrong size", () => {
    expect(new Set([1])).toHaveLength(2);
  });

  test.failing("negated matching length", () => {
    expect("abc").not.toHaveLength(3);
  });

  test.failing("no length property", () => {
    expect({ a: 1 }).toHaveLength(1);
  });

  test.failing("actual is a number", () => {
    expect(123).toHaveLength(3);
  });

  test.failing("actual is null", () => {
    expect(null).toHaveLength(0);
  });

  test.failing("expected is not a number", () => {
    // @ts-expect-error
    expect([1]).toHaveLength("1");
  });
});
