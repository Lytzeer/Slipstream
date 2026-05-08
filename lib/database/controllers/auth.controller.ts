/**
 * Auth controller (database layer)
 *
 * Expose un point d'entrée unique pour la session et l'auth Supabase
 * afin d'éviter tout accès direct côté UI.
 */

import { authDatabase } from "@/lib/database/auth/auth.database";
import type { Session } from "@supabase/supabase-js";
import { Platform } from "react-native";

export const getRedirectUrl = (): string =>
  Platform.OS === "web" && typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "slipstream://google-auth";

export const getAuthCallbackUrl = (): string =>
  Platform.OS === "web" && typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "slipstream://auth/callback";

export const extractTokensFromUrl = (url: string) => {
  try {
    const hashIndex = url.indexOf("#");
    if (hashIndex === -1) return {};
    const params = new URLSearchParams(url.substring(hashIndex + 1));
    return {
      access_token: params.get("access_token"),
      refresh_token: params.get("refresh_token"),
    };
  } catch {
    return {};
  }
};

export const authController = {
  getSession: () => authDatabase.getSession(),
  setSession: (accessToken: string, refreshToken: string) =>
    authDatabase.setSession(accessToken, refreshToken),
  exchangeCodeForSession: (code: string) => authDatabase.exchangeCodeForSession(code),
  signOut: () => authDatabase.signOut(),
  signInWithPassword: (email: string, password: string) =>
    authDatabase.signInWithPassword(email, password),
  signUp: (email: string, password: string, metadata?: { full_name?: string }) =>
    authDatabase.signUp(email, password, metadata),
  resetPasswordForEmail: (email: string, redirectTo: string) =>
    authDatabase.resetPasswordForEmail(email, redirectTo),
  signInWithOAuth: (provider: "google", redirectTo: string) =>
    authDatabase.signInWithOAuth(provider, {
      redirectTo,
      ...(Platform.OS === "web" ? {} : { skipBrowserRedirect: true }),
    }),
  onAuthStateChange: (callback: (session: Session | null) => void) =>
    authDatabase.onAuthStateChange(callback),
};
