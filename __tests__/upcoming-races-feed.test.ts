import {
  fetchUpcomingRacesFeed,
  invalidateChampionshipCmsCache,
} from "@/lib/api/cms/controllers/championship.controller";

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  invalidateChampionshipCmsCache();
  jest.resetAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

const FUTURE_DATE = "2099-12-31";
const PAST_DATE = "2020-01-01";

const mockFetchWith = (entries: object[]) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: [
        {
          collection: { slug: "calendrier-elms" },
          data: entries,
        },
      ],
      meta: {
        availableLinkValuesByField: { championship: ["elms"] },
        collectionsCount: 1,
        totalItems: entries.length,
      },
    }),
  }) as jest.Mock;
};

const makeEntry = (overrides: Record<string, unknown> = {}) => ({
  data: {
    title: "Test Race",
    track_name: "Test Circuit",
    start_date: FUTURE_DATE,
    championship: "elms",
    ...overrides,
  },
});

describe("fetchUpcomingRacesFeed", () => {
  it("returns ok:false when CMS base URL missing", async () => {
    delete process.env.EXPO_PUBLIC_CMS_BASE_URL;
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(false);
  });

  it("returns ok:false when fetch fails", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, statusText: "Error" }) as jest.Mock;
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(false);
  });

  it("returns ok:false when fetch throws", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    global.fetch = jest.fn().mockRejectedValue(new Error("network error")) as jest.Mock;
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(false);
  });

  it("returns upcoming and past arrays when fetch succeeds", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry()]);
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Array.isArray(result.upcoming)).toBe(true);
    expect(Array.isArray(result.past)).toBe(true);
  });

  it("places future race in upcoming", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry({ start_date: FUTURE_DATE })]);
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.upcoming).toHaveLength(1);
    expect(result.past).toHaveLength(0);
    expect(result.upcoming[0]?.race.name).toBe("Test Race");
  });

  it("places past race in past", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry({ start_date: PAST_DATE })]);
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.past).toHaveLength(1);
    expect(result.upcoming).toHaveLength(0);
  });

  it("returns both upcoming and past simultaneously", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([
      makeEntry({ start_date: FUTURE_DATE, title: "Future Race" }),
      makeEntry({ start_date: PAST_DATE, title: "Past Race" }),
    ]);
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.upcoming).toHaveLength(1);
    expect(result.past).toHaveLength(1);
    expect(result.upcoming[0]?.race.name).toBe("Future Race");
    expect(result.past[0]?.race.name).toBe("Past Race");
  });

  it("sorts upcoming oldest-first", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([
      makeEntry({ start_date: "2099-12-31", title: "Later" }),
      makeEntry({ start_date: "2099-06-01", title: "Earlier" }),
    ]);
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.upcoming[0]?.race.name).toBe("Earlier");
    expect(result.upcoming[1]?.race.name).toBe("Later");
  });

  it("sorts past newest-first", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([
      makeEntry({ start_date: "2020-01-01", title: "Older" }),
      makeEntry({ start_date: "2021-06-01", title: "Newer" }),
    ]);
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.past[0]?.race.name).toBe("Newer");
    expect(result.past[1]?.race.name).toBe("Older");
  });

  it("drops entries missing required fields", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([
      makeEntry({ title: undefined }),
      makeEntry({ track_name: undefined }),
      makeEntry({ start_date: undefined }),
      makeEntry(),
    ]);
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.upcoming).toHaveLength(1);
  });

  it("propagates startTimestamp", async () => {
    process.env.EXPO_PUBLIC_CMS_BASE_URL = "https://cms.example.com";
    mockFetchWith([makeEntry({ start_date: FUTURE_DATE, end_date: "2099-12-31" })]);
    const result = await fetchUpcomingRacesFeed("fr");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const item = result.upcoming[0]!;
    expect(typeof item.startTimestamp).toBe("number");
    expect(item.startTimestamp).toBeGreaterThan(0);
  });
});
