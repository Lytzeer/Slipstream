import Button from "@/components/ui/button";
import InputSection from "@/components/ui/input-section";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ArrowLeft, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

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
        />
        <InputSection
          inputTitle="Mot de passe"
          placeholder="Votre mot de passe"
          isPassword
          leftIcon={Lock}
        />
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          label="Se connecter"
          variant="primary"
          loading={isLoading}
          onPress={() => {
            setIsLoading(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // TODO: Faire l'appel pour la connexion et setIsLoading(false)
            router.push("/(tabs)");
          }}
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
  forgotPassword: {
    textAlign: "right",
    color: "#FF3B31",
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
