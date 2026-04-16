/**
 * Réponses API CMS — groupe Championship (agrégation + filtres de liaison).
 * @see GET /api/cms/groups/championship/content
 */

export type CmsCollectionMeta = {
  id: string;
  slug: string;
  name: string;
};

export type CmsCalendarEntry = {
  id: string;
  data: {
    championship?: string;
    title?: string;
    [key: string]: unknown;
  } | null;
  status?: string;
  slug?: string | null;
};

export type CmsGroupChampionshipBlock = {
  collection: CmsCollectionMeta;
  data: CmsCalendarEntry[];
  meta?: {
    total?: number;
    page?: number;
    totalPages?: number;
    exposedFields?: string[];
    linkField?: string;
    linkFields?: string[];
    linkValues?: string[];
  };
};

/** Métadonnées racine du groupe (filtres dynamiques + valeurs disponibles par champ) */
export type CmsGroupChampionshipMeta = {
  group?: { id: string; slug: string; name: string };
  collectionsCount?: number;
  totalItems?: number;
  linkField?: string;
  linkValue?: string;
  linkFields?: string[];
  linkValues?: string[];
  availableLinkFields?: string[];
  /** ex. { "championship": ["elms", "wec"], "season": ["2025", "2026"] } */
  availableLinkValuesByField?: Record<string, string[]>;
};

export type CmsGroupChampionshipResponse = {
  data: CmsGroupChampionshipBlock[];
  meta?: CmsGroupChampionshipMeta;
};
