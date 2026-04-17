import { getCmsApiBaseUrlFromEnv } from "@/lib/api/cms/groups-content.api";
import type { CmsArticleEntry, CmsArticlesResponse } from "@/lib/api/cms/models/articles.types";
import { mapChampionshipLinkValueToRaw } from "@/lib/api/cms/controllers/championship.controller";
import type { ChampionshipRaw } from "@/types";

const CMS_CACHE_TTL_MS = 90_000;
const CMS_ARTICLES_API_ERROR_KEY = "cms.apiError";

type CacheEntry<T> = { value: T; expiresAt: number };
const articlesFeedCache = new Map<string, CacheEntry<FetchArticlesFeedResult>>();
const articlesFeedInFlight = new Map<string, Promise<FetchArticlesFeedResult>>();
const articlesCategoriesCache = new Map<string, CacheEntry<FetchArticleCategoriesResult>>();
const articlesCategoriesInFlight = new Map<string, Promise<FetchArticleCategoriesResult>>();

const getCached = <T>(
  store: Map<string, CacheEntry<T>>,
  key: string,
): T | null => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { store.delete(key); return null; }
  return entry.value;
};

const setCached = <T>(
  store: Map<string, CacheEntry<T>>,
  key: string,
  value: T,
): void => {
  store.set(key, { value, expiresAt: Date.now() + CMS_CACHE_TTL_MS });
};

// ─── Exported types ───────────────────────────────────────────────────────────

export type CmsArticleItem = {
  id: string;
  slug?: string;
  title: string;
  author?: string;
  imageUrl?: string;
  category?: string;          // raw CMS category value for filtering
  championship?: ChampionshipRaw;
  publishedAt: string;        // formatted display date
  publishedTimestamp: number; // ms epoch for sorting
  readTimeMinutes: number;    // computed from body word count
  bodyHtml?: string;
  featured?: boolean;
};

export type FetchArticlesFeedResult =
  | { ok: true; data: CmsArticleItem[] }
  | { ok: false; error: string };

export type CmsArticleCategory = {
  id: string;   // raw value used for filtering (slug/key)
  name: string; // display label
};

export type FetchArticleCategoriesResult =
  | { ok: true; data: CmsArticleCategory[] }
  | { ok: false; error: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────

const asNonEmpty = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};


const toReadTimeMinutes = (body: string): number => {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const formatArticleDate = (rawDate: string, locale: string): string => {
  try {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return rawDate;
    return d.toLocaleDateString(locale || "fr", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return rawDate;
  }
};

const toTimestamp = (rawDate: string): number | null => {
  try {
    const ms = new Date(rawDate).getTime();
    return isNaN(ms) ? null : ms;
  } catch {
    return null;
  }
};

// ─── Entry mapper ─────────────────────────────────────────────────────────────

const mapEntryToArticle = (
  entry: CmsArticleEntry,
  locale: string,
): CmsArticleItem | null => {
  const data = entry.data ?? {};

  const title =
    asNonEmpty(data.title) ??
    asNonEmpty(data.name);
  if (!title) return null;

  const rawDate =
    asNonEmpty(data.published_at) ??
    asNonEmpty(data.publishedAt) ??
    asNonEmpty(data.date) ??
    asNonEmpty(data.createdAt) ??
    asNonEmpty(data.created_at);
  if (!rawDate) return null;

  const publishedTimestamp = toTimestamp(rawDate);
  if (!publishedTimestamp) return null;

  const imageUrl =
    asNonEmpty(data.image) ??
    asNonEmpty(data.thumbnail) ??
    asNonEmpty(data.image_url) ??
    asNonEmpty(data.cover) ??
    undefined;

  const author = asNonEmpty(data.author) ?? undefined;

  const body =
    asNonEmpty(data.body) ??
    asNonEmpty(data.content) ??
    asNonEmpty(data.description) ??
    "";
  const readTimeMinutes = toReadTimeMinutes(body);

  const category =
    asNonEmpty(data.category) ??
    asNonEmpty(data.categories) ??
    asNonEmpty(data.category_id) ??
    asNonEmpty(data.type) ??
    undefined;

  const rawChampionship =
    asNonEmpty(data.championship) ?? asNonEmpty(data.championship_id);
  const championship = rawChampionship
    ? mapChampionshipLinkValueToRaw(rawChampionship) ?? undefined
    : undefined;

  const bodyHtml =
    asNonEmpty(data.body_html) ??
    asNonEmpty(data.bodyHtml) ??
    undefined;

  const featured =
    data.featured === true || data.featured === "true" || data.featured === 1
      ? true
      : undefined;

  return {
    id: entry.id,
    slug: asNonEmpty(entry.slug) ?? undefined,
    title,
    author,
    imageUrl,
    category,
    championship,
    publishedAt: formatArticleDate(rawDate, locale),
    publishedTimestamp,
    readTimeMinutes,
    bodyHtml,
    featured,
  };
};

// ─── Main fetch ───────────────────────────────────────────────────────────────

export const fetchArticlesFeed = async (
  locale: string,
): Promise<FetchArticlesFeedResult> => {
  const cacheKey = `articles-feed:${locale || "fr"}`;

  const cached = getCached(articlesFeedCache, cacheKey);
  if (cached) return cached;

  const inFlight = articlesFeedInFlight.get(cacheKey);
  if (inFlight) return inFlight;

  const base = getCmsApiBaseUrlFromEnv();
  if (!base) return { ok: false, error: CMS_ARTICLES_API_ERROR_KEY };

  const request = (async (): Promise<FetchArticlesFeedResult> => {
    try {
      const url = `${base}/article?status=published&limit=50`;
      console.log("[cms:articles] request", { locale, url });

      const response = await fetch(url);
      if (!response.ok) {
        console.warn("[cms:articles]", response.status, response.statusText);
        return { ok: false, error: CMS_ARTICLES_API_ERROR_KEY };
      }

      const payload: CmsArticlesResponse = await response.json();
      const entries = payload.data ?? [];
      console.log("[cms:articles] entries", entries.length);

      const items = entries
        .map((entry) => mapEntryToArticle(entry, locale))
        .filter((item): item is CmsArticleItem => item !== null)
        .sort((a, b) => b.publishedTimestamp - a.publishedTimestamp);

      console.log("[cms:articles] mapped", items.length);
      const result: FetchArticlesFeedResult = { ok: true, data: items };
      setCached(articlesFeedCache, cacheKey, result);
      return result;
    } catch (error) {
      console.warn("[cms:articles] fetch failed:", error);
      return { ok: false, error: CMS_ARTICLES_API_ERROR_KEY };
    } finally {
      articlesFeedInFlight.delete(cacheKey);
    }
  })();

  articlesFeedInFlight.set(cacheKey, request);
  return request;
};

export const fetchArticleCategories =
  async (): Promise<FetchArticleCategoriesResult> => {
    const cacheKey = "articles-categories";

    const cached = getCached(articlesCategoriesCache, cacheKey);
    if (cached) return cached;

    const inFlight = articlesCategoriesInFlight.get(cacheKey);
    if (inFlight) return inFlight;

    const base = getCmsApiBaseUrlFromEnv();
    if (!base) return { ok: false, error: CMS_ARTICLES_API_ERROR_KEY };

    const request = (async (): Promise<FetchArticleCategoriesResult> => {
      try {
        const url = `${base}/groups/article-categories/content`;
        console.log("[cms:article-categories] request", { url });

        const response = await fetch(url);
        if (!response.ok) {
          console.warn("[cms:article-categories]", response.status, response.statusText);
          return { ok: false, error: CMS_ARTICLES_API_ERROR_KEY };
        }

        const payload = await response.json() as {
          meta?: { availableLinkValuesByField?: Record<string, string[]> };
        };
        const byField = payload.meta?.availableLinkValuesByField ?? {};
        const seen = new Set<string>();
        const categories: CmsArticleCategory[] = [];

        for (const values of Object.values(byField)) {
          for (const val of values) {
            const id = val.trim();
            if (!id || seen.has(id)) continue;
            seen.add(id);
            categories.push({ id, name: id });
          }
        }
        console.log("[cms:article-categories] mapped", categories.length);

        console.log("[cms:article-categories] mapped", categories.length);
        const result: FetchArticleCategoriesResult = { ok: true, data: categories };
        setCached(articlesCategoriesCache, cacheKey, result);
        return result;
      } catch (error) {
        console.warn("[cms:article-categories] fetch failed:", error);
        return { ok: false, error: CMS_ARTICLES_API_ERROR_KEY };
      } finally {
        articlesCategoriesInFlight.delete(cacheKey);
      }
    })();

    articlesCategoriesInFlight.set(cacheKey, request);
    return request;
  };

export const invalidateArticlesCmsCache = (): void => {
  articlesFeedCache.clear();
  articlesFeedInFlight.clear();
  articlesCategoriesCache.clear();
  articlesCategoriesInFlight.clear();
};
