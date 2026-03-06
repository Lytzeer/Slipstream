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
import { StyleSheet, Text, View } from "react-native";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError("Veuillez entrer votre adresse email");
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
        <ScreenHeader title="Email envoyé" />
        <View style={styles.form}>
          <Text style={styles.successText}>
            Un lien de réinitialisation a été envoyé à{" "}
            <Text style={styles.emailHighlight}>{email}</Text>. Vérifiez votre
            boîte de réception et suivez les instructions pour définir un nouveau
            mot de passe.
          </Text>
          <Button
            label="Retour à la connexion"
            variant="primary"
            onPress={() => router.replace("/login")}
          />
        </View>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout>
      <ScreenHeader title="Mot de passe oublié" />
      <View style={styles.form}>
        <Text style={styles.subtitle}>
          Entrez votre adresse email et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </Text>
        <InputSection
          inputTitle="Adresse email"
          placeholder="your.mail@exemple.com"
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
          label="Envoyer le lien"
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
