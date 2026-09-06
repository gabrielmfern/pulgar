describe("toContain", () => {
  test("strings", () => {
    expect("hello world").toContain("world");
    expect("hello world").toContain("");
    expect("héllo").toContain("é");
    expect("hello world").not.toContain("mars");
  });

  test("arrays", () => {
    expect([1, 2, 3]).toContain(2);
    expect(["a", "b"]).toContain("b");
    expect([1, 2, 3]).not.toContain(4);
    expect([]).not.toContain(undefined);
  });

  test("arrays compare with strict equality", () => {
    const item = { a: 1 };
    expect([item]).toContain(item);
    expect([{ a: 1 }]).not.toContain({ a: 1 });
    expect([NaN]).not.toContain(NaN);
    expect([0]).toContain(-0);
    expect([1]).not.toContain("1");
  });

  test("other iterables", () => {
    expect(new Set([1, 2])).toContain(2);
    expect(new Set([1, 2])).not.toContain(3);
    expect(new Uint8Array([1, 2])).toContain(2);
    expect(
      (function* () {
        yield "a";
        yield "b";
      })(),
    ).toContain("b");
    expect(new Map([["k", "v"]])).not.toContain("v");
  });

  test("plain objects contain nothing", () => {
    expect({ a: 1 }).not.toContain(1);
    expect({ a: 1 }).not.toContain("a");
  });

  test.failing("string does not contain", () => {
    expect("hello world").toContain("mars");
  });

  test.failing("array does not contain", () => {
    expect([1, 2, 3]).toContain(4);
  });

  test.failing("set does not contain", () => {
    expect(new Set([1])).toContain(2);
  });

  test.failing("negated string", () => {
    expect("hello world").not.toContain("world");
  });

  test.failing("negated array", () => {
    expect([1, 2, 3]).not.toContain(2);
  });

  test.failing("expected is not a string", () => {
    expect("hello world").toContain(1);
  });

  test.failing("actual is a number", () => {
    expect(123).toContain(2);
  });

  test.failing("actual is null", () => {
    expect(null).toContain(2);
  });
});
