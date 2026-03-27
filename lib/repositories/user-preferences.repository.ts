/**
 * Repository — préférences utilisateur (schéma app.user_preferences, Supabase).
 */

import type { ColorScheme } from "@/constants/theme";
import type { AppUserPreferences } from "@/lib/models/app-db.types";
import { supabase } from "@/lib/supabase";

export const fetchUserPreferences = async (
  userId: string
): Promise<AppUserPreferences | null> => {
  const { data, error } = await supabase
    .schema("app")
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[user_preferences] fetch:", error.message);
    return null;
  }
  return data as AppUserPreferences | null;
};

export const upsertUserPreferences = async (prefs: {
  user_id: string;
  theme: ColorScheme;
  locale: string;
  notifications_enabled: boolean;
}): Promise<boolean> => {
  const { error } = await supabase.schema("app").from("user_preferences").upsert(
    {
      user_id: prefs.user_id,
      theme: prefs.theme,
      locale: prefs.locale,
      notifications_enabled: prefs.notifications_enabled,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.warn("[user_preferences] upsert:", error.message);
    return false;
  }
  return true;
};
