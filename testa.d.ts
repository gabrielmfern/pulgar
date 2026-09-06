interface ImportMeta {
  dir: string;
}

type TestCallback = (
  name: string,
  callback: (() => void) | (() => Promise<void>),
  timeoutTime?: number,
) => void;

declare const describe: TestCallback & {
  skipped: TestCallback;
  skip: TestCallback;
  skips: TestCallback;

  skipIf(condition: any): TestCallback;
  runIf(condition: any): TestCallback;
  if(condition: any): TestCallback;

  todo(name: string): void;
};

declare const test: TestCallback & {
  failing: TestCallback;
  fail: TestCallback;
  fails: TestCallback;

  skipped: TestCallback;
  skip: TestCallback;
  skips: TestCallback;

  skipIf(condition: any): TestCallback;
  runIf(condition: any): TestCallback;
  if(condition: any): TestCallback;

  todo(name: string): void;
}

declare const it: typeof test;

type Assertions<T> = {
  /**
    * Does not throw when the expectation is false.
    */
  toBe(expected: T): void;
  toEqual(expected: unknown): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeDefined(): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toThrow(expected?: string | RegExp | Error | (new (...args: any[]) => any)): void;
  toThrowError(expected?: string | RegExp | Error | (new (...args: any[]) => any)): void;
  toBeTypeOf(expected: "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined"): void;
  toBeInstanceOf(expected: new (...args: any[]) => any): void;
  toBeGreaterThan(expected: number | bigint): void;
  toBeGreaterThanOrEqual(expected: number | bigint): void;
  toBeLessThan(expected: number | bigint): void;
  toBeLessThanOrEqual(expected: number | bigint): void;
  toContain(item: unknown): void;
};

declare function expect<T>(received: T): {
  not: Assertions<T>;
} & Assertions<T>;

