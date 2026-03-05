"use client";

import { supabase } from "@/lib/supabase";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URL = "slipstream://google-auth";

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

type Props = {
  onError?: (message?: string) => void;
};

export const GoogleSignInButton = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const handlePress = async () => {
    setIsLoading(true);
    props.onError?.(undefined);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: REDIRECT_URL,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        props.onError?.(error.message);
        return;
      }

      const googleOAuthUrl = data.url;
      if (!googleOAuthUrl) {
        props.onError?.("Erreur lors de la connexion Google");
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        googleOAuthUrl,
        REDIRECT_URL,
        { showInRecents: true }
      );

      if (result?.type === "success") {
        const params = extractParamsFromUrl(result.url);
        if (params.access_token && params.refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (sessionError) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            props.onError?.(sessionError.message);
            return;
          }
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace("/(tabs)");
        } else {
          props.onError?.("Connexion Google annulée");
        }
      }
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      props.onError?.(
        err instanceof Error ? err.message : "Erreur lors de la connexion"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>G</Text>
          </View>
          <Text style={styles.label}>Continuer avec Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4285F4",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
