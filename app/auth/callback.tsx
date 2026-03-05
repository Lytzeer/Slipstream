import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function extractParamsFromUrl(url: string) {
  try {
    const hashIndex = url.indexOf("#");
    if (hashIndex === -1) return {};
    const hash = url.substring(hashIndex + 1);
    const params = new URLSearchParams(hash);
    return {
      access_token: params.get("access_token"),
      refresh_token: params.get("refresh_token"),
    };
  } catch {
    return {};
  }
}

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const handleCallback = async (url: string | null) => {
      if (!url) {
        setStatus("error");
        return;
      }

      const { access_token, refresh_token } = extractParamsFromUrl(url);
      if (!access_token || !refresh_token) {
        setStatus("error");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        setStatus("error");
        return;
      }

      setStatus("success");
      router.replace("/(tabs)");
    };

    const getUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleCallback(initialUrl);
        return;
      }
      setStatus("error");
    };

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleCallback(url);
    });

    getUrl();
    return () => subscription.remove();
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
          <Text
            style={styles.link}
            onPress={() => router.replace("/signIn")}
          >
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
  text: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B31",
    textAlign: "center",
  },
  link: {
    fontSize: 16,
    color: "#FF383C",
    fontWeight: "600",
  },
});
