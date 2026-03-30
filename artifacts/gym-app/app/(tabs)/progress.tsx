import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

type LogEntry = {
  id: string;
  date: string;
  weight: number;
  bodyFat: number;
  workouts: number;
};

const INITIAL_LOGS: LogEntry[] = [
  { id: "1", date: "Jan 15", weight: 82.5, bodyFat: 18.2, workouts: 4 },
  { id: "2", date: "Feb 01", weight: 81.2, bodyFat: 17.8, workouts: 5 },
  { id: "3", date: "Feb 15", weight: 80.4, bodyFat: 17.1, workouts: 6 },
  { id: "4", date: "Mar 01", weight: 79.8, bodyFat: 16.5, workouts: 5 },
  { id: "5", date: "Mar 15", weight: 78.9, bodyFat: 16.0, workouts: 7 },
  { id: "6", date: "Mar 30", weight: 78.1, bodyFat: 15.6, workouts: 6 },
];

const HEIGHT_CM = 178;

function calcBMI(weight: number): number {
  const hm = HEIGHT_CM / 100;
  return parseFloat((weight / (hm * hm)).toFixed(1));
}

function BMIBar({ bmi }: { bmi: number }) {
  const pct = Math.min(Math.max(((bmi - 16) / (36 - 16)) * 100, 0), 100);
  let color = Colors.success;
  let label = "Normal";
  if (bmi < 18.5) { color = "#60A5FA"; label = "Underweight"; }
  else if (bmi >= 25 && bmi < 30) { color = Colors.warning; label = "Overweight"; }
  else if (bmi >= 30) { color = Colors.error; label = "Obese"; }

  return (
    <View style={bmiStyles.container}>
      <View style={bmiStyles.row}>
        <Text style={bmiStyles.value}>{bmi}</Text>
        <View style={[bmiStyles.badge, { backgroundColor: color + "22" }]}>
          <Text style={[bmiStyles.badgeText, { color }]}>{label}</Text>
        </View>
      </View>
      <View style={bmiStyles.bar}>
        <View style={[bmiStyles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
        <View style={[bmiStyles.marker, { left: `${pct}%` as any }]} />
      </View>
      <View style={bmiStyles.labels}>
        <Text style={bmiStyles.barLabel}>16</Text>
        <Text style={bmiStyles.barLabel}>18.5</Text>
        <Text style={bmiStyles.barLabel}>25</Text>
        <Text style={bmiStyles.barLabel}>30</Text>
        <Text style={bmiStyles.barLabel}>36</Text>
      </View>
    </View>
  );
}

const bmiStyles = StyleSheet.create({
  container: { marginTop: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  value: { fontSize: 36, color: Colors.text, fontFamily: "Inter_700Bold" },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  bar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  fill: { height: "100%", borderRadius: 4 },
  marker: {
    position: "absolute",
    top: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.text,
    borderWidth: 2,
    borderColor: Colors.background,
    marginLeft: -7,
  },
  labels: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  barLabel: { fontSize: 10, color: Colors.textMuted, fontFamily: "Inter_400Regular" },
});

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [showForm, setShowForm] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [bodyFatInput, setBodyFatInput] = useState("");
  const [workoutsInput, setWorkoutsInput] = useState("");

  const latest = logs[logs.length - 1];
  const prev = logs[logs.length - 2];
  const weightChange = prev ? parseFloat((latest.weight - prev.weight).toFixed(1)) : 0;
  const bmi = calcBMI(latest.weight);

  const totalWorkouts = logs.reduce((acc, l) => acc + l.workouts, 0);

  function handleAddLog() {
    const weight = parseFloat(weightInput);
    const bodyFat = parseFloat(bodyFatInput);
    const workouts = parseInt(workoutsInput, 10);
    if (isNaN(weight) || isNaN(bodyFat) || isNaN(workouts)) {
      Alert.alert("Invalid input", "Please enter valid numbers for all fields.");
      return;
    }
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const newEntry: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      date: dateStr,
      weight,
      bodyFat,
      workouts,
    };
    setLogs((prev) => [...prev, newEntry]);
    setWeightInput("");
    setBodyFatInput("");
    setWorkoutsInput("");
    setShowForm(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Logged!", "Your progress has been saved.");
  }

  const chartMax = Math.max(...logs.map((l) => l.weight)) + 3;
  const chartMin = Math.min(...logs.map((l) => l.weight)) - 3;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>My Progress</Text>
            <Text style={styles.subtitle}>Track your fitness journey</Text>
          </View>
          <Pressable
            style={styles.addBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowForm((v) => !v);
            }}
          >
            <Ionicons name={showForm ? "close" : "add"} size={22} color={Colors.background} />
          </Pressable>
        </View>

        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Log Today's Stats</Text>
            <View style={styles.formRow}>
              <View style={styles.inputWrap}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 78.5"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
              <View style={styles.inputWrap}>
                <Text style={styles.inputLabel}>Body Fat %</Text>
                <TextInput
                  style={styles.input}
                  value={bodyFatInput}
                  onChangeText={setBodyFatInput}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 15.5"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Workouts this period</Text>
              <TextInput
                style={styles.input}
                value={workoutsInput}
                onChangeText={setWorkoutsInput}
                keyboardType="number-pad"
                placeholder="e.g. 6"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <Pressable style={styles.submitBtn} onPress={handleAddLog}>
              <Text style={styles.submitText}>Save Entry</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Current Weight</Text>
            <Text style={styles.statValue}>{latest.weight}<Text style={styles.statUnit}> kg</Text></Text>
            <View style={[styles.changePill, { backgroundColor: weightChange <= 0 ? Colors.success + "22" : Colors.error + "22" }]}>
              <Ionicons
                name={weightChange <= 0 ? "trending-down" : "trending-up"}
                size={12}
                color={weightChange <= 0 ? Colors.success : Colors.error}
              />
              <Text style={[styles.changeText, { color: weightChange <= 0 ? Colors.success : Colors.error }]}>
                {weightChange > 0 ? "+" : ""}{weightChange} kg
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Body Fat</Text>
            <Text style={styles.statValue}>{latest.bodyFat}<Text style={styles.statUnit}>%</Text></Text>
            <View style={styles.changePill}>
              <Ionicons name="flame" size={12} color={Colors.gold} />
              <Text style={[styles.changeText, { color: Colors.gold }]}>Tracking</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Workouts</Text>
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <View style={[styles.changePill, { backgroundColor: Colors.success + "22" }]}>
              <Ionicons name="barbell" size={12} color={Colors.success} />
              <Text style={[styles.changeText, { color: Colors.success }]}>All time</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>BMI Index</Text>
          <BMIBar bmi={bmi} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weight History</Text>
          <View style={styles.miniChart}>
            {logs.map((log, i) => {
              const h = ((log.weight - chartMin) / (chartMax - chartMin)) * 80;
              return (
                <View key={log.id} style={styles.barWrap}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(h, 4),
                        backgroundColor: i === logs.length - 1 ? Colors.gold : Colors.border,
                      },
                    ]}
                  />
                  <Text style={styles.barDate}>{log.date.split(" ")[0]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress Log</Text>
          {logs
            .slice()
            .reverse()
            .map((log) => (
              <View key={log.id} style={styles.logRow}>
                <View style={styles.logDot} />
                <View style={styles.logLeft}>
                  <Text style={styles.logDate}>{log.date}</Text>
                </View>
                <View style={styles.logRight}>
                  <Text style={styles.logStat}>{log.weight} kg</Text>
                  <Text style={styles.logStatSub}>{log.bodyFat}% fat · {log.workouts} sessions</Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  formTitle: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputWrap: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: "Inter_500Medium",
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.text,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    fontSize: 15,
    color: Colors.background,
    fontFamily: "Inter_700Bold",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  statUnit: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  changeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  miniChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 96,
    paddingTop: 10,
  },
  barWrap: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
  },
  barDate: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: "Inter_400Regular",
  },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
  logLeft: {
    flex: 1,
  },
  logDate: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "Inter_500Medium",
  },
  logRight: {
    alignItems: "flex-end",
  },
  logStat: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  logStatSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
});
