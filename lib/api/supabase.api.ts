import { authDatabase } from "@/lib/database/auth/auth.database";
import { userFollowedChampionshipsDatabase } from "@/lib/database/championships/user-followed-championships.database";
import { userPreferencesDatabase } from "@/lib/database/preferences/user-preferences.database";

export const supabaseApi = {
  auth: authDatabase,
  userPreferences: userPreferencesDatabase,
  userFollowedChampionships: userFollowedChampionshipsDatabase,
};
