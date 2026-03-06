/**
 * VIEW - Écran inscription
 *
 * Délègue au authController (signUp, OAuth).
 */

import { AuthFormLayout, ScreenHeader } from "@/components/layout";
import { AuthLink, GoogleSignInButton } from "@/components/auth";
import { Button, DividerWithText, InputSection } from "@/components/ui";
import { authController } from "@/lib/controllers/auth.controller";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Lock, Mail, UserRound } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function CreateAccount() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    if (!email.trim() || !password || !fullName.trim()) {
      setError(t("auth.fillAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.passwordsNotMatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.passwordMinLength"));
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: signUpError } = await authController.signUp(
      email.trim(),
      password,
      { full_name: fullName.trim() }
    );

    setIsLoading(false);

    if (signUpError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(signUpError.message);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(tabs)");
  };

  return (
    <AuthFormLayout>
      <ScreenHeader title={t("auth.signUp")} backHref="/onBoarding" />
      <View style={styles.form}>
        <InputSection
          inputTitle={t("auth.fullName")}
          placeholder={t("auth.fullNamePlaceholder")}
          leftIcon={UserRound}
          value={fullName}
          onChangeText={setFullName}
          autoComplete="name"
          textContentType="name"
        />
        <InputSection
          inputTitle={t("auth.email")}
          placeholder={t("auth.emailPlaceholder")}
          leftIcon={Mail}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <InputSection
          inputTitle={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          isPassword
          leftIcon={Lock}
          value={password}
          onChangeText={setPassword}
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <InputSection
          inputTitle={t("auth.confirmPassword")}
          placeholder={t("auth.confirmPasswordPlaceholder")}
          isPassword
          leftIcon={Lock}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoComplete="new-password"
          textContentType="newPassword"
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={styles.buttons}>
        <DividerWithText text={t("common.or")} />
        <GoogleSignInButton onError={(msg) => setError(msg ?? null)} />
        <Button
          label={t("auth.signUpButton")}
          variant="primary"
          loading={isLoading}
          onPress={handleCreateAccount}
        />
        <AuthLink
          prefix={t("auth.hasAccount")}
          linkText={t("auth.signInLink")}
          onPress={() => router.push("/login")}
        />
      </View>
    </AuthFormLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    gap: 20,
    marginTop: 60,
  },
  error: {
    color: "#FF3B31",
    fontSize: 14,
    marginTop: -8,
  },
  buttons: {
    width: "100%",
    marginTop: 60,
    gap: 32,
    justifyContent: "center",
  },
});
