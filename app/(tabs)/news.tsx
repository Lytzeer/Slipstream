import { ChampionshipSelector, NewsArticleCard } from "@/components/ui";
import { newsArticles, championshipsList } from "@/constants/mock-data";
import { useTheme } from "@/contexts/theme-context";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORY_KEYS = [
  "news.categoryAnalysis",
  "news.categoryResult",
  "news.categoryPreview",
  "news.categoryInterview",
];

export default function NewsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedChampionship, setSelectedChampionship] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const championships = [
    { id: "all", name: t("common.all"), color: colors.primary },
    ...championshipsList.map((c) => ({
      id: c.id,
      name: t(c.nameKey),
      color: c.color,
    })),
  ];

  const categories = [
    { id: "all", name: t("common.all"), color: colors.primary },
    ...CATEGORY_KEYS.map((key) => ({
      id: key,
      name: t(key),
      color: colors.primary,
    })),
  ];

  const filtered = newsArticles.filter((article) => {
    const matchesChampionship =
      selectedChampionship === "all" || article.championshipId === selectedChampionship;
    const matchesCategory =
      selectedCategory === "all" || article.categoryKey === selectedCategory;
    const matchesSearch = t(article.titleKey)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesChampionship && matchesCategory && matchesSearch;
  });

  const getChampionship = (id: string) => {
    const raw = championshipsList.find((c) => c.id === id);
    return { id, name: t(raw?.nameKey ?? ""), color: raw?.color ?? "#888" };
  };

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
            title={t(item.titleKey)}
            championship={getChampionship(item.championshipId)}
            category={t(item.categoryKey)}
            date={item.date}
            readTime={t(item.readTimeKey)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filtersLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filtersLabelText: {
    fontSize: 13,
  },
  categorySpacer: { height: 0 },
  list: {
    padding: 20,
    gap: 16,
  },
  empty: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
  },
});
