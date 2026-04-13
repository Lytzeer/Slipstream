import {
  buildCmsGroupContentUrl,
  fetchCmsChampionshipGroupContent,
  getCmsApiBaseUrlFromEnv,
  parseCmsChampionshipGroupJson,
} from "@/lib/api/cms/groups-content.api";
import type { CmsGroupChampionshipResponse } from "@/lib/api/cms/models/championship.types";
import type { ChampionshipRaw } from "@/types";

/** Conservé pour compatibilité legacy ; le flux principal est 100% CMS dynamique. */
export const CHAMPIONSHIPS_CATALOG_FALLBACK: ChampionshipRaw[] = [];

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
    displayLabel: raw.trim() || toDisplayLabel(v),
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
    const base = getCmsApiBaseUrlFromEnv();
    if (!base) return { ok: false, error: CMS_CHAMPIONSHIPS_API_ERROR_KEY };

    try {
      const res = await fetchCmsChampionshipGroupContent(base);
      if (!res.ok) {
        console.warn("[cms] championship group:", res.status, res.statusText);
        return { ok: false, error: CMS_CHAMPIONSHIPS_API_ERROR_KEY };
      }
      const json = await parseCmsChampionshipGroupJson(res);
      const data = mapGroupChampionshipResponseToCatalog(json);
      return { ok: true, data };
    } catch (e) {
      console.warn("[cms] championship group fetch failed:", e);
      return { ok: false, error: CMS_CHAMPIONSHIPS_API_ERROR_KEY };
    }
  };
