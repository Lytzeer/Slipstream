import { colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ArrowLeft, type LucideIcon } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import type { PropsWithChildren, ReactElement } from "react";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";
import { ThemedView } from "@/components/themed";

// AuthFormLayout
export const AuthFormLayout = ({ children }: PropsWithChildren) => (
  <View style={layoutStyles.authContainer}>{children}</View>
);

// ScreenHeader
export const ScreenHeader = ({
  title,
  onBack,
  backHref,
  Icon,
}: {
  title: string;
  onBack?: () => void;
  backHref?: string;
  Icon?: LucideIcon;
}) => {
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onBack) onBack();
    else if (backHref) router.navigate(backHref as never);
    else router.back();
  };
  return (
    <View style={layoutStyles.header}>
      <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
        {React.createElement(Icon ?? ArrowLeft, {
          size: 24,
          color: colors.black,
        })}
      </TouchableOpacity>
      <Text style={layoutStyles.headerTitle}>{title}</Text>
    </View>
  );
};

// ParallaxScrollView
const HEADER_HEIGHT = 250;

export const ParallaxScrollView = ({
  children,
  headerImage,
  headerBackgroundColor,
}: PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>) => {
  const backgroundColor = useThemeColor({}, "background");
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [2, 1, 1]
        ),
      },
    ],
  }));

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}
    >
      <Animated.View
        style={[
          layoutStyles.parallaxHeader,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}
      >
        {headerImage}
      </Animated.View>
      <ThemedView style={layoutStyles.parallaxContent}>{children}</ThemedView>
    </Animated.ScrollView>
  );
};

const layoutStyles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: colors.black },
  parallaxHeader: { height: HEADER_HEIGHT, overflow: "hidden" },
  parallaxContent: { flex: 1, padding: 32, gap: 16, overflow: "hidden" },
});
