/**
 * CONTROLLER - Authentification
 *
 * Logique métier : session, OAuth, déconnexion, signIn, signUp, resetPassword.
 * Utilise le model Supabase, expose des méthodes pour les vues.
 */

import { supabase } from "@/lib/models/supabase.model";
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
  getSession: () => supabase.auth.getSession(),

  setSession: (accessToken: string, refreshToken: string) =>
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }),

  signOut: () => supabase.auth.signOut(),

  signInWithPassword: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signUp: (email: string, password: string, metadata?: { full_name?: string }) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    }),

  resetPasswordForEmail: (email: string, redirectTo: string) =>
    supabase.auth.resetPasswordForEmail(email, { redirectTo }),

  signInWithOAuth: (provider: "google", redirectTo: string) =>
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo, skipBrowserRedirect: true },
    }),

  onAuthStateChange: (callback: (session: Session | null) => void) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      callback(session);
    });
    return () => subscription.unsubscribe();
  },
};
