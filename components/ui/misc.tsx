import { useTheme } from "@/contexts/theme-context";
import { ChevronRight, type LucideIcon } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// LoadingScreen
export const LoadingScreen = ({ color }: { color?: string }) => {
  const { colors } = useTheme();
  return (
    <View style={[miscStyles.loading, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={color ?? colors.primary} />
    </View>
  );
};

// DividerWithText
export const DividerWithText = ({ text = "ou" }: { text?: string }) => (
  <View style={miscStyles.divider}>
    <View style={miscStyles.dividerLine} />
    <Text style={miscStyles.dividerText}>{text}</Text>
    <View style={miscStyles.dividerLine} />
  </View>
);

// SettingRow
export const SettingRow = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  subtitle,
  value,
  onValueChange,
  onPress,
  showSwitch = false,
  showChevron = false,
  isLast = false,
}: {
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  showSwitch?: boolean;
  showChevron?: boolean;
  isLast?: boolean;
}) => {
  const { colors } = useTheme();
  const rowStyle = [
    miscStyles.row,
    { borderBottomColor: colors.border },
    isLast && miscStyles.rowLast,
  ];

  const content = (
    <>
      {Icon &&
        (iconBgColor ? (
          <View style={[miscStyles.iconWrapper, { backgroundColor: iconBgColor }]}>
            <Icon size={20} color="#fff" />
          </View>
        ) : (
          <Icon size={20} color={iconColor ?? colors.textSecondary} />
        ))}
      <View style={miscStyles.rowContent}>
        <Text style={[miscStyles.rowTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[miscStyles.rowSubtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#fff"
        />
      )}
      {showChevron && <ChevronRight size={20} color={colors.textSecondary} />}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={rowStyle} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={rowStyle}>{content}</View>;
};

const miscStyles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#ddd" },
  dividerText: { fontSize: 14, color: "#666" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: { borderBottomWidth: 0 },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: "500" },
  rowSubtitle: { fontSize: 13, marginTop: 2 },
});
