import {
  clearRequestCache,
  fetchJsonCached,
  invalidateRequestCache,
} from "./requestCache";

describe("request cache", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    clearRequestCache();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: 1 }]),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test("reuses the same in-flight and cached GET response", async () => {
    const [first, second] = await Promise.all([
      fetchJsonCached("/api/patients"),
      fetchJsonCached("/api/patients"),
    ]);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(first).toEqual([{ id: 1 }]);
    expect(second).toEqual(first);
  });

  test("keeps the response cached until explicitly invalidated", async () => {
    const dateNow = jest.spyOn(Date, "now").mockReturnValue(0);

    await fetchJsonCached("/api/patients");
    dateNow.mockReturnValue(60000);
    await fetchJsonCached("/api/patients");

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("refetches after the related cache entries are invalidated", async () => {
    await fetchJsonCached("/api/patients");
    invalidateRequestCache("/api/patients");
    await fetchJsonCached("/api/patients");

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test("keeps authenticated users' cache entries separate", async () => {
    await fetchJsonCached("/api/patients", {
      headers: { Authorization: "Bearer user-one" },
    });
    await fetchJsonCached("/api/patients", {
      headers: { Authorization: "Bearer user-two" },
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
