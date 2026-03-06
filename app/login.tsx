/**
 * VIEW - Écran connexion
 *
 * Délègue au authController (signInWithPassword, OAuth).
 */

import { AuthFormLayout, ScreenHeader } from "@/components/layout";
import { AuthLink, GoogleSignInButton } from "@/components/auth";
import { Button, DividerWithText, InputSection } from "@/components/ui";
import { authController } from "@/lib/controllers/auth.controller";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: signInError } = await authController.signInWithPassword(
      email.trim(),
      password
    );

    setIsLoading(false);

    if (signInError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(
        signInError.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect"
          : signInError.message
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(tabs)");
  };

  return (
    <AuthFormLayout>
      <ScreenHeader title="Connexion" backHref="/onBoarding" />
      <View style={styles.form}>
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
        <InputSection
          inputTitle="Mot de passe"
          placeholder="Votre mot de passe"
          isPassword
          leftIcon={Lock}
          value={password}
          onChangeText={setPassword}
          autoComplete="password"
          textContentType="password"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgotLink}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttons}>
        <DividerWithText />
        <GoogleSignInButton onError={(msg) => setError(msg ?? null)} />
        <Button
          label="Se connecter"
          variant="primary"
          loading={isLoading}
          onPress={handleLogin}
        />
        <AuthLink
          prefix="Pas encore de compte ? "
          linkText="Créer un compte"
          onPress={() => router.push("/create-account")}
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
  forgotLink: {
    textAlign: "right",
    color: "#FF3B31",
  },
  buttons: {
    width: "100%",
    marginTop: 60,
    gap: 32,
    justifyContent: "center",
  },
});
