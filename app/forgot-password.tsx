import Button from "@/components/ui/button";
import InputSection from "@/components/ui/input-section";
import { supabase } from "@/lib/supabase";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ArrowLeft, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const REDIRECT_URL = "slipstream://auth/callback";

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

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: REDIRECT_URL }
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
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.back();
            }}
          >
            <ArrowLeft size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Email envoyé</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.successText}>
            Un lien de réinitialisation a été envoyé à{" "}
            <Text style={styles.emailHighlight}>{email}</Text>. Vérifiez votre
            boîte de réception et suivez les instructions pour définir un nouveau
            mot de passe.
          </Text>
          <Button
            label="Retour à la connexion"
            variant="primary"
            onPress={() => router.replace("/signIn")}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.back();
          }}
        >
          <ArrowLeft size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Mot de passe oublié</Text>
      </View>
      <View style={styles.formContainer}>
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
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          label="Envoyer le lien"
          variant="primary"
          loading={isLoading}
          onPress={handleResetPassword}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    gap: 20,
    marginTop: 60,
  },
  successText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
  },
  emailHighlight: {
    fontWeight: "600",
  },
  errorText: {
    color: "#FF3B31",
    fontSize: 14,
    marginTop: -8,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 60,
    gap: 32,
  },
});
