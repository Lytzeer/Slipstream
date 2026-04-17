import {
  mapChampionshipLinkValueToRaw,
  mapGroupChampionshipResponseToCatalog,
} from "@/lib/api/cms/controllers/championship.controller";
import type { CmsGroupChampionshipResponse } from "@/lib/api/cms/models/championship.types";

// ─── mapChampionshipLinkValueToRaw ───────────────────────────────────────────

describe("mapChampionshipLinkValueToRaw", () => {
  it("returns null for empty string", () => {
    expect(mapChampionshipLinkValueToRaw("")).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    expect(mapChampionshipLinkValueToRaw("   ")).toBeNull();
  });

  it("generates uppercase id from link value", () => {
    const result = mapChampionshipLinkValueToRaw("elms");
    expect(result?.id).toBe("ELMS");
  });

  it("strips hyphens from id", () => {
    const result = mapChampionshipLinkValueToRaw("gt-world-challenge");
    expect(result?.id).toBe("GTWORLDCHALLENGE");
  });

  it("normalizes link value to lowercase", () => {
    const result = mapChampionshipLinkValueToRaw("ELMS");
    expect(result?.linkValue).toBe("elms");
  });

  it("normalizes underscores to hyphens in link value", () => {
    const result = mapChampionshipLinkValueToRaw("gt_world");
    expect(result?.linkValue).toBe("gt-world");
  });

  it("generates a display label from link value", () => {
    const result = mapChampionshipLinkValueToRaw("elms");
    expect(result?.displayLabel).toBe("ELMS");
  });

  it("uppercases short tokens in display label", () => {
    const result = mapChampionshipLinkValueToRaw("le-mans-cup");
    expect(result?.displayLabel).toBe("LE MANS CUP");
  });

  it("returns a color string", () => {
    const result = mapChampionshipLinkValueToRaw("elms");
    expect(typeof result?.color).toBe("string");
    expect(result?.color.length).toBeGreaterThan(0);
  });

  it("produces same id for same input", () => {
    const a = mapChampionshipLinkValueToRaw("lmc");
    const b = mapChampionshipLinkValueToRaw("lmc");
    expect(a?.id).toBe(b?.id);
    expect(a?.color).toBe(b?.color);
  });

  it("truncates id to 24 characters", () => {
    const result = mapChampionshipLinkValueToRaw("a-very-long-championship-name-that-exceeds-limit");
    expect(result!.id.length).toBeLessThanOrEqual(24);
  });
});

// ─── mapGroupChampionshipResponseToCatalog ────────────────────────────────────

describe("mapGroupChampionshipResponseToCatalog", () => {
  it("returns empty array when payload is empty", () => {
    const payload: CmsGroupChampionshipResponse = { data: [], meta: {} };
    expect(mapGroupChampionshipResponseToCatalog(payload)).toEqual([]);
  });

  it("builds catalog from availableLinkValuesByField when present", () => {
    const payload: CmsGroupChampionshipResponse = {
      data: [],
      meta: {
        availableLinkValuesByField: {
          championship: ["elms", "lmc"],
        },
      },
    };
    const result = mapGroupChampionshipResponseToCatalog(payload);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id)).toEqual(expect.arrayContaining(["ELMS", "LMC"]));
  });

  it("deduplicates championships with same id", () => {
    const payload: CmsGroupChampionshipResponse = {
      data: [],
      meta: {
        availableLinkValuesByField: {
          championship: ["elms", "elms", "ELMS"],
        },
      },
    };
    const result = mapGroupChampionshipResponseToCatalog(payload);
    expect(result.filter((c) => c.id === "ELMS")).toHaveLength(1);
  });

  it("falls back to block slugs when no link values in meta", () => {
    const payload: CmsGroupChampionshipResponse = {
      data: [
        { collection: { id: "1", slug: "calendrier-elms", name: "ELMS" }, data: [] },
        { collection: { id: "2", slug: "calendrier-lmc", name: "LMC" }, data: [] },
      ],
      meta: {},
    };
    const result = mapGroupChampionshipResponseToCatalog(payload);
    expect(result.map((c) => c.id)).toEqual(expect.arrayContaining(["ELMS", "LMC"]));
  });

  it("strips 'calendrier-' prefix and '-eu' suffix from slug", () => {
    const payload: CmsGroupChampionshipResponse = {
      data: [{ collection: { id: "3", slug: "calendrier-gt-world-eu", name: "GT World" }, data: [] }],
      meta: {},
    };
    const result = mapGroupChampionshipResponseToCatalog(payload);
    expect(result[0]?.id).toBe("GTWORLD");
  });
});
