import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from "react-native";

type Variant = "primary" | "secondary" | "outline" | "nobackground";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  loading?: boolean;
}

export default function Button({
  label,
  variant = "primary",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "nobackground" ? "#fff" : styles[`${variant}Label`].color}
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#FF383C",
  },
  secondary: {
    backgroundColor: "#1C1E1D",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
  },
  nobackground: {
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryLabel: {
    color: "#fff",
  },
  secondaryLabel: {
    color: "#fff",
  },
  outlineLabel: {
    color: "#fff",
  },
  nobackgroundLabel: {
    color: "#fff",
    opacity: 0.6,
  },
});
