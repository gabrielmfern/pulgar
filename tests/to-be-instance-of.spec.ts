describe("toBeInstanceOf", () => {
  test("builtins", () => {
    expect(new Date()).toBeInstanceOf(Date);
    expect(new Date()).toBeInstanceOf(Object);
    expect([]).toBeInstanceOf(Array);
    expect(new TypeError("boom")).toBeInstanceOf(TypeError);
    expect(new TypeError("boom")).toBeInstanceOf(Error);
    expect(new Map()).toBeInstanceOf(Map);
    expect(() => {}).toBeInstanceOf(Function);
  });

  test("classes", () => {
    class Animal {}
    class Dog extends Animal {}
    expect(new Dog()).toBeInstanceOf(Dog);
    expect(new Dog()).toBeInstanceOf(Animal);
    expect(new Animal()).not.toBeInstanceOf(Dog);
  });

  test("primitives are not instances", () => {
    expect(1).not.toBeInstanceOf(Number);
    expect("a").not.toBeInstanceOf(String);
    expect(true).not.toBeInstanceOf(Boolean);
    expect(null).not.toBeInstanceOf(Object);
    expect(undefined).not.toBeInstanceOf(Object);
  });

  test("unrelated constructors", () => {
    expect(new Error("boom")).not.toBeInstanceOf(TypeError);
    expect({}).not.toBeInstanceOf(Array);
    expect(new Map()).not.toBeInstanceOf(Set);
  });

  test.failing("wrong constructor", () => {
    expect({}).toBeInstanceOf(Array);
  });

  test.failing("primitive", () => {
    expect(1).toBeInstanceOf(Number);
  });

  test.failing("negated matching constructor", () => {
    expect([]).not.toBeInstanceOf(Array);
  });

  test.failing("expected is not a constructor", () => {
    // @ts-expect-error
    expect([]).toBeInstanceOf("Array");
  });
});
