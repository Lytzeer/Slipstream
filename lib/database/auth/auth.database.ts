import { supabase } from "@/lib/database/client/supabase.client";
import type { Session } from "@supabase/supabase-js";

export const authDatabase = {
  getSession: () => supabase.auth.getSession(),
  setSession: (accessToken: string, refreshToken: string) =>
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }),
  exchangeCodeForSession: (code: string) => supabase.auth.exchangeCodeForSession(code),
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
  signInWithOAuth: (
    provider: "google",
    options: { redirectTo: string; skipBrowserRedirect?: boolean }
  ) =>
    supabase.auth.signInWithOAuth({
      provider,
      options,
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
