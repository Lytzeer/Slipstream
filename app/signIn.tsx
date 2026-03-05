import Button from "@/components/ui/button";
import InputSection from "@/components/ui/input-section";
import { GoogleSignInButton } from "@/components/social-auth/google-sign-in-button";
import { supabase } from "@/lib/supabase";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ArrowLeft, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

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
        <Text style={styles.title}>Connexion</Text>
      </View>
      <View style={styles.formContainer}>
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
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.divider} />
        </View>
        <GoogleSignInButton onError={(msg) => setError(msg ?? null)} />
        <Button
          label="Se connecter"
          variant="primary"
          loading={isLoading}
          onPress={handleSignIn}
        />
        <View style={styles.signUpLinkContainer}>
          <Text style={styles.text}>Pas encore de compte ? </Text>
          <TouchableOpacity
            onPress={() => router.push("/signUp")}
            style={styles.signUpLinkRedirectionContainer}
          >
            <Text style={styles.signUpLink}>Créer un compte</Text>
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
  forgotPassword: {
    textAlign: "right",
    color: "#FF3B31",
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
