import { ChampionshipSelector, NewsArticleCard } from "@/components/ui";
import { useTheme } from "@/contexts/theme-context";
import { useArticleCategories } from "@/hooks/use-article-categories";
import { useArticlesFeed } from "@/hooks/use-articles-feed";
import { useChampionshipsCatalog } from "@/hooks/use-championships-catalog";
import type { ChampionshipRaw } from "@/types";
import { router } from "expo-router";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const toChampionship = (raw: ChampionshipRaw) => ({
  id: raw.id,
  name: raw.displayLabel ?? raw.id,
  color: raw.color,
});

export default function NewsScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [selectedChampionship, setSelectedChampionship] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { championships: championshipsRaw } = useChampionshipsCatalog();
  const { articles, isLoading, error } = useArticlesFeed(i18n.language);
  const { categories: cmsCategoriesList } = useArticleCategories();

  const championships = [
    { id: "all", name: t("common.all"), color: colors.primary },
    ...championshipsRaw.map(toChampionship),
  ];

  const categories = [
    { id: "all", name: t("common.all"), color: colors.primary },
    ...cmsCategoriesList.map((c) => ({
      id: c.id,
      name: c.name,
      color: colors.primary,
    })),
  ];

  const filtered = articles.filter((article) => {
    const matchesChampionship =
      selectedChampionship === "all" ||
      article.championship?.id === selectedChampionship;
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesChampionship && matchesCategory && matchesSearch;
  });

  const header = (
    <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t("news.title")}</Text>

      <View style={[styles.searchWrapper, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <Search size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t("news.searchPlaceholder")}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersLabel}>
        <SlidersHorizontal size={14} color={colors.textMuted} />
        <Text style={[styles.filtersLabelText, { color: colors.textMuted }]}>{t("news.filters")}</Text>
      </View>

      <ChampionshipSelector
        championships={championships}
        selectedChampionship={selectedChampionship}
        onChampionshipChange={setSelectedChampionship}
      />

      <View style={styles.categorySpacer} />

      <ChampionshipSelector
        championships={categories}
        selectedChampionship={selectedCategory}
        onChampionshipChange={setSelectedCategory}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {header}
      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : error ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t("news.error")}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t("news.noResults")}</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <NewsArticleCard
              index={index}
              title={item.title}
              championship={
                item.championship
                  ? toChampionship(item.championship)
                  : { id: "unknown", name: "", color: colors.border }
              }
              category={item.category ?? ""}
              date={item.publishedAt}
              readTime={t("news.readTime", { count: item.readTimeMinutes })}
              imageUrl={item.imageUrl}
              onPress={() => router.push(`/article/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filtersLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  filtersLabelText: { fontSize: 13 },
  categorySpacer: { height: 8 },
  list: { padding: 16, paddingBottom: 96, gap: 12 },
  empty: { flex: 1, alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 15 },
  loader: { marginTop: 60 },
});
