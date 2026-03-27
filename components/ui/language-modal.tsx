"use client";

import { LANGUAGES, type Locale } from "@/constants/locales";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import { useTranslation } from "react-i18next";
import * as Updates from "expo-updates";
import { Check, Globe, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const HEADER_ORANGE = "#FF9502";

export const LanguageModal = ({ visible, onClose }: Props) => {
  const { locale, setLocale } = useLanguage();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedLocale, setSelectedLocale] = useState<Locale>(locale);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (visible) setSelectedLocale(locale);
  }, [visible, locale]);

  const handleSelect = (code: Locale) => {
    setSelectedLocale(code);
  };

  const handleApply = async () => {
    if (selectedLocale === locale) {
      onClose();
      return;
    }
    setIsApplying(true);
    try {
      await setLocale(selectedLocale);
      onClose();
      await Updates.reloadAsync();
    } catch {
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
        <Pressable style={[styles.modal, { backgroundColor: colors.surface }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.header, { backgroundColor: HEADER_ORANGE }]}>
            <Globe size={22} color="#fff" />
            <Text style={styles.headerTitle}>{t("language.chooseLanguage")}</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={12}
              style={styles.closeBtn}
            >
              <X size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={[styles.body, { backgroundColor: colors.surface }]}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLocale === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langRow,
                    {
                      backgroundColor: isSelected
                        ? "rgba(255,59,49,0.12)"
                        : colors.surfaceAlt,
                      borderColor: isSelected ? colors.primary : "transparent",
                    },
                    isSelected && styles.langRowSelected,
                  ]}
                  onPress={() => handleSelect(lang.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <Text style={[styles.langLabel, { color: colors.text }]}>
                    {lang.label}
                  </Text>
                  {isSelected && (
                    <View style={[styles.checkWrapper, { backgroundColor: colors.primary }]}>
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.footerArea, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              {t("language.applyToApp")}
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
    color: "#fff",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: 12,
    gap: 8,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  langRowSelected: {
    borderWidth: 1.5,
  },
  flag: {
    fontSize: 24,
  },
  langLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  checkWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
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
