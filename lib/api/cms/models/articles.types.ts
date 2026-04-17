export type CmsArticleEntry = {
  id: string;
  slug?: string;
  status?: string;
  data?: Record<string, unknown> | null;
};

export type CmsArticlesResponse = {
  data?: CmsArticleEntry[];
  meta?: {
    total?: number;
    page?: number;
    totalPages?: number;
  };
};
