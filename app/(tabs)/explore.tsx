import { useTheme } from "@/contexts/theme-context";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {t("explore.title")}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {t("explore.subtitle")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});
