"use client";

/**
 * CONTROLLER (React) - Contexte d'authentification
 *
 * Bridge entre authController (logique) et les vues.
 * Gère l'état React (user, loading) et s'abonne aux changements de session.
 */

import { authController } from "@/lib/controllers/auth.controller";
import type { User } from "@supabase/supabase-js";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshSession = useCallback(async () => {
    const {
      data: { session },
    } = await authController.getSession();
    setUser(session?.user ?? null);
    setIsLoading(false);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    refreshSession();

    const unsubscribe = authController.onAuthStateChange((session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      setIsInitialized(true);
    });

    return unsubscribe;
  }, [refreshSession]);

  const value: AuthContextValue = {
    user,
    isLoading,
    isInitialized,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
