import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CLASSES: Record<string, Class[]> = {
  Mon: [
    { id: "1", name: "Power Lifting", trainer: "Alex Rodriguez", time: "7:00 AM", duration: "60 min", spots: 3, level: "Advanced", booked: false },
    { id: "2", name: "Cardio Blast", trainer: "Jamie Lee", time: "10:00 AM", duration: "45 min", spots: 10, level: "Beginner", booked: false },
    { id: "3", name: "Yoga Flow", trainer: "Maya Patel", time: "12:00 PM", duration: "60 min", spots: 15, level: "All Levels", booked: false },
    { id: "4", name: "HIIT Inferno", trainer: "Sarah Chen", time: "5:30 PM", duration: "45 min", spots: 5, level: "Intermediate", booked: false },
  ],
  Tue: [
    { id: "5", name: "Spin & Burn", trainer: "Mark Davis", time: "6:30 AM", duration: "50 min", spots: 8, level: "Intermediate", booked: false },
    { id: "6", name: "Pilates Core", trainer: "Emma Wilson", time: "9:00 AM", duration: "55 min", spots: 12, level: "Beginner", booked: false },
    { id: "7", name: "CrossFit WOD", trainer: "Alex Rodriguez", time: "6:00 PM", duration: "60 min", spots: 6, level: "Advanced", booked: false },
  ],
  Wed: [
    { id: "8", name: "Boxing Basics", trainer: "Marcus Johnson", time: "7:30 AM", duration: "60 min", spots: 8, level: "Beginner", booked: false },
    { id: "9", name: "Body Pump", trainer: "Sarah Chen", time: "11:00 AM", duration: "55 min", spots: 14, level: "All Levels", booked: false },
    { id: "10", name: "HIIT Inferno", trainer: "Jamie Lee", time: "6:00 PM", duration: "45 min", spots: 4, level: "Intermediate", booked: false },
  ],
  Thu: [
    { id: "11", name: "Yoga Flow", trainer: "Maya Patel", time: "8:00 AM", duration: "60 min", spots: 12, level: "All Levels", booked: false },
    { id: "12", name: "Power Lifting", trainer: "Alex Rodriguez", time: "5:30 PM", duration: "60 min", spots: 7, level: "Advanced", booked: false },
  ],
  Fri: [
    { id: "13", name: "Cardio Blast", trainer: "Emma Wilson", time: "7:00 AM", duration: "45 min", spots: 10, level: "Beginner", booked: false },
    { id: "14", name: "CrossFit WOD", trainer: "Marcus Johnson", time: "9:30 AM", duration: "60 min", spots: 5, level: "Advanced", booked: false },
    { id: "15", name: "Pilates Core", trainer: "Maya Patel", time: "5:00 PM", duration: "55 min", spots: 9, level: "Beginner", booked: false },
  ],
  Sat: [
    { id: "16", name: "Weekend Warrior", trainer: "Alex Rodriguez", time: "9:00 AM", duration: "75 min", spots: 12, level: "All Levels", booked: false },
    { id: "17", name: "Spin & Burn", trainer: "Mark Davis", time: "11:00 AM", duration: "50 min", spots: 8, level: "Intermediate", booked: false },
  ],
  Sun: [
    { id: "18", name: "Recovery Yoga", trainer: "Maya Patel", time: "10:00 AM", duration: "60 min", spots: 15, level: "All Levels", booked: false },
    { id: "19", name: "Open Gym", trainer: "Staff", time: "8:00 AM", duration: "All day", spots: 50, level: "All Levels", booked: false },
  ],
};

type Class = {
  id: string;
  name: string;
  trainer: string;
  time: string;
  duration: string;
  spots: number;
  level: string;
  booked: boolean;
};

const LEVEL_COLORS: Record<string, string> = {
  Advanced: "#EF4444",
  Intermediate: "#F59E0B",
  Beginner: "#22C55E",
  "All Levels": "#6366F1",
};

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const todayIdx = new Date().getDay();
  const todayDay = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];
  const [selectedDay, setSelectedDay] = useState(todayDay);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());

  const classes = CLASSES[selectedDay] ?? [];

  function handleBook(cls: Class) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (bookedIds.has(cls.id)) {
      setBookedIds((prev) => {
        const next = new Set(prev);
        next.delete(cls.id);
        return next;
      });
    } else {
      setBookedIds((prev) => new Set([...prev, cls.id]));
      Alert.alert("Booked!", `You're registered for ${cls.name} at ${cls.time}.`);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={styles.title}>Class Schedule</Text>
        <Text style={styles.subtitle}>Book your next session</Text>
      </View>

      <View style={styles.daySelector}>
        {DAYS.map((day) => (
          <Pressable
            key={day}
            style={[styles.dayBtn, selectedDay === day && styles.dayBtnActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedDay(day);
            }}
          >
            <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>
              {day}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 },
        ]}
        scrollEnabled={classes.length > 0}
        renderItem={({ item }) => {
          const isBooked = bookedIds.has(item.id);
          return (
            <View style={styles.classCard}>
              <View style={styles.classLeft}>
                <Text style={styles.classTime}>{item.time}</Text>
                <Text style={styles.classDuration}>{item.duration}</Text>
              </View>
              <View style={styles.classMain}>
                <Text style={styles.className}>{item.name}</Text>
                <View style={styles.classRow}>
                  <Ionicons name="person-outline" size={12} color={Colors.textSecondary} />
                  <Text style={styles.classTrainer}>{item.trainer}</Text>
                </View>
                <View style={styles.classFooter}>
                  <View
                    style={[
                      styles.levelBadge,
                      { backgroundColor: (LEVEL_COLORS[item.level] ?? "#6366F1") + "22" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.levelText,
                        { color: LEVEL_COLORS[item.level] ?? "#6366F1" },
                      ]}
                    >
                      {item.level}
                    </Text>
                  </View>
                  <Text style={styles.spotsText}>{item.spots} spots</Text>
                </View>
              </View>
              <Pressable
                style={[styles.bookBtn, isBooked && styles.bookBtnActive]}
                onPress={() => handleBook(item)}
              >
                <Ionicons
                  name={isBooked ? "checkmark" : "add"}
                  size={20}
                  color={isBooked ? Colors.background : Colors.gold}
                />
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No classes scheduled</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  daySelector: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 16,
  },
  dayBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayBtnActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  dayText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: "Inter_600SemiBold",
  },
  dayTextActive: {
    color: Colors.background,
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  classCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  classLeft: {
    width: 56,
    alignItems: "center",
  },
  classTime: {
    fontSize: 12,
    color: Colors.gold,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  classDuration: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 2,
  },
  classMain: {
    flex: 1,
    gap: 4,
  },
  className: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  classRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  classTrainer: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  classFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  levelBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  spotsText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "Inter_400Regular",
  },
  bookBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  bookBtnActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
    fontFamily: "Inter_500Medium",
  },
});
