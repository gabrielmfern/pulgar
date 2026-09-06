describe("toThrow", () => {
  test("any throw", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow();
    expect(() => {
      throw "a string";
    }).toThrow();
    expect(() => {
      throw 42;
    }).toThrow();
    expect(() => {
      throw null;
    }).toThrow();
  });

  test("no throw", () => {
    expect(() => {}).not.toThrow();
    expect(() => {}).not.toThrow("boom");
    expect(() => {}).not.toThrow(/boom/);
    expect(() => {}).not.toThrow(Error);
    expect(() => {}).not.toThrow(new Error("boom"));
  });

  test("message substring", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow("boom");
    expect(() => {
      throw new Error("boom");
    }).toThrow("oo");
    expect(() => {
      throw new Error("boom");
    }).not.toThrow("bang");
    expect(() => {
      throw "a string";
    }).toThrow("string");
    expect(() => {
      throw new Error("");
    }).toThrow("");
    expect(() => {
      throw new Error("boom");
    }).not.toThrow("");
    expect(() => {
      throw 42;
    }).not.toThrow("42");
  });

  test("message regexp", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow(/^bo+m$/);
    expect(() => {
      throw new Error("boom");
    }).not.toThrow(/^oom$/);
    expect(() => {
      throw "a string";
    }).toThrow(/^a str/);
    expect(() => {
      throw 42;
    }).not.toThrow(/42/);
  });

  test("constructor", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow(Error);
    expect(() => {
      throw new Error("boom");
    }).not.toThrow(TypeError);
    expect(() => {
      throw new TypeError("boom");
    }).toThrow(TypeError);
    expect(() => {
      throw new TypeError("boom");
    }).toThrow(Error);
    expect(() => {
      throw "a string";
    }).not.toThrow(Error);
  });

  test("error instance", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow(new Error("boom"));
    expect(() => {
      throw new Error("boom");
    }).not.toThrow(new Error("bang"));
    expect(() => {
      throw new Error("boom");
    }).not.toThrow(new TypeError("boom"));
  });

  test("toThrowError is the same", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrowError();
    expect(() => {
      throw new Error("boom");
    }).toThrowError("boom");
    expect(() => {
      throw new Error("boom");
    }).toThrowError(/boom/);
    expect(() => {
      throw new Error("boom");
    }).toThrowError(Error);
    expect(() => {}).not.toThrowError();
  });

  test("the thrown error does not escape the test", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow();
    expect(1 + 1).toBe(2);
  });

  test.failing("didn't throw", () => {
    expect(() => {}).toThrow();
  });

  test.failing("didn't throw with expected message", () => {
    expect(() => {}).toThrow("boom");
  });

  test.failing("negated any throw", () => {
    expect(() => {
      throw new Error("boom");
    }).not.toThrow();
  });

  test.failing("wrong message", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow("bang");
  });

  test.failing("wrong regexp", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow(/bang/);
  });

  test.failing("wrong constructor", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow(TypeError);
  });

  test.failing("wrong error instance", () => {
    expect(() => {
      throw new Error("boom");
    }).toThrow(new Error("bang"));
  });

  test.failing("negated matching message", () => {
    expect(() => {
      throw new Error("boom");
    }).not.toThrow("boom");
  });

  test.failing("received is not a function", () => {
    expect(new Error("boom")).toThrow();
  });

  test.failing("unsupported expected", () => {
    expect(() => {
      throw new Error("boom");
      // @ts-expect-error
    }).toThrow(42);
  });
});
