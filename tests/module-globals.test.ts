import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const thisFile = join(import.meta.dirname ?? "", "module-globals.test.ts");

test("import.meta.dirname should be defined", () => {
  expect(import.meta.dirname).toBeDefined();
});

test("import.meta.url points at this file", () => {
  expect(import.meta.url).toBe(pathToFileURL(thisFile).href);
});

test("import.meta.dirname and import.meta.dir agree with the file's directory", () => {
  expect(import.meta.dirname).toBe(dirname(thisFile));
});

test("import.meta.filename matches the file path", () => {
  expect(import.meta.filename).toBe(thisFile);
});

test("__dirname and __filename match their import.meta counterparts", () => {
  expect(__dirname).toBe(import.meta.dirname);
  expect(__filename).toBe(import.meta.filename);
});
