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
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

type Trainer = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  bio: string;
  certifications: string[];
  availableSlots: number;
  imageInitial: string;
};

const TRAINERS: Trainer[] = [
  {
    id: "1",
    name: "Alex Rodriguez",
    specialty: "Strength & Conditioning",
    experience: 8,
    rating: 4.9,
    bio: "Former professional athlete turned elite fitness coach. Specializes in powerlifting and Olympic weightlifting techniques.",
    certifications: ["NSCA-CSCS", "USAW Level 2"],
    availableSlots: 3,
    imageInitial: "AR",
  },
  {
    id: "2",
    name: "Sarah Chen",
    specialty: "HIIT & Cardio",
    experience: 6,
    rating: 4.8,
    bio: "High-energy trainer focused on metabolic conditioning and fat loss. Known for her intense but fun workout sessions.",
    certifications: ["ACE-CPT", "Precision Nutrition"],
    availableSlots: 5,
    imageInitial: "SC",
  },
  {
    id: "3",
    name: "Maya Patel",
    specialty: "Yoga & Flexibility",
    experience: 10,
    rating: 5.0,
    bio: "Certified yoga instructor with a background in physical therapy. Helps clients improve mobility and reduce injury risk.",
    certifications: ["RYT-500", "PTA"],
    availableSlots: 2,
    imageInitial: "MP",
  },
  {
    id: "4",
    name: "Marcus Johnson",
    specialty: "Boxing & MMA",
    experience: 12,
    rating: 4.7,
    bio: "Former competitive boxer bringing combat sports training to fitness. Great for stress relief and full-body conditioning.",
    certifications: ["USA Boxing", "NASM-CPT"],
    availableSlots: 4,
    imageInitial: "MJ",
  },
  {
    id: "5",
    name: "Emma Wilson",
    specialty: "Pilates & Core",
    experience: 7,
    rating: 4.9,
    bio: "Pilates expert focusing on core strength and postural alignment. Perfect for rehabilitation and injury prevention.",
    certifications: ["Balanced Body", "STOTT Pilates"],
    availableSlots: 6,
    imageInitial: "EW",
  },
  {
    id: "6",
    name: "Mark Davis",
    specialty: "Cycling & Endurance",
    experience: 9,
    rating: 4.6,
    bio: "Certified spinning instructor and endurance coach. Specializes in cardiovascular health and stamina building.",
    certifications: ["Spinning", "ACSM-EP"],
    availableSlots: 8,
    imageInitial: "MD",
  },
];

const SPECIALTY_COLORS: Record<string, string> = {
  "Strength & Conditioning": "#EF4444",
  "HIIT & Cardio": "#F59E0B",
  "Yoga & Flexibility": "#8B5CF6",
  "Boxing & MMA": "#EC4899",
  "Pilates & Core": "#06B6D4",
  "Cycling & Endurance": "#22C55E",
};

function TrainerCard({
  trainer,
  onBook,
}: {
  trainer: Trainer;
  onBook: (trainer: Trainer) => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const color = SPECIALTY_COLORS[trainer.specialty] ?? Colors.gold;

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
        onBook(trainer);
      }}
    >
      <Animated.View style={[styles.trainerCard, { transform: [{ scale }] }]}>
        <View style={styles.trainerHeader}>
          <View style={[styles.avatar, { borderColor: color }]}>
            <Text style={[styles.avatarText, { color }]}>{trainer.imageInitial}</Text>
          </View>
          <View style={styles.trainerInfo}>
            <Text style={styles.trainerName}>{trainer.name}</Text>
            <View style={[styles.specialtyBadge, { backgroundColor: color + "22" }]}>
              <Text style={[styles.specialtyText, { color }]}>{trainer.specialty}</Text>
            </View>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={Colors.gold} />
            <Text style={styles.ratingText}>{trainer.rating}</Text>
          </View>
        </View>

        <Text style={styles.trainerBio} numberOfLines={2}>
          {trainer.bio}
        </Text>

        <View style={styles.trainerStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.statText}>{trainer.experience} yrs exp</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="ribbon-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.statText}>{trainer.certifications[0]}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors.success} />
            <Text style={[styles.statText, { color: Colors.success }]}>
              {trainer.availableSlots} slots
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Pressable
            style={styles.bookBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onBook(trainer);
            }}
          >
            <Text style={styles.bookBtnText}>Book Session</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.background} />
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function TrainersScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrainers = TRAINERS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleBook(trainer: Trainer) {
    setSelectedTrainer(trainer);
  }

  function handleSendMessage() {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Request Sent!",
      `Your session request has been sent to ${selectedTrainer?.name}. They will contact you shortly.`
    );
    setSelectedTrainer(null);
    setMessage("");
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={styles.title}>Our Trainers</Text>
        <Text style={styles.subtitle}>Book a session with our experts</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search trainers..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredTrainers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <TrainerCard trainer={item} onBook={handleBook} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No trainers found</Text>
          </View>
        }
      />

      <Modal
        visible={selectedTrainer !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedTrainer(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Session</Text>
              <Pressable
                onPress={() => setSelectedTrainer(null)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={Colors.text} />
              </Pressable>
            </View>

            {selectedTrainer && (
              <>
                <View style={styles.modalTrainerInfo}>
                  <View
                    style={[
                      styles.modalAvatar,
                      {
                        borderColor:
                          SPECIALTY_COLORS[selectedTrainer.specialty] ?? Colors.gold,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalAvatarText,
                        {
                          color:
                            SPECIALTY_COLORS[selectedTrainer.specialty] ?? Colors.gold,
                        },
                      ]}
                    >
                      {selectedTrainer.imageInitial}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.modalTrainerName}>{selectedTrainer.name}</Text>
                    <Text style={styles.modalTrainerSpecialty}>
                      {selectedTrainer.specialty}
                    </Text>
                  </View>
                </View>

                <Text style={styles.inputLabel}>Message (optional)</Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Tell the trainer about your goals..."
                  placeholderTextColor={Colors.textMuted}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Pressable style={styles.submitBtn} onPress={handleSendMessage}>
                  <Text style={styles.submitBtnText}>Send Request</Text>
                </Pressable>
              </>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: Colors.text,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 20,
    gap: 16,
  },
  trainerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  trainerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  trainerInfo: {
    flex: 1,
    gap: 4,
  },
  trainerName: {
    fontSize: 17,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  specialtyBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  specialtyText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.borderGold,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 13,
    color: Colors.gold,
    fontFamily: "Inter_700Bold",
  },
  trainerBio: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  trainerStats: {
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
  cardFooter: {
    marginTop: 4,
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 12,
  },
  bookBtnText: {
    fontSize: 14,
    color: Colors.background,
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
    gap: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 20,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTrainerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 12,
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  modalAvatarText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  modalTrainerName: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  modalTrainerSpecialty: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  inputLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_500Medium",
  },
  messageInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    color: Colors.text,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    minHeight: 100,
  },
  submitBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitBtnText: {
    fontSize: 16,
    color: Colors.background,
    fontFamily: "Inter_700Bold",
  },
});
