import {
  buildCmsGroupContentUrl,
  getCmsApiBaseUrlFromEnv,
  parseCmsChampionshipGroupJson,
} from "@/lib/api/cms/groups-content.api";
import type { CmsGroupChampionshipResponse } from "@/lib/api/cms/models/championship.types";
import type { ChampionshipRaw, Race } from "@/types";

/** Conservé pour compatibilité legacy ; le flux principal est 100% CMS dynamique. */
export const CHAMPIONSHIPS_CATALOG_FALLBACK: ChampionshipRaw[] = [];

const CMS_CACHE_TTL_MS = 90_000;

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const championshipsCatalogCache = new Map<string, CacheEntry<FetchChampionshipsCatalogResult>>();
const championshipsCatalogInFlight = new Map<string, Promise<FetchChampionshipsCatalogResult>>();
const upcomingRacesCache = new Map<string, CacheEntry<FetchUpcomingRacesResult>>();
const upcomingRacesInFlight = new Map<string, Promise<FetchUpcomingRacesResult>>();
const upcomingRacesFeedCache = new Map<string, CacheEntry<FetchUpcomingRacesFeedResult>>();
const upcomingRacesFeedInFlight = new Map<string, Promise<FetchUpcomingRacesFeedResult>>();

const getCached = <T>(store: Map<string, CacheEntry<T>>, key: string): T | null => {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  return hit.value;
};

const setCached = <T>(store: Map<string, CacheEntry<T>>, key: string, value: T): void => {
  store.set(key, { value, expiresAt: Date.now() + CMS_CACHE_TTL_MS });
};

const normalizeLinkValue = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
};

const isUpperToken = (token: string) => token.length <= 4;

const toDisplayLabel = (linkValue: string): string =>
  linkValue
    .split("-")
    .filter(Boolean)
    .map((token) => (isUpperToken(token) ? token.toUpperCase() : `${token[0].toUpperCase()}${token.slice(1)}`))
    .join(" ");

const toChampionshipId = (linkValue: string): string =>
  linkValue.replace(/[^a-z0-9]+/g, "").toUpperCase().slice(0, 24) || "X";

const toDynamicColor = (seed: string): string => {
  const hue = hashString(seed) % 360;
  return `hsl(${hue} 72% 52%)`;
};

export const mapChampionshipLinkValueToRaw = (raw: string): ChampionshipRaw | null => {
  const v = normalizeLinkValue(raw);
  if (!v) return null;

  return {
    id: toChampionshipId(v),
    nameKey: "",
    color: toDynamicColor(v),
    linkValue: v,
    displayLabel: toDisplayLabel(v) || raw.trim(),
  };
};

const sortCatalog = (list: ChampionshipRaw[]): ChampionshipRaw[] =>
  [...list].sort((a, b) =>
    (a.displayLabel ?? a.linkValue ?? a.id).localeCompare(b.displayLabel ?? b.linkValue ?? b.id)
  );

export const buildChampionshipGroupContentUrl = (
  baseUrl: string,
  options: {
    pairs?: { field: string; value: string }[];
    status?: string;
    limit?: number;
    page?: number;
    orderBy?: string;
    order?: "asc" | "desc";
  } = {}
): string => buildCmsGroupContentUrl(baseUrl, "championship", options);

export const mapGroupChampionshipResponseToCatalog = (
  payload: CmsGroupChampionshipResponse
): ChampionshipRaw[] => {
  const fromLinks = payload.meta?.availableLinkValuesByField?.championship;

  if (Array.isArray(fromLinks) && fromLinks.length > 0) {
    const out: ChampionshipRaw[] = [];
    const seen = new Set<string>();
    for (const raw of fromLinks) {
      const mapped = mapChampionshipLinkValueToRaw(String(raw));
      if (!mapped || seen.has(mapped.id)) continue;
      seen.add(mapped.id);
      out.push(mapped);
    }
    if (out.length > 0) return sortCatalog(out);
  }

  const blocks = payload.data ?? [];
  const seen = new Set<string>();
  const out: ChampionshipRaw[] = [];

  for (const block of blocks) {
    const slug = block.collection?.slug?.toLowerCase?.() ?? "";
    const fromCalendarSlug = slug.replace(/^calendrier-/, "").replace(/-eu$/, "");
    const mapped = mapChampionshipLinkValueToRaw(fromCalendarSlug);
    if (!mapped || seen.has(mapped.id)) continue;
    seen.add(mapped.id);
    out.push(mapped);
  }
  if (out.length > 0) return sortCatalog(out);
  return [];
};

export const CMS_CHAMPIONSHIPS_API_ERROR_KEY = "cms.apiError";

export type FetchChampionshipsCatalogResult =
  | { ok: true; data: ChampionshipRaw[] }
  | { ok: false; error: string };

export const fetchChampionshipsCatalog =
  async (): Promise<FetchChampionshipsCatalogResult> => {
    const cacheKey = "championships-catalog:published";
    const cached = getCached(championshipsCatalogCache, cacheKey);
    if (cached) return cached;

    const inFlight = championshipsCatalogInFlight.get(cacheKey);
    if (inFlight) return inFlight;

    const base = getCmsApiBaseUrlFromEnv();
    if (!base) return { ok: false, error: CMS_CHAMPIONSHIPS_API_ERROR_KEY };

    const request = (async (): Promise<FetchChampionshipsCatalogResult> => {
      try {
        const res = await fetch(buildChampionshipGroupContentUrl(base, { status: "published" }));
        if (!res.ok) {
          console.warn("[cms] championship group:", res.status, res.statusText);
          return { ok: false, error: CMS_CHAMPIONSHIPS_API_ERROR_KEY };
        }
        const json = await parseCmsChampionshipGroupJson(res);
        const data = mapGroupChampionshipResponseToCatalog(json);
        const result: FetchChampionshipsCatalogResult = { ok: true, data };
        setCached(championshipsCatalogCache, cacheKey, result);
        return result;
      } catch (e) {
        console.warn("[cms] championship group fetch failed:", e);
        return { ok: false, error: CMS_CHAMPIONSHIPS_API_ERROR_KEY };
      } finally {
        championshipsCatalogInFlight.delete(cacheKey);
      }
    })();

    championshipsCatalogInFlight.set(cacheKey, request);
    return request;
  };

export type ChampionshipRaceFeedItem = {
  race: Race;
  championship: ChampionshipRaw;
};

type FetchUpcomingRacesResult =
  | { ok: true; data: ChampionshipRaceFeedItem[]; source: "upcoming" | "past" }
  | { ok: false; error: string };

export type FetchUpcomingRacesFeedResult =
  | { ok: true; data: ChampionshipRaceFeedItem[]; source: "upcoming" | "past" }
  | { ok: false; error: string };

const asNonEmpty = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const formatRaceDate = (rawDate: string, locale: string): string => {
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return rawDate;
  return new Intl.DateTimeFormat(locale || "fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const toTimestamp = (rawDate: string): number | null => {
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getTime();
};

const mapEntryToRace = (
  entry: { data: Record<string, unknown> | null },
  locale: string
): { race: Race; timestamp: number } | null => {
  const data = entry.data ?? {};
  const name = asNonEmpty(data.title) ?? asNonEmpty(data.name);
  const circuit =
    asNonEmpty(data.track_name) ??
    asNonEmpty(data.circuit) ??
    asNonEmpty(data.location) ??
    asNonEmpty(data.track) ??
    asNonEmpty(data.venue);
  const rawDate =
    asNonEmpty(data.start_date) ??
    asNonEmpty(data.end_date) ??
    asNonEmpty(data.date) ??
    asNonEmpty(data.raceDate) ??
    asNonEmpty(data.startDate) ??
    asNonEmpty(data.datetime);
  if (!name || !circuit || !rawDate) return null;
  const timestamp = toTimestamp(rawDate);
  if (!timestamp) return null;
  return {
    race: { name, circuit, date: formatRaceDate(rawDate, locale) },
    timestamp,
  };
};

export const fetchUpcomingRacesByChampionship = async (
  championshipLinkValue: string,
  locale: string
): Promise<FetchUpcomingRacesResult> => {
  const normalized = normalizeLinkValue(championshipLinkValue);
  if (!normalized) return { ok: true, data: [], source: "upcoming" };

  const feed = await fetchUpcomingRacesFeed(locale);
  if (!feed.ok) return feed;

  const selected = feed.data.filter((item) => item.championship.linkValue === normalized);
  const others = feed.data.filter((item) => item.championship.linkValue !== normalized);
  return {
    ok: true,
    source: feed.source,
    data: [...selected, ...others],
  };
};

export const fetchUpcomingRacesFeed = async (
  locale: string
): Promise<FetchUpcomingRacesFeedResult> => {
  const feedCacheKey = `upcoming-races-feed:${locale || "fr"}`;
  const cachedFeed = getCached(upcomingRacesFeedCache, feedCacheKey);
  if (cachedFeed) return cachedFeed;

  const inFlightFeed = upcomingRacesFeedInFlight.get(feedCacheKey);
  if (inFlightFeed) return inFlightFeed;

  const base = getCmsApiBaseUrlFromEnv();
  if (!base) return { ok: false, error: CMS_CHAMPIONSHIPS_API_ERROR_KEY };

  const request = (async (): Promise<FetchUpcomingRacesFeedResult> => {
    try {
      const url = buildChampionshipGroupContentUrl(base, {
        status: "published",
        limit: 50,
      });
      console.log("[cms:races] request", {
        locale,
        url,
      });
      const response = await fetch(url);
      if (!response.ok) {
        console.warn("[cms] upcoming races:", response.status, response.statusText);
        return { ok: false, error: CMS_CHAMPIONSHIPS_API_ERROR_KEY };
      }
      const payload = await parseCmsChampionshipGroupJson(response);
      console.log("[cms:races] payload meta", {
        collectionsCount: payload.meta?.collectionsCount,
        totalItems: payload.meta?.totalItems,
        blocks: payload.data?.length ?? 0,
      });
      const entries = (payload.data ?? []).flatMap((block) => block.data ?? []);

      const mapped = entries
        .map((entry) => {
          const raceData = mapEntryToRace(entry, locale);
          if (!raceData) return null;
          const championshipField = asNonEmpty(entry.data?.championship);
          const normalizedChampionship = championshipField
            ? normalizeLinkValue(championshipField)
            : "";
          const mappedChampionship = mapChampionshipLinkValueToRaw(normalizedChampionship);
          if (!mappedChampionship) return null;
          return {
            ...raceData,
            championship: mappedChampionship,
          };
        })
        .filter(
          (
            race
          ): race is {
            race: Race;
            timestamp: number;
            championship: ChampionshipRaw;
          } => race !== null
        );
      console.log("[cms:races] mapped entries", {
        mapped: mapped.length,
        dropped: entries.length - mapped.length,
      });

      const now = Date.now();
      const upcoming = mapped
        .filter((item) => item.timestamp >= now)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((item) => ({
          race: item.race,
          championship: item.championship,
        }));
      if (upcoming.length > 0) {
        console.log("[cms:races] result", { source: "upcoming", count: upcoming.length });
        const result: FetchUpcomingRacesFeedResult = {
          ok: true,
          data: upcoming,
          source: "upcoming",
        };
        setCached(upcomingRacesFeedCache, feedCacheKey, result);
        return result;
      }

      const past = mapped
        .filter((item) => item.timestamp < now)
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((item) => ({
          race: item.race,
          championship: item.championship,
        }));
      console.log("[cms:races] result", { source: "past", count: past.length });
      const result: FetchUpcomingRacesFeedResult = { ok: true, data: past, source: "past" };
      setCached(upcomingRacesFeedCache, feedCacheKey, result);
      return result;
    } catch (error) {
      console.warn("[cms] upcoming races fetch failed:", error);
      return { ok: false, error: CMS_CHAMPIONSHIPS_API_ERROR_KEY };
    } finally {
      upcomingRacesFeedInFlight.delete(feedCacheKey);
    }
  })();

  upcomingRacesFeedInFlight.set(feedCacheKey, request);
  return request;
};

export const invalidateChampionshipCmsCache = () => {
  championshipsCatalogCache.clear();
  championshipsCatalogInFlight.clear();
  upcomingRacesCache.clear();
  upcomingRacesInFlight.clear();
  upcomingRacesFeedCache.clear();
  upcomingRacesFeedInFlight.clear();
};
