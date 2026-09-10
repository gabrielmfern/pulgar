test.failing("object", () => {
  expect({ name: "gabriel", port: 3000, tags: ["a", "b"] }).toEqual({ name: "gabriel", port: 3001, tags: ["a", "c", "d"] });
});

test.failing("string", () => {
  expect("hayllo").toEqual("hello");
});

test.failing("number", () => {
  expect(1).toEqual(2);
});

test.failing("array", () => {
  expect([1, 2, 3]).toEqual([1, 3]);
});

test.failing("nested", () => {
  expect({ a: { b: { c: [1, { d: "x" }] } } }).toEqual({ a: { b: { c: [1, { d: "y" }] } } });
});

test.failing("multiline string", () => {
  expect("line 1\nline 2\nline 3").toEqual("line 1\nline two\nline 3");
});

test.failing("different types", () => {
  expect({ a: 1 }).toEqual([1]);
});
