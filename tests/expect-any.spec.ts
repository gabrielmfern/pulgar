describe("expect.any", () => {
  test("primitives and their wrappers", () => {
    expect("foo").toEqual(expect.any(String));
    expect(new String("foo")).toEqual(expect.any(String));
    expect(1).toEqual(expect.any(Number));
    expect(NaN).toEqual(expect.any(Number));
    expect(true).toEqual(expect.any(Boolean));
    expect(10n).toEqual(expect.any(BigInt));
    expect(Symbol("s")).toEqual(expect.any(Symbol));
    expect(() => {}).toEqual(expect.any(Function));
    expect(class {}).toEqual(expect.any(Function));
    expect(1).not.toEqual(expect.any(String));
    expect("1").not.toEqual(expect.any(Number));
  });

  test("Object matches anything typeof object, including null", () => {
    expect({}).toEqual(expect.any(Object));
    expect([]).toEqual(expect.any(Object));
    expect(null).toEqual(expect.any(Object));
    expect(undefined).not.toEqual(expect.any(Object));
    expect(() => {}).not.toEqual(expect.any(Object));
  });

  test("classes use instanceof", () => {
    class Animal {}
    class Dog extends Animal {}
    expect(new Dog()).toEqual(expect.any(Dog));
    expect(new Dog()).toEqual(expect.any(Animal));
    expect(new Animal()).not.toEqual(expect.any(Dog));
    expect(new Date()).toEqual(expect.any(Date));
    expect(new TypeError("x")).toEqual(expect.any(Error));
    expect([]).toEqual(expect.any(Array));
  });

  test("nested inside objects and arrays", () => {
    const issue = { kind: "schema", validate: () => {}, path: [1, "a"] };
    expect(issue).toEqual({
      kind: expect.any(String),
      validate: expect.any(Function),
      path: [expect.any(Number), "a"],
    });
    expect(issue).toStrictEqual({
      kind: "schema",
      validate: expect.any(Function),
      path: expect.any(Array),
    });
    expect([{ id: 1 }, { id: 2 }]).toContainEqual({ id: expect.any(Number) });
    expect({ a: 1 }).not.toEqual({ a: expect.any(String) });
  });

  test("on the actual side", () => {
    expect(expect.any(Number)).toEqual(3);
    expect({ a: expect.any(Number) }).toEqual({ a: 3 });
  });

  test("throws without a constructor", () => {
    expect(() => expect.any(undefined)).toThrow(TypeError);
  });

  test.failing("mismatch fails", () => {
    expect({ fn: 1 }).toEqual({ fn: expect.any(Function) });
  });
});
