import { useThemeColor } from "@/hooks/use-theme-color";
import {
  StyleSheet,
  Text,
  View,
  type TextProps,
  type ViewProps,
} from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return (
    <Text
      style={[
        { color },
        type === "default" ? themedStyles.textDefault : undefined,
        type === "title" ? themedStyles.textTitle : undefined,
        type === "defaultSemiBold" ? themedStyles.textSemiBold : undefined,
        type === "subtitle" ? themedStyles.textSubtitle : undefined,
        type === "link" ? themedStyles.textLink : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

const themedStyles = StyleSheet.create({
  textDefault: { fontSize: 16, lineHeight: 24 },
  textSemiBold: { fontSize: 16, lineHeight: 24, fontWeight: "600" },
  textTitle: { fontSize: 32, fontWeight: "bold", lineHeight: 32 },
  textSubtitle: { fontSize: 20, fontWeight: "bold" },
  textLink: { lineHeight: 30, fontSize: 16, color: "#0a7ea4" },
});
