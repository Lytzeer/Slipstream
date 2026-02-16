import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ArrowLeft, Lock, Mail } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignIn() {
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
        <Text style={styles.title}>Connexion</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text>Adresse email</Text>
          <Input leftIcon={Mail} placeholder="your.mail@exemple.com" />
        </View>
        <View style={styles.inputContainer}>
          <Text>Mot de passe</Text>
          <Input leftIcon={Lock} isPassword placeholder="Votre mot de passe" />
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          label="Se connecter"
          variant="primary"
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push("/(tabs)");
          }}
        />
        <View style={styles.signUpLinkContainer}>
          <Text style={styles.text}>Pas encore de compte ? </Text>
          <TouchableOpacity
            onPress={() => {}}
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
