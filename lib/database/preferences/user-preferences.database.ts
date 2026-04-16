import type { ColorScheme } from "@/constants/theme";
import { supabase } from "@/lib/database/client/supabase.client";
import type { AppUserPreferences } from "@/lib/database/types/app-db.types";

export const userPreferencesDatabase = {
  fetchByUserId: async (userId: string): Promise<AppUserPreferences | null> => {
    const { data, error } = await supabase
      .schema("app")
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return null;
    return data as AppUserPreferences | null;
  },
  upsert: async (prefs: {
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
    return !error;
  },
};
