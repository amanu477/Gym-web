import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

const GYM_STATS = [
  { label: "Members", value: "2,400+", icon: "people" as const },
  { label: "Classes/Week", value: "120", icon: "calendar" as const },
  { label: "Expert Trainers", value: "18", icon: "medal" as const },
];

const QUICK_ACTIONS = [
  { label: "Book Class", icon: "calendar-outline" as const, route: "/(tabs)/schedule" },
  { label: "Track Progress", icon: "trending-up-outline" as const, route: "/(tabs)/progress" },
  { label: "My Profile", icon: "person-outline" as const, route: "/(tabs)/profile" },
];

const FEATURED_CLASSES = [
  { name: "Power Lifting", trainer: "Alex Rodriguez", time: "7:00 AM", spots: 3, tag: "POPULAR" },
  { name: "HIIT Inferno", trainer: "Sarah Chen", time: "9:30 AM", spots: 8, tag: "INTENSE" },
  { name: "Yoga Flow", trainer: "Maya Patel", time: "11:00 AM", spots: 12, tag: "BEGINNER" },
];

function AnimatedPressable({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: object;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPressIn={() => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

function FeaturedClassCard({ item }: { item: (typeof FEATURED_CLASSES)[0] }) {
  const scale = useRef(new Animated.Value(1)).current;

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
        router.push("/(tabs)/schedule");
      }}
    >
      <Animated.View style={[styles.classCard, { transform: [{ scale }] }]}>
        <View style={styles.classTagRow}>
          <View style={styles.classTag}>
            <Text style={styles.classTagText}>{item.tag}</Text>
          </View>
          <Text style={styles.classSpots}>{item.spots} spots left</Text>
        </View>
        <Text style={styles.className}>{item.name}</Text>
        <View style={styles.classInfo}>
          <Ionicons name="person-outline" size={12} color={Colors.textSecondary} />
          <Text style={styles.classInfoText}>{item.trainer}</Text>
          <Ionicons name="time-outline" size={12} color={Colors.textSecondary} style={{ marginLeft: 8 }} />
          <Text style={styles.classInfoText}>{item.time}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: topPad + 16 }]}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.memberName}>Elite Member</Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            style={styles.avatarBtn}
          >
            <Ionicons name="person" size={22} color={Colors.gold} />
          </Pressable>
        </View>

        <View style={styles.membershipBanner}>
          <View style={styles.membershipLeft}>
            <Text style={styles.membershipLabel}>MEMBERSHIP</Text>
            <Text style={styles.membershipTier}>ELITE PLAN</Text>
          </View>
          <View style={styles.membershipRight}>
            <Text style={styles.membershipExpiry}>Valid until</Text>
            <Text style={styles.membershipDate}>Dec 31, 2025</Text>
          </View>
          <MaterialCommunityIcons
            name="crown"
            size={28}
            color={Colors.gold}
            style={styles.crownIcon}
          />
        </View>

        <View style={styles.statsRow}>
          {GYM_STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Ionicons name={stat.icon} size={20} color={Colors.gold} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <AnimatedPressable
              key={action.label}
              onPress={() => router.push(action.route as any)}
              style={styles.actionBtn}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={22} color={Colors.gold} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </AnimatedPressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          <Pressable onPress={() => router.push("/(tabs)/schedule")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.classesScroll}
        >
          {FEATURED_CLASSES.map((cls) => (
            <FeaturedClassCard key={cls.name} item={cls} />
          ))}
        </ScrollView>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationQuote}>
            "The only bad workout is the one that didn't happen."
          </Text>
          <Text style={styles.motivationSub}>Today's Motivation</Text>
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
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  memberName: {
    fontSize: 24,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignItems: "center",
    justifyContent: "center",
  },
  membershipBanner: {
    marginHorizontal: 20,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderGold,
    marginBottom: 24,
    overflow: "hidden",
  },
  membershipLeft: {},
  membershipRight: {
    alignItems: "flex-end",
  },
  membershipLabel: {
    fontSize: 10,
    color: Colors.gold,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
  },
  membershipTier: {
    fontSize: 20,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  membershipExpiry: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  membershipDate: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "Inter_600SemiBold",
    marginTop: 2,
  },
  crownIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    opacity: 0.3,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
    marginHorizontal: 20,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.gold,
    fontFamily: "Inter_500Medium",
  },
  actionsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 28,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.borderGold,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  classesScroll: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
    marginBottom: 24,
  },
  classCard: {
    width: width * 0.55,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  classTagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classTag: {
    backgroundColor: Colors.borderGold,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  classTagText: {
    fontSize: 10,
    color: Colors.gold,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  classSpots: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  className: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  classInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  classInfoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  motivationCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    marginBottom: 8,
  },
  motivationQuote: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: "Inter_500Medium",
    lineHeight: 22,
    fontStyle: "italic",
  },
  motivationSub: {
    fontSize: 12,
    color: Colors.gold,
    fontFamily: "Inter_600SemiBold",
    marginTop: 10,
    letterSpacing: 1,
  },
});
