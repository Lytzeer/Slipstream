/**
 * VIEW - Callback OAuth
 *
 * Reçoit la redirection après authentification, délègue au controller.
 */

import {
  authController,
  extractTokensFromUrl,
} from "@/lib/controllers/auth.controller";
import { requestNotificationPermission } from "@/lib/notifications";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const handled = useRef(false);

  useEffect(() => {
    const handleCallback = async (url: string | null) => {
      if (handled.current || !url) {
        if (!url) setStatus("error");
        return;
      }

      const { access_token, refresh_token } = extractTokensFromUrl(url);
      if (!access_token || !refresh_token) {
        setStatus("error");
        return;
      }

      handled.current = true;

      const { error } = await authController.setSession(
        access_token,
        refresh_token
      );

      if (error) {
        setStatus("error");
        return;
      }

      setStatus("success");
      router.replace("/(tabs)");
      setTimeout(() => {
        requestNotificationPermission();
      }, 3000);
    };

    let subscription: { remove: () => void } | null = null;
    let timer: ReturnType<typeof setTimeout>;

    const run = async () => {
      if (
        Platform.OS === "web" &&
        typeof window !== "undefined" &&
        window.location?.href &&
        (window.location.href.includes("#access_token=") ||
          window.location.href.includes("#refresh_token="))
      ) {
        await handleCallback(window.location.href);
        return;
      }

      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await handleCallback(initialUrl);
        return;
      }

      subscription = Linking.addEventListener("url", ({ url }) => {
        handleCallback(url);
      });

      timer = setTimeout(() => {
        if (!handled.current) setStatus("error");
      }, 5000);
    };

    run();

    return () => {
      subscription?.remove();
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <View style={styles.container}>
      {status === "loading" && (
        <>
          <ActivityIndicator size="large" color="#FF383C" />
          <Text style={styles.text}>Connexion en cours...</Text>
        </>
      )}
      {status === "error" && (
        <>
          <Text style={styles.errorText}>Erreur lors de la connexion</Text>
          <Text style={styles.link} onPress={() => router.replace("/login")}>
            Retour à la connexion
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 20,
  },
  text: { fontSize: 16, color: "#666" },
  errorText: { fontSize: 16, color: "#FF3B31", textAlign: "center" },
  link: { fontSize: 16, color: "#FF383C", fontWeight: "600" },
});
