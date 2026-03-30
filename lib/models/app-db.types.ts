/**
 * Types alignés sur le schéma PostgreSQL `app` (Supabase).
 * @see supabase/migrations/20260115120000_app_schema.sql
 */

export type AppUserPreferences = {
  user_id: string;
  theme: "light" | "dark";
  locale: string;
  notifications_enabled: boolean;
  updated_at: string;
};

export type AppUserFollowedChampionship = {
  user_id: string;
  championship_id: string;
  created_at: string;
};

export type AppSavedArticle = {
  id: string;
  user_id: string;
  article_id: string;
  title: string | null;
  championship_id: string | null;
  saved_at: string;
};
