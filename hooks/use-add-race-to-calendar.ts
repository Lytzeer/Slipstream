import type { ChampionshipRaceFeedItem } from "@/lib/api/cms/controllers/championship.controller";
import * as Calendar from "expo-calendar";
import { useTranslation } from "react-i18next";
import { Alert, Platform } from "react-native";

const getDefaultCalendarId = async (): Promise<string | null> => {
  if (Platform.OS === "ios") {
    const cal = await Calendar.getDefaultCalendarAsync();
    return cal?.id ?? null;
  }
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.find((c) => c.allowsModifications);
  return writable?.id ?? null;
};

export const useAddRaceToCalendar = () => {
  const { t } = useTranslation();

  const addRaceToCalendar = async (item: ChampionshipRaceFeedItem) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("calendar.permissionRequired"), t("calendar.permissionDenied"));
      return;
    }

    const calendarId = await getDefaultCalendarId();
    if (!calendarId) {
      Alert.alert(t("calendar.addError"));
      return;
    }

    const startDate = item.startTimestamp ? new Date(item.startTimestamp) : new Date();
    startDate.setHours(0, 0, 0, 0);

    const endBase = item.endTimestamp ? new Date(item.endTimestamp) : new Date(startDate);
    endBase.setHours(0, 0, 0, 0);
    const endDate = new Date(endBase);
    endDate.setDate(endDate.getDate() + 1);

    try {
      await Calendar.createEventAsync(calendarId, {
        title: item.race.name,
        location: item.race.circuit,
        notes: item.championship.displayLabel ?? item.championship.id,
        startDate,
        endDate,
        allDay: true,
      });
      Alert.alert(t("calendar.addSuccess"));
    } catch {
      Alert.alert(t("calendar.addError"));
    }
  };

  return { addRaceToCalendar };
};
