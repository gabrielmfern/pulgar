describe("toBeTypeOf", () => {
  test("every typeof result", () => {
    expect(undefined).toBeTypeOf("undefined");
    expect(true).toBeTypeOf("boolean");
    expect(1).toBeTypeOf("number");
    expect(NaN).toBeTypeOf("number");
    expect("a").toBeTypeOf("string");
    expect(Symbol("a")).toBeTypeOf("symbol");
    expect(1n).toBeTypeOf("bigint");
    expect(() => {}).toBeTypeOf("function");
    expect(class {}).toBeTypeOf("function");
    expect({}).toBeTypeOf("object");
    expect([]).toBeTypeOf("object");
    expect(null).toBeTypeOf("object");
    expect(new Date()).toBeTypeOf("object");
  });

  test("negated", () => {
    expect(1).not.toBeTypeOf("string");
    expect("1").not.toBeTypeOf("number");
    expect(null).not.toBeTypeOf("undefined");
    expect(() => {}).not.toBeTypeOf("object");
  });

  test.failing("wrong type", () => {
    expect(1).toBeTypeOf("string");
  });

  test.failing("null is an object", () => {
    // @ts-expect-error
    expect(null).toBeTypeOf("null");
  });

  test.failing("negated matching type", () => {
    expect(1).not.toBeTypeOf("number");
  });

  test.failing("expected is not a string", () => {
    // @ts-expect-error
    expect(1).toBeTypeOf(Number);
  });
});
