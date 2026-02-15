import { Redirect, Slot, useSegments } from "expo-router";
import React from "react";

export default function Index() {
  const isOnboarding = true;

  if (isOnboarding) {
    return <Redirect href="/onBoarding" />;
  }
}

export function RootLayout() {
  const isLoggedIn = false; // Remplace par ta logique réelle

  // Si pas connecté et pas déjà sur la page de connexion, on redirige
  const segments = useSegments();
  if (!isLoggedIn && segments[0] !== "onBoarding") {
    return <Redirect href="/onBoarding" />;
  }

  return <Slot />;
}
