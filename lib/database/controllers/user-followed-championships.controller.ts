import { supabaseApi } from "@/lib/api";

export const fetchUserFollowedChampionshipIds = async (
  userId: string
): Promise<Set<string>> => {
  const ids = await supabaseApi.userFollowedChampionships.fetchIdsByUserId(userId);
  return new Set(ids);
};

export const replaceUserFollowedChampionshipIds = async (
  userId: string,
  championshipIds: string[]
): Promise<void> => {
  await supabaseApi.userFollowedChampionships.replaceByUserId(userId, championshipIds);
};
