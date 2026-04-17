import { useTheme } from "@/contexts/theme-context";
import { useArticlesFeed } from "@/hooks/use-articles-feed";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Clock, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import RenderHtml from "react-native-render-html";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { width } = useWindowDimensions();
  const { articles, isLoading } = useArticlesFeed(i18n.language);

  const article = articles.find((a) => a.id === id);

  const htmlSource = article?.bodyHtml
    ? { html: article.bodyHtml }
    : null;

  const tagsStyles = {
    body: { color: colors.text, fontSize: 16, lineHeight: 26 } as object,
    p: { marginBottom: 12 } as object,
    h1: { color: colors.text, fontSize: 22, fontWeight: "700", marginBottom: 12 } as object,
    h2: { color: colors.text, fontSize: 19, fontWeight: "700", marginBottom: 10 } as object,
    h3: { color: colors.text, fontSize: 17, fontWeight: "600", marginBottom: 8 } as object,
    a: { color: colors.primary } as object,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Header: back button + title area */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Pressable
            style={[styles.backButton, { backgroundColor: colors.surfaceAlt }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {isLoading && !article ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : !article ? (
            <Text style={[styles.errorText, { color: colors.textMuted }]}>
              {t("news.error")}
            </Text>
          ) : (
            <>
              {/* Category + date row */}
              <View style={styles.meta}>
                {article.category ? (
                  <View style={[styles.categoryBadge, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                      {article.category}
                    </Text>
                  </View>
                ) : null}
                <Text style={[styles.date, { color: colors.textMuted }]}>
                  {article.publishedAt}
                </Text>
              </View>

              {/* Title */}
              <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

              {/* Author + read time */}
              <View style={styles.authorRow}>
                {article.author ? (
                  <View style={styles.authorItem}>
                    <User size={14} color={colors.textMuted} />
                    <Text style={[styles.authorText, { color: colors.textSecondary }]}>
                      {article.author}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.authorItem}>
                  <Clock size={14} color={colors.textMuted} />
                  <Text style={[styles.authorText, { color: colors.textSecondary }]}>
                    {t("news.readTime", { count: article.readTimeMinutes })}
                  </Text>
                </View>
              </View>

              {/* Hero image */}
              {article.imageUrl ? (
                <Image
                  source={{ uri: article.imageUrl }}
                  style={styles.heroImage}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={[
                    styles.heroImage,
                    { backgroundColor: (article.championship?.color ?? colors.primary) + "33" },
                  ]}
                />
              )}

              {/* Divider */}
              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              {/* Body */}
              {htmlSource ? (
                <RenderHtml
                  contentWidth={width - 40}
                  source={htmlSource}
                  tagsStyles={tagsStyles}
                  baseStyle={{ color: colors.text }}
                />
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginBottom: 20,
  },
  content: { paddingHorizontal: 20, paddingBottom: 48 },
  loader: { marginTop: 40 },
  errorText: { marginTop: 40, textAlign: "center", fontSize: 15 },
  meta: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: { fontSize: 12, fontWeight: "500" },
  date: { fontSize: 13 },
  title: { fontSize: 24, fontWeight: "700", lineHeight: 32, marginBottom: 14 },
  authorRow: { flexDirection: "row", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  authorItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  authorText: { fontSize: 14 },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 20 },
});
