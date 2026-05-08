/**
 * Hook d'authentification (alias vers useAuth).
 *
 * @deprecated Utiliser useAuth depuis @/contexts/auth-context
 * Conservé pour compatibilité ascendante.
 */

import { useAuth } from "@/contexts/auth-context";
import type { User } from "@supabase/supabase-js";

export type AuthUserState = {
  user: User | null;
  isLoading: boolean;
};

export const useAuthUser = (): AuthUserState => {
  const { user, isLoading } = useAuth();
  return { user, isLoading };
};
