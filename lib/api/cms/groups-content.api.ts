import type { CmsGroupChampionshipResponse } from "@/lib/api/cms/models/championship.types";

export const normalizeCmsApiBaseUrl = (baseUrl: string): string => {
  const cleaned = baseUrl.replace(/\/$/, "");
  return cleaned.endsWith("/api/cms") ? cleaned : `${cleaned}/api/cms`;
};

export const getCmsApiBaseUrlFromEnv = (): string | null => {
  const raw = process.env.EXPO_PUBLIC_CMS_BASE_URL?.trim();
  if (!raw) return null;
  return normalizeCmsApiBaseUrl(raw);
};

export const buildCmsGroupContentUrl = (
  baseUrl: string,
  groupSlug: string,
  options: {
    pairs?: { field: string; value: string }[];
    status?: string;
    limit?: number;
    page?: number;
    orderBy?: string;
    order?: "asc" | "desc";
  } = {},
): string => {
  const base = normalizeCmsApiBaseUrl(baseUrl);
  const params = new URLSearchParams();
  params.set("status", options.status ?? "published");
  for (const p of options.pairs ?? []) {
    params.append("linkField", p.field);
    params.append("linkValue", p.value);
  }
  if (options.limit != null) params.set("limit", String(options.limit));
  if (options.page != null) params.set("page", String(options.page));
  if (options.orderBy) params.set("orderBy", options.orderBy);
  if (options.order) params.set("order", options.order);
  return `${base}/groups/${groupSlug}/content?${params.toString()}`;
};

/**
 * Fetch the championship group content from the CMS API.
 * @param baseUrl - The base URL of the CMS API.
 * @returns The response from the CMS API.
 */

export const fetchCmsChampionshipGroupContent = async (baseUrl: string) => {
  const url = buildCmsGroupContentUrl(baseUrl, "championship", {
    status: "published",
  });
  return fetch(url);
};

export const parseCmsChampionshipGroupJson = async (
  response: Response,
): Promise<CmsGroupChampionshipResponse> => {
  return (await response.json()) as CmsGroupChampionshipResponse;
};
