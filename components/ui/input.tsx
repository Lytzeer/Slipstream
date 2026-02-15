import { Eye, EyeOff, LucideIcon } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type Props = TextInputProps & {
  leftIcon?: LucideIcon;
  isPassword?: boolean;
};

export default function Input({
  leftIcon: LeftIcon,
  isPassword,
  style,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {LeftIcon && (
        <View style={styles.leftIcon}>
          <LeftIcon size={20} color={"#9CA3AF"} />
        </View>
      )}

      <TextInput
        style={[
          styles.input,
          LeftIcon ? styles.withLeftIcon : undefined,
          isPassword ? styles.withRightIcon : undefined,
          focused ? styles.inputFocused : undefined,
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
          style={styles.rightIcon}
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

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    justifyContent: "center",
  },
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
  inputFocused: {
    borderColor: "#FF3B31",
    borderWidth: 1,
  },
  withLeftIcon: {
    paddingLeft: 48,
  },
  withRightIcon: {
    paddingRight: 48,
  },
  leftIcon: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  rightIcon: {
    position: "absolute",
    right: 16,
    zIndex: 1,
  },
});
