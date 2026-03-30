import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
};

type Workout = {
  id: string;
  name: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  calories: number;
  exercises: Exercise[];
  description: string;
};

const WORKOUTS: Workout[] = [
  {
    id: "1",
    name: "Full Body Blast",
    category: "Strength",
    duration: "45 min",
    difficulty: "Intermediate",
    calories: 350,
    description: "A complete full-body workout targeting all major muscle groups with compound movements.",
    exercises: [
      { name: "Barbell Squats", sets: 4, reps: "8-10", rest: "90s" },
      { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
      { name: "Bent Over Rows", sets: 3, reps: "10-12", rest: "60s" },
      { name: "Overhead Press", sets: 3, reps: "10-12", rest: "60s" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12", rest: "60s" },
      { name: "Plank Hold", sets: 3, reps: "45s", rest: "30s" },
    ],
  },
  {
    id: "2",
    name: "HIIT Inferno",
    category: "Cardio",
    duration: "30 min",
    difficulty: "Advanced",
    calories: 450,
    description: "High-intensity interval training to maximize calorie burn and improve cardiovascular endurance.",
    exercises: [
      { name: "Burpees", sets: 4, reps: "45s work", rest: "15s" },
      { name: "Mountain Climbers", sets: 4, reps: "45s work", rest: "15s" },
      { name: "Jump Squats", sets: 4, reps: "45s work", rest: "15s" },
      { name: "High Knees", sets: 4, reps: "45s work", rest: "15s" },
      { name: "Box Jumps", sets: 4, reps: "45s work", rest: "15s" },
    ],
  },
  {
    id: "3",
    name: "Core Crusher",
    category: "Core",
    duration: "20 min",
    difficulty: "Beginner",
    calories: 180,
    description: "Focused abdominal and core strengthening workout perfect for building a solid foundation.",
    exercises: [
      { name: "Crunches", sets: 3, reps: "15-20", rest: "30s" },
      { name: "Leg Raises", sets: 3, reps: "12-15", rest: "30s" },
      { name: "Russian Twists", sets: 3, reps: "20 total", rest: "30s" },
      { name: "Plank", sets: 3, reps: "30-45s", rest: "30s" },
      { name: "Dead Bug", sets: 3, reps: "10 each side", rest: "30s" },
    ],
  },
  {
    id: "4",
    name: "Upper Body Power",
    category: "Strength",
    duration: "50 min",
    difficulty: "Advanced",
    calories: 380,
    description: "Intense upper body session focusing on chest, back, shoulders, and arms.",
    exercises: [
      { name: "Pull-ups", sets: 4, reps: "8-12", rest: "90s" },
      { name: "Incline Dumbbell Press", sets: 4, reps: "8-10", rest: "90s" },
      { name: "Cable Rows", sets: 3, reps: "10-12", rest: "60s" },
      { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "45s" },
      { name: "Tricep Dips", sets: 3, reps: "10-12", rest: "60s" },
      { name: "Bicep Curls", sets: 3, reps: "10-12", rest: "45s" },
    ],
  },
  {
    id: "5",
    name: "Leg Day Essentials",
    category: "Strength",
    duration: "55 min",
    difficulty: "Intermediate",
    calories: 400,
    description: "Complete lower body workout to build strength and muscle in your legs and glutes.",
    exercises: [
      { name: "Back Squats", sets: 4, reps: "6-8", rest: "120s" },
      { name: "Leg Press", sets: 4, reps: "10-12", rest: "90s" },
      { name: "Walking Lunges", sets: 3, reps: "12 each leg", rest: "60s" },
      { name: "Leg Curls", sets: 3, reps: "12-15", rest: "45s" },
      { name: "Calf Raises", sets: 4, reps: "15-20", rest: "45s" },
    ],
  },
  {
    id: "6",
    name: "Yoga Flow",
    category: "Flexibility",
    duration: "40 min",
    difficulty: "Beginner",
    calories: 150,
    description: "Relaxing yoga session to improve flexibility, balance, and mental clarity.",
    exercises: [
      { name: "Sun Salutation", sets: 5, reps: "full flow", rest: "breath" },
      { name: "Warrior Sequence", sets: 3, reps: "each side", rest: "breath" },
      { name: "Downward Dog", sets: 3, reps: "30s hold", rest: "breath" },
      { name: "Pigeon Pose", sets: 2, reps: "60s each side", rest: "breath" },
      { name: "Savasana", sets: 1, reps: "5 min", rest: "-" },
    ],
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  Strength: "barbell-outline",
  Cardio: "heart-outline",
  Core: "fitness-outline",
  Flexibility: "body-outline",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: Colors.success,
  Intermediate: Colors.warning,
  Advanced: Colors.error,
};

const CATEGORIES = ["All", "Strength", "Cardio", "Core", "Flexibility"];

function WorkoutCard({
  workout,
  onPress,
}: {
  workout: Workout;
  onPress: (workout: Workout) => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const difficultyColor = DIFFICULTY_COLORS[workout.difficulty];

  return (
    <Pressable
      onPressIn={() =>
        Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start()
      }
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(workout);
      }}
    >
      <Animated.View style={[styles.workoutCard, { transform: [{ scale }] }]}>
        <View style={styles.workoutHeader}>
          <View style={styles.categoryIcon}>
            <Ionicons
              name={CATEGORY_ICONS[workout.category] as any}
              size={22}
              color={Colors.gold}
            />
          </View>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutCategory}>{workout.category}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor + "22" }]}>
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {workout.difficulty}
            </Text>
          </View>
        </View>

        <Text style={styles.workoutDescription} numberOfLines={2}>
          {workout.description}
        </Text>

        <View style={styles.workoutStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.statText}>{workout.duration}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={14} color={Colors.error} />
            <Text style={styles.statText}>{workout.calories} cal</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={14}
              color={Colors.textSecondary}
            />
            <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
          </View>
        </View>

        <Pressable
          style={styles.startBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress(workout);
          }}
        >
          <Text style={styles.startBtnText}>View Workout</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.gold} />
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

export default function WorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  const filteredWorkouts =
    selectedCategory === "All"
      ? WORKOUTS
      : WORKOUTS.filter((w) => w.category === selectedCategory);

  function toggleExercise(index: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handleStartWorkout() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Workout Started!",
      `You're starting "${selectedWorkout?.name}". Good luck!`,
      [{ text: "Let's Go!", style: "default" }]
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={styles.title}>Workouts</Text>
        <Text style={styles.subtitle}>Find your perfect routine</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.categoryBtn,
              selectedCategory === cat && styles.categoryBtnActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedCategory(cat);
            }}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <WorkoutCard workout={item} onPress={setSelectedWorkout} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No workouts found</Text>
          </View>
        }
      />

      <Modal
        visible={selectedWorkout !== null}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setSelectedWorkout(null);
          setCompletedExercises(new Set());
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Pressable
                onPress={() => {
                  setSelectedWorkout(null);
                  setCompletedExercises(new Set());
                }}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={Colors.text} />
              </Pressable>
              <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>
              <View style={{ width: 36 }} />
            </View>

            {selectedWorkout && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.modalScroll}
              >
                <View style={styles.modalStats}>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="time-outline" size={18} color={Colors.gold} />
                    <Text style={styles.modalStatValue}>{selectedWorkout.duration}</Text>
                    <Text style={styles.modalStatLabel}>Duration</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="flame-outline" size={18} color={Colors.error} />
                    <Text style={styles.modalStatValue}>{selectedWorkout.calories}</Text>
                    <Text style={styles.modalStatLabel}>Calories</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <MaterialCommunityIcons name="dumbbell" size={18} color={Colors.gold} />
                    <Text style={styles.modalStatValue}>
                      {selectedWorkout.exercises.length}
                    </Text>
                    <Text style={styles.modalStatLabel}>Exercises</Text>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Exercises</Text>
                <View style={styles.exerciseList}>
                  {selectedWorkout.exercises.map((exercise, index) => {
                    const isCompleted = completedExercises.has(index);
                    return (
                      <Pressable
                        key={index}
                        style={[
                          styles.exerciseCard,
                          isCompleted && styles.exerciseCardCompleted,
                        ]}
                        onPress={() => toggleExercise(index)}
                      >
                        <View style={styles.exerciseLeft}>
                          <View
                            style={[
                              styles.exerciseCheck,
                              isCompleted && styles.exerciseCheckActive,
                            ]}
                          >
                            {isCompleted && (
                              <Ionicons
                                name="checkmark"
                                size={14}
                                color={Colors.background}
                              />
                            )}
                          </View>
                          <View>
                            <Text
                              style={[
                                styles.exerciseName,
                                isCompleted && styles.exerciseNameCompleted,
                              ]}
                            >
                              {exercise.name}
                            </Text>
                            <Text style={styles.exerciseDetails}>
                              {exercise.sets} sets x {exercise.reps}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.restBadge}>
                          <Text style={styles.restText}>{exercise.rest} rest</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${
                          (completedExercises.size / selectedWorkout.exercises.length) *
                          100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {completedExercises.size} / {selectedWorkout.exercises.length} completed
                </Text>

                <Pressable style={styles.startWorkoutBtn} onPress={handleStartWorkout}>
                  <Text style={styles.startWorkoutText}>Start Workout</Text>
                  <Ionicons name="play" size={18} color={Colors.background} />
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    paddingBottom: 8,
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
  categoryScroll: {
    maxHeight: 50,
    marginVertical: 12,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryBtnActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  categoryText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_600SemiBold",
  },
  categoryTextActive: {
    color: Colors.background,
  },
  list: {
    paddingHorizontal: 20,
    gap: 16,
  },
  workoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.borderGold,
    alignItems: "center",
    justifyContent: "center",
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 17,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  workoutCategory: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  difficultyBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  difficultyText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  workoutDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  workoutStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: "Inter_500Medium",
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 12,
  },
  startBtnText: {
    fontSize: 14,
    color: Colors.gold,
    fontFamily: "Inter_700Bold",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    flex: 1,
  },
  modalStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  modalStatItem: {
    alignItems: "center",
    gap: 6,
  },
  modalStatValue: {
    fontSize: 20,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  modalStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  exerciseList: {
    gap: 10,
    marginBottom: 20,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseCardCompleted: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + "11",
  },
  exerciseLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  exerciseCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseCheckActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  exerciseName: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: "Inter_600SemiBold",
  },
  exerciseNameCompleted: {
    textDecorationLine: "line-through",
    color: Colors.textSecondary,
  },
  exerciseDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  restBadge: {
    backgroundColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  restText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: "Inter_500Medium",
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginBottom: 20,
  },
  startWorkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
  },
  startWorkoutText: {
    fontSize: 16,
    color: Colors.background,
    fontFamily: "Inter_700Bold",
  },
});
