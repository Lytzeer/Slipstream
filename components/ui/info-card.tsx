import { Image } from "expo-image";
import { Clock } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface InfoCardProps {
  image: string;
  category: string;
  title: string;
  readTime: string;
  onPress?: () => void;
}

export default function InfoCard({
  image,
  category,
  title,
  readTime,
  onPress,
}: InfoCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} contentFit="cover" />
      </View>
      <View style={styles.content}>
        <View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{category}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={styles.meta}>
          <Clock color="#8E8E93" size={12} />
          <Text style={styles.metaText}>{readTime}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginTop: 16,
  },
  imageWrapper: {
    width: 112,
    height: 112,
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    justifyContent: "space-between",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#3C3C43",
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    color: "#1C1C1E",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#8E8E93",
  },
});
