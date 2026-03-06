import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type PressableProps,
  type TextInputProps,
  View,
} from "react-native";

// Button
type Variant = "primary" | "secondary" | "outline" | "nobackground";

type ButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
};

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
        formStyles.base,
        formStyles[variant],
        pressed && formStyles.pressed,
        (disabled || loading) && formStyles.disabled,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "nobackground"
              ? "#fff"
              : formStyles[`${variant}Label`].color
          }
        />
      ) : (
        <Text style={[formStyles.label, formStyles[`${variant}Label`]]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// Input
type InputProps = TextInputProps & {
  leftIcon?: LucideIcon;
  isPassword?: boolean;
};

export function Input({
  leftIcon: LeftIcon,
  isPassword,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={formStyles.inputWrapper}>
      {LeftIcon && (
        <View style={formStyles.leftIcon}>
          <LeftIcon size={20} color="#9CA3AF" />
        </View>
      )}
      <TextInput
        style={[
          formStyles.input,
          LeftIcon ? formStyles.withLeftIcon : undefined,
          isPassword ? formStyles.withRightIcon : undefined,
          focused ? formStyles.inputFocused : undefined,
          style,
        ]}
        secureTextEntry={isPassword && !visible}
        placeholderTextColor="#9CA3AF"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {isPassword && (
        <Pressable
          style={formStyles.rightIcon}
          onPress={() => setVisible((v) => !v)}
        >
          {visible ? (
            <EyeOff size={20} color="#9CA3AF" />
          ) : (
            <Eye size={20} color="#9CA3AF" />
          )}
        </Pressable>
      )}
    </View>
  );
}

// InputSection
type InputSectionProps = TextInputProps & {
  inputTitle: string;
  placeholder: string;
  isPassword?: boolean;
  leftIcon?: LucideIcon;
};

export function InputSection({
  inputTitle,
  placeholder,
  isPassword,
  leftIcon,
  ...inputProps
}: InputSectionProps) {
  return (
    <View style={formStyles.sectionContainer}>
      <Text style={formStyles.sectionTitle}>{inputTitle}</Text>
      <Input
        placeholder={placeholder}
        isPassword={isPassword}
        leftIcon={leftIcon}
        {...inputProps}
      />
    </View>
  );
}

const formStyles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: "#FF383C" },
  secondary: { backgroundColor: "#1C1E1D" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
  },
  nobackground: { backgroundColor: "transparent" },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.4 },
  label: { fontSize: 16, fontWeight: "600" },
  primaryLabel: { color: "#fff" },
  secondaryLabel: { color: "#fff" },
  outlineLabel: { color: "#fff" },
  nobackgroundLabel: { color: "#fff", opacity: 0.6 },
  inputWrapper: { position: "relative", justifyContent: "center" },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
  },
  inputFocused: { borderColor: "#FF3B31", borderWidth: 1 },
  withLeftIcon: { paddingLeft: 48 },
  withRightIcon: { paddingRight: 48 },
  leftIcon: { position: "absolute", left: 16, zIndex: 1 },
  rightIcon: { position: "absolute", right: 16, zIndex: 1 },
  sectionContainer: { width: "100%" },
  sectionTitle: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
});
