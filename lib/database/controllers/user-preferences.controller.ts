import { supabaseApi } from "@/lib/api";
import { isValidLocale } from "@/constants/locales";
import type { Locale } from "@/constants/locales";
import type { ColorScheme } from "@/constants/theme";

export type UserPreferenceRow = {
  user_id: string;
  theme: ColorScheme;
  locale: Locale;
  notifications_enabled: boolean;
};

export const fetchUserPreferences = async (
  userId: string
): Promise<UserPreferenceRow | null> => {
  const row = await supabaseApi.userPreferences.fetchByUserId(userId);
  if (!row) return null;
  return {
    user_id: row.user_id,
    theme: row.theme,
    locale: isValidLocale(row.locale) ? row.locale : "fr",
    notifications_enabled: row.notifications_enabled,
  };
};

export const upsertUserPreferences = async (prefs: UserPreferenceRow): Promise<void> => {
  await supabaseApi.userPreferences.upsert({
    user_id: prefs.user_id,
    theme: prefs.theme,
    locale: prefs.locale,
    notifications_enabled: prefs.notifications_enabled,
  });
};
