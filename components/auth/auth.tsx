"use client";

import { colors } from "@/constants/theme";
import { useNotifications } from "@/contexts/notifications-context";
import {
  authController,
  extractTokensFromUrl,
  getRedirectUrl,
} from "@/lib/controllers/auth.controller";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

// AuthLink
export const AuthLink = ({
  prefix,
  linkText,
  onPress,
}: {
  prefix: string;
  linkText: string;
  onPress: () => void;
}) => (
  <View style={authStyles.linkContainer}>
    <Text style={authStyles.linkPrefix}>{prefix}</Text>
    <TouchableOpacity onPress={onPress} style={authStyles.linkWrapper}>
      <Text style={authStyles.link}>{linkText}</Text>
    </TouchableOpacity>
  </View>
);

// GoogleSignInButton
export const GoogleSignInButton = (props: { onError?: (message?: string) => void }) => {
  const { t } = useTranslation();
  const { requestPermissionAfterLogin } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => void WebBrowser.coolDownAsync();
  }, []);

  const handlePress = async () => {
    setIsLoading(true);
    props.onError?.(undefined);
    try {
      const redirectUrl = getRedirectUrl();
      const { data, error } = await authController.signInWithOAuth("google", redirectUrl);
      if (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        props.onError?.(error.message);
        return;
      }
      const googleOAuthUrl = data.url;
      if (!googleOAuthUrl) {
        props.onError?.(t("auth.googleError"));
        return;
      }
      const result = await WebBrowser.openAuthSessionAsync(
        googleOAuthUrl,
        redirectUrl,
        { showInRecents: true }
      );
      if (result?.type === "success") {
        const { access_token, refresh_token } = extractTokensFromUrl(result.url);
        if (access_token && refresh_token) {
          const { error: sessionError } = await authController.setSession(
            access_token,
            refresh_token
          );
          if (sessionError) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            props.onError?.(sessionError.message);
            return;
          }
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace("/(tabs)");
          requestPermissionAfterLogin();
        } else {
          props.onError?.(t("auth.googleCancelled"));
        }
      }
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      props.onError?.(err instanceof Error ? err.message : t("auth.googleError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[authStyles.googleBtn, isLoading && authStyles.googleBtnDisabled]}
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <>
          <View style={authStyles.googleIcon}>
            <Text style={authStyles.googleG}>G</Text>
          </View>
          <Text style={authStyles.googleLabel}>{t("auth.continueWithGoogle")}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const authStyles = StyleSheet.create({
  linkContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  linkPrefix: { fontSize: 16, color: colors.black, textAlign: "center" },
  linkWrapper: { marginLeft: 4 },
  link: { fontSize: 16, color: colors.primary, fontWeight: "bold" },
  googleBtn: {
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
  googleBtnDisabled: { opacity: 0.7 },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: { fontSize: 18, fontWeight: "bold", color: "#4285F4" },
  googleLabel: { fontSize: 16, fontWeight: "600", color: "#000" },
});
