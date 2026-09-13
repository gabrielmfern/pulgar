class Point {
  x = 0;
  y = 0;
}

describe("toStrictEqual", () => {
  test("undefined properties count", () => {
    expect({ a: undefined, b: 2 }).toEqual({ b: 2 });
    expect({ a: undefined, b: 2 }).not.toStrictEqual({ b: 2 });
    expect({ a: undefined, b: 2 }).toStrictEqual({ b: 2, a: undefined });
  });

  test("array holes differ from undefined", () => {
    expect([, 1]).toEqual([undefined, 1]);
    expect([, 1]).not.toStrictEqual([undefined, 1]);
    expect([, 1]).toStrictEqual([, 1]);
  });

  test("class instances differ from plain objects", () => {
    const point = Object.assign(Object.create(Point.prototype), { x: 1, y: 2 });
    expect(point).toEqual({ x: 1, y: 2 });
    expect(point).not.toStrictEqual({ x: 1, y: 2 });
    expect(point).toStrictEqual(Object.assign(Object.create(Point.prototype), { x: 1, y: 2 }));
  });

  test("null prototype differs from object prototype", () => {
    expect(Object.create(null)).toEqual({});
    expect(Object.create(null)).not.toStrictEqual({});
  });

  test("nested values are strict too", () => {
    expect({ inner: { a: undefined } }).not.toStrictEqual({ inner: {} });
    expect([[, 1]]).not.toStrictEqual([[undefined, 1]]);
  });
});
