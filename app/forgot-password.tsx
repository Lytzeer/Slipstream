/**
 * VIEW - Mot de passe oublié
 *
 * Délègue au authController (resetPasswordForEmail).
 */

import { AuthFormLayout, ScreenHeader } from "@/components/layout";
import { Button, InputSection } from "@/components/ui";
import { authController, getAuthCallbackUrl } from "@/lib/controllers/auth.controller";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError(t("auth.enterEmailError"));
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const { error: resetError } = await authController.resetPasswordForEmail(
      email.trim(),
      getAuthCallbackUrl()
    );

    setIsLoading(false);

    if (resetError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(resetError.message);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthFormLayout>
        <ScreenHeader title={t("auth.emailSent")} />
        <View style={styles.form}>
          <Text style={styles.successText}>
            {t("auth.resetInstructions")}{" "}
            <Text style={styles.emailHighlight}>{email}</Text>.{" "}
            {t("auth.resetInstructionsEnd")}
          </Text>
          <Button
            label={t("auth.backToLogin")}
            variant="primary"
            onPress={() => router.replace("/login")}
          />
        </View>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout>
      <ScreenHeader title={t("auth.forgotPasswordTitle")} />
      <View style={styles.form}>
        <Text style={styles.subtitle}>{t("auth.enterEmail")}</Text>
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
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={styles.buttons}>
        <Button
          label={t("auth.sendLink")}
          variant="primary"
          loading={isLoading}
          onPress={handleResetPassword}
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
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  successText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
  },
  emailHighlight: {
    fontWeight: "600",
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
  },
});
