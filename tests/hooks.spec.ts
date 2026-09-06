import { createServer, type Server } from "node:http";

const order: string[] = [];

beforeEach(() => {
  order.push("file beforeEach");
});
afterEach(() => {
  order.push("file afterEach");
});

describe("outer", () => {
  beforeAll(() => {
    order.push("outer beforeAll");
  });
  afterAll(() => {
    order.push("outer afterAll");
  });
  beforeEach(() => {
    order.push("outer beforeEach");
  });
  afterEach(() => {
    order.push("outer afterEach");
  });

  describe("inner", () => {
    beforeAll(() => {
      order.push("inner beforeAll");
    });
    afterAll(() => {
      order.push("inner afterAll");
    });
    beforeEach(() => {
      order.push("inner beforeEach");
    });
    afterEach(() => {
      order.push("inner afterEach");
    });

    test("first", () => {
      order.push("first body");
    });

    test("second", () => {
      order.push("second body");
      expect(order).toEqual([
        "outer beforeAll",
        "inner beforeAll",
        "file beforeEach",
        "outer beforeEach",
        "inner beforeEach",
        "first body",
        "inner afterEach",
        "outer afterEach",
        "file afterEach",
        "file beforeEach",
        "outer beforeEach",
        "inner beforeEach",
        "second body",
      ]);
    });
  });
});

test("afterAll runs innermost first, then outer", () => {
  const innerIndex = order.indexOf("inner afterAll");
  const outerIndex = order.indexOf("outer afterAll");
  expect(innerIndex).toBeGreaterThan(-1);
  expect(outerIndex).toBe(innerIndex + 1);
});

describe("multiple afterEach hooks in one suite", () => {
  const seen: string[] = [];

  afterEach(() => {
    seen.push("first registered");
  });
  afterEach(() => {
    seen.push("second registered");
  });

  test("a", () => {
    expect(true).toBe(true);
  });

  test("b, checking the previous test's afterEach order", () => {
    expect(seen).toEqual(["second registered", "first registered"]);
  });
});

let brokenSetupBodyRan = false;
describe("a suite whose setup is broken", () => {
  beforeEach(() => {
    throw new Error("could not connect to the database");
  });

  test.fails("never runs", () => {
    brokenSetupBodyRan = true;
  });
});

test("a failing beforeEach skips the test body", () => {
  expect(brokenSetupBodyRan).toBe(false);
});

describe("a suite with an async server fixture", () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    server = createServer((_req, res) => res.end("ok"));
    await new Promise<void>((resolve) => server.listen(0, resolve));
    port = (server.address() as { port: number }).port;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  test("the server responds", async () => {
    const response = await fetch(`http://localhost:${port}/`);
    expect(await response.text()).toBe("ok");
  });
});
