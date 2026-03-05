import Button from "@/components/ui/button";
import InputSection from "@/components/ui/input-section";
import { GoogleSignInButton } from "@/components/social-auth/google-sign-in-button";
import { supabase } from "@/lib/supabase";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ArrowLeft, Lock, Mail, UserRound } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email.trim() || !password || !fullName.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });

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
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.navigate("/onBoarding");
          }}
        >
          <ArrowLeft size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Inscription</Text>
      </View>
      <View style={styles.formContainer}>
        <InputSection
          inputTitle="Nom complet"
          placeholder="Votre nom complet"
          leftIcon={UserRound}
          value={fullName}
          onChangeText={setFullName}
          autoComplete="name"
          textContentType="name"
        />
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
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <InputSection
          inputTitle="Confirmer le mot de passe"
          placeholder="Confirmez votre mot de passe"
          isPassword
          leftIcon={Lock}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoComplete="new-password"
          textContentType="newPassword"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.divider} />
        </View>
        <GoogleSignInButton onError={(msg) => setError(msg ?? null)} />
        <Button
          label="S'inscrire"
          variant="primary"
          loading={isLoading}
          onPress={handleSignUp}
        />
        <View style={styles.signUpLinkContainer}>
          <Text style={styles.text}>Pas encore de compte ? </Text>
          <TouchableOpacity
            onPress={() => router.push("/signIn")}
            style={styles.signUpLinkRedirectionContainer}
          >
            <Text style={styles.signUpLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
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
  formContainer: {
    width: "100%",
    gap: 20,
    marginTop: 60,
  },
  inputContainer: {
    width: "100%",
  },
  errorText: {
    color: "#FF3B31",
    fontSize: 14,
    marginTop: -8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    fontSize: 14,
    color: "#666",
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 60,
    gap: 32,
    justifyContent: "center",
    textAlign: "center",
  },
  signUpLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpLinkRedirectionContainer: {
    marginLeft: 4,
  },
  signUpLink: {
    fontSize: 16,
    color: "#FF3B31",
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
});
