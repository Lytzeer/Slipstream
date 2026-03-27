import { Button } from "@/components/ui";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function OnBoarding() {
  const { t } = useTranslation();
  return (
    <ImageBackground
      source={require("@/assets/images/onBoarding/background.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.contentSection}>
        <Text style={styles.title}>{t("common.appName")}</Text>
        <Text style={styles.subtitle}>{t("onboarding.subtitle")}</Text>
        <View style={styles.buttonsContainer}>
          <Button
            label={t("auth.createAccount")}
            variant="primary"
            onPress={() => router.push("/create-account")}
          />
          <Button
            label={t("auth.signIn")}
            variant="secondary"
            onPress={() => router.push("/login")}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contentSection: {
    width: "100%",
    gap: 6,
    marginBottom: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
  },
  buttonsContainer: {
    marginTop: 16,
    gap: 6,
  },
});
