import { supabase } from "@/lib/database/client/supabase.client";

export const userFollowedChampionshipsDatabase = {
  fetchIdsByUserId: async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .schema("app")
      .from("user_followed_championships")
      .select("championship_id")
      .eq("user_id", userId);
    if (error) return [];
    return (data ?? []).map((row) => String(row.championship_id));
  },
  replaceByUserId: async (userId: string, championshipIds: string[]): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .schema("app")
      .from("user_followed_championships")
      .delete()
      .eq("user_id", userId);
    if (deleteError) return false;

    if (championshipIds.length === 0) return true;

    const payload = championshipIds.map((championshipId) => ({
      user_id: userId,
      championship_id: championshipId,
    }));
    const { error: insertError } = await supabase
      .schema("app")
      .from("user_followed_championships")
      .insert(payload);
    return !insertError;
  },
};
