import {
  fetchArticlesFeed,
  invalidateArticlesCmsCache,
} from "@/lib/api/cms/controllers/articles.controller";

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  invalidateArticlesCmsCache();
  jest.resetAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

const PAST_DATE = "2024-06-15T10:00:00Z";
const OLDER_DATE = "2023-01-01T10:00:00Z";

const mockFetchWith = (entries: object[]) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: entries, meta: { total: entries.length } }),
  }) as jest.Mock;
};

const makeEntry = (overrides: Record<string, unknown> = {}) => ({
  id: "1",
  slug: "test-article",
  data: {
    title: "Test Article",
    published_at: PAST_DATE,
    body: "Word ".repeat(400), // 400 words → 2 min read
    category: "analysis",
    championship: "elms",
    ...overrides,
  },
});

describe("fetchArticlesFeed", () => {
  it("returns ok:false when CMS base URL missing", async () => {
    delete process.env.EXPO_PUBLIC_CMS_BASE_URL;
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(false);
  });

  it("returns ok:false when fetch fails", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, statusText: "Error" }) as jest.Mock;
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(false);
  });

  it("returns ok:false when fetch throws", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    global.fetch = jest.fn().mockRejectedValue(new Error("network error")) as jest.Mock;
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(false);
  });

  it("maps valid entry to article item", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry()]);
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toHaveLength(1);
    const item = result.data[0]!;
    expect(item.title).toBe("Test Article");
    expect(item.championship?.id).toBe("ELMS");
    expect(item.category).toBe("analysis");
    expect(item.publishedTimestamp).toBeGreaterThan(0);
  });

  it("drops entries missing title", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry({ title: undefined })]);
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toHaveLength(0);
  });

  it("drops entries missing published_at", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry({ published_at: undefined })]);
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toHaveLength(0);
  });

  it("sorts articles newest-first", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([
      { ...makeEntry({ published_at: OLDER_DATE, title: "Older" }), id: "1" },
      { ...makeEntry({ published_at: PAST_DATE, title: "Newer" }), id: "2" },
    ]);
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data[0]?.title).toBe("Newer");
    expect(result.data[1]?.title).toBe("Older");
  });

  it("calculates read time from body word count", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry({ body: "Word ".repeat(400) })]); // 400 words → 2 min
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data[0]?.readTimeMinutes).toBe(2);
  });

  it("defaults read time to 1 min for short body", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry({ body: "Short article." })]);
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data[0]?.readTimeMinutes).toBe(1);
  });

  it("passes category value through as-is", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    for (const category of ["analysis", "result", "preview", "interview"]) {
      invalidateArticlesCmsCache();
      mockFetchWith([makeEntry({ category })]);
      const result = await fetchArticlesFeed("fr");
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.data[0]?.category).toBe(category);
    }
  });

  it("leaves category undefined when missing", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry({ category: undefined })]);
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data[0]?.category).toBeUndefined();
  });

  it("leaves championship undefined when missing", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry({ championship: undefined })]);
    const result = await fetchArticlesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data[0]?.championship).toBeUndefined();
  });
});
