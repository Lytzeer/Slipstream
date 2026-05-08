"use client";

import { ChampionshipToggleRow } from "@/components/ui/championship";
import { useTheme } from "@/contexts/theme-context";
import { getChampionshipDisplayName } from "@/lib/api/cms/models/championship-label.model";
import type { ChampionshipRaw } from "@/types";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  championships: ChampionshipRaw[];
  followedChampionships: Record<string, boolean>;
  onApply: (next: Record<string, boolean>) => void;
};

export const ChampionshipsModal = ({
  visible,
  onClose,
  championships,
  followedChampionships,
  onApply,
}: Props) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const [draft, setDraft] = useState<Record<string, boolean>>(followedChampionships);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setDraft((prev) => {
      const next: Record<string, boolean> = { ...followedChampionships };
      for (const c of championships) {
        if (next[c.id] === undefined) next[c.id] = prev[c.id] ?? false;
      }
      return next;
    });
  }, [visible, followedChampionships, championships]);

  const toggle = (id: string) => {
    setDraft((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApply = async () => {
    const unchanged = championships.every(
      (c) => (draft[c.id] ?? false) === (followedChampionships[c.id] ?? false)
    );
    if (unchanged) {
      onClose();
      return;
    }
    setIsApplying(true);
    try {
      onApply({ ...draft });
      onClose();
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.modal, { backgroundColor: colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.header, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t("profile.followedChampionships")}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={12}
              style={[
                styles.closeBtn,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={[styles.body, { backgroundColor: colors.surface }]}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {championships.map((champ, index) => (
              <ChampionshipToggleRow
                key={champ.id}
                name={getChampionshipDisplayName(champ, t)}
                color={champ.color}
                value={draft[champ.id] ?? false}
                onValueChange={() => toggle(champ.id)}
                isLast={index === championships.length - 1}
              />
            ))}
          </ScrollView>

          <View style={[styles.footerArea, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              {t("profile.followedChampionshipsHint")}
            </Text>
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={handleApply}
              disabled={isApplying}
              activeOpacity={0.8}
            >
              {isApplying ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.applyBtnText}>{t("common.apply")}</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 340,
    maxHeight: "85%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    maxHeight: 320,
  },
  bodyContent: {
    paddingVertical: 4,
  },
  footerArea: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
  applyBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
