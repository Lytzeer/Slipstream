/**
 * VIEW - Point d'entrée
 *
 * Redirige selon l'état d'authentification : (tabs) si connecté, onBoarding sinon.
 */

import { LoadingScreen } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { user, isLoading, isInitialized } = useAuth();

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onBoarding" />;
}
