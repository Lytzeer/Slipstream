/**
 * MODEL - Données utilisateur
 *
 * Couche données : helpers pour formater les infos utilisateur Supabase Auth.
 * Pas de logique métier, uniquement transformation de données.
 */

import type { User } from "@supabase/supabase-js";

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function getMetadata(user: User | null): Record<string, unknown> | null {
  if (!user) return null;
  return (
    user.user_metadata ??
    (user as User & { raw_user_meta_data?: Record<string, unknown> })
      .raw_user_meta_data ??
    null
  );
}

export const formatMemberSince = (dateString: string): string => {
  const date = new Date(dateString);
  const month = MONTHS_FR[date.getMonth()];
  const year = date.getFullYear();
  return `Membre depuis ${month} ${year}`;
};

export const getDisplayName = (user: User | null): string => {
  if (!user) return "Invité";
  const metadata = getMetadata(user);
  return (
    (metadata?.full_name as string) ??
    (metadata?.name as string) ??
    (metadata?.user_name as string) ??
    user.email?.split("@")[0] ??
    "Utilisateur"
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

export const toProfileUser = (user: User | null): ProfileUser | null => {
  if (!user) return null;
  return {
    id: user.id,
    displayName: getDisplayName(user),
    avatarUrl: getAvatarUrl(user),
    memberSince: user.created_at ? formatMemberSince(user.created_at) : null,
    email: user.email ?? null,
  };
};
