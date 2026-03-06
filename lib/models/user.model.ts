/**
 * MODEL - Données utilisateur
 *
 * Couche données : helpers pour formater les infos utilisateur Supabase Auth.
 * Pas de logique métier, uniquement transformation de données.
 */

import type { User } from "@supabase/supabase-js";
import type { TFunction } from "i18next";

const MONTH_KEYS = [
  "months.january", "months.february", "months.march", "months.april",
  "months.may", "months.june", "months.july", "months.august",
  "months.september", "months.october", "months.november", "months.december",
] as const;

function getMetadata(user: User | null): Record<string, unknown> | null {
  if (!user) return null;
  return (
    user.user_metadata ??
    (user as User & { raw_user_meta_data?: Record<string, unknown> })
      .raw_user_meta_data ??
    null
  );
}

export const formatMemberSince = (
  dateString: string,
  t: TFunction
): string => {
  const date = new Date(dateString);
  const month = t(MONTH_KEYS[date.getMonth()]);
  const year = date.getFullYear();
  return t("profile.memberSince", { month, year });
};

export const getDisplayName = (
  user: User | null,
  t?: TFunction
): string => {
  if (!user) return t ? t("common.guest") : "Invité";
  const metadata = getMetadata(user);
  return (
    (metadata?.full_name as string) ??
    (metadata?.name as string) ??
    (metadata?.user_name as string) ??
    user.email?.split("@")[0] ??
    (t ? t("common.user") : "Utilisateur")
  );
};

export const getAvatarUrl = (user: User | null): string | null => {
  const metadata = getMetadata(user);
  if (!metadata) return null;
  return (metadata.avatar_url as string) ?? (metadata.picture as string) ?? null;
};

export type ProfileUser = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  memberSince: string | null;
  email: string | null;
};

export const toProfileUser = (
  user: User | null,
  t?: TFunction
): ProfileUser | null => {
  if (!user) return null;
  return {
    id: user.id,
    displayName: getDisplayName(user, t),
    avatarUrl: getAvatarUrl(user),
    memberSince:
      user.created_at && t
        ? formatMemberSince(user.created_at, t)
        : null,
    email: user.email ?? null,
  };
};
