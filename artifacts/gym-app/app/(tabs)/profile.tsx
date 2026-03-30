import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const MEMBERSHIP_TIERS = [
  { name: "Basic", price: "$29/mo", color: "#A0A0A0", features: ["Access to gym", "2 classes/week", "Locker"] },
  { name: "Pro", price: "$59/mo", color: Colors.gold, features: ["Unlimited classes", "Personal trainer 2x/mo", "Nutrition tips", "App analytics"] },
  { name: "Elite", price: "$99/mo", color: "#8B5CF6", features: ["Everything in Pro", "Daily PT sessions", "Meal planning", "VIP lounge", "Priority booking"] },
];

const CURRENT_TIER = "Elite";

type SettingRow = {
  icon: string;
  label: string;
  type: "arrow" | "toggle" | "destructive";
  value?: boolean;
};

const SETTINGS: { section: string; items: SettingRow[] }[] = [
  {
    section: "Preferences",
    items: [
      { icon: "notifications-outline", label: "Push Notifications", type: "toggle", value: true },
      { icon: "moon-outline", label: "Dark Mode", type: "toggle", value: true },
      { icon: "fitness-outline", label: "Workout Reminders", type: "toggle", value: false },
    ],
  },
  {
    section: "Account",
    items: [
      { icon: "person-outline", label: "Edit Profile", type: "arrow" },
      { icon: "lock-closed-outline", label: "Change Password", type: "arrow" },
      { icon: "card-outline", label: "Payment Methods", type: "arrow" },
      { icon: "receipt-outline", label: "Billing History", type: "arrow" },
    ],
  },
  {
    section: "Support",
    items: [
      { icon: "help-circle-outline", label: "Help Center", type: "arrow" },
      { icon: "chatbubble-outline", label: "Contact Support", type: "arrow" },
      { icon: "star-outline", label: "Rate the App", type: "arrow" },
    ],
  },
  {
    section: "",
    items: [
      { icon: "log-out-outline", label: "Sign Out", type: "destructive" },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Push Notifications": true,
    "Dark Mode": true,
    "Workout Reminders": false,
  });

  function handleToggle(label: string, val: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setToggles((prev) => ({ ...prev, [label]: val }));
  }

  function handlePress(label: string, type: SettingRow["type"]) {
    if (type === "arrow") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (type === "destructive") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Sign Out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => {} },
      ]);
    }
  }

  const currentTierData = MEMBERSHIP_TIERS.find((t) => t.name === CURRENT_TIER)!;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={36} color={Colors.gold} />
            </View>
            <View style={[styles.tierBadge, { backgroundColor: currentTierData.color + "33", borderColor: currentTierData.color }]}>
              <MaterialCommunityIcons name="crown" size={10} color={currentTierData.color} />
              <Text style={[styles.tierBadgeText, { color: currentTierData.color }]}>{CURRENT_TIER}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Elite Member</Text>
            <Text style={styles.profileEmail}>member@elitefitness.com</Text>
            <Text style={styles.profileSince}>Member since January 2024</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Membership Plan</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiersScroll} contentContainerStyle={styles.tiersContent}>
          {MEMBERSHIP_TIERS.map((tier) => {
            const isActive = tier.name === CURRENT_TIER;
            return (
              <Pressable
                key={tier.name}
                style={[styles.tierCard, isActive && { borderColor: tier.color, borderWidth: 2 }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (!isActive) Alert.alert(`Upgrade to ${tier.name}`, `Switch to ${tier.name} at ${tier.price}?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Upgrade", onPress: () => {} },
                  ]);
                }}
              >
                <View style={styles.tierHeader}>
                  <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
                  {isActive && (
                    <View style={[styles.activePill, { backgroundColor: tier.color + "22" }]}>
                      <Text style={[styles.activePillText, { color: tier.color }]}>Active</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.tierPrice}>{tier.price}</Text>
                {tier.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={14} color={tier.color} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </Pressable>
            );
          })}
        </ScrollView>

        {SETTINGS.map((section) => (
          <View key={section.section}>
            {section.section !== "" && (
              <Text style={styles.sectionTitle}>{section.section}</Text>
            )}
            <View style={styles.settingsCard}>
              {section.items.map((item, i) => (
                <View key={item.label}>
                  <Pressable
                    style={styles.settingRow}
                    onPress={() => handlePress(item.label, item.type)}
                    disabled={item.type === "toggle"}
                  >
                    <View style={[styles.settingIcon, item.type === "destructive" && styles.settingIconDestructive]}>
                      <Ionicons
                        name={item.icon as any}
                        size={18}
                        color={item.type === "destructive" ? Colors.error : Colors.gold}
                      />
                    </View>
                    <Text style={[styles.settingLabel, item.type === "destructive" && { color: Colors.error }]}>
                      {item.label}
                    </Text>
                    {item.type === "toggle" && (
                      <Switch
                        value={toggles[item.label] ?? false}
                        onValueChange={(val) => handleToggle(item.label, val)}
                        trackColor={{ false: Colors.border, true: Colors.gold + "88" }}
                        thumbColor={toggles[item.label] ? Colors.gold : Colors.textMuted}
                      />
                    )}
                    {item.type === "arrow" && (
                      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    )}
                  </Pressable>
                  {i < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.version}>Elite Fitness v1.0.0</Text>
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
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  avatarWrap: {
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.borderGold,
    alignItems: "center",
    justifyContent: "center",
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  tierBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    fontSize: 20,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  profileSince: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  tiersScroll: {
    marginHorizontal: -20,
  },
  tiersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tierCard: {
    width: 180,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tierHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tierName: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  activePill: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activePillText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  tierPrice: {
    fontSize: 22,
    color: Colors.text,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.borderGold,
    alignItems: "center",
    justifyContent: "center",
  },
  settingIconDestructive: {
    backgroundColor: Colors.error + "22",
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontFamily: "Inter_500Medium",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 62,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
    marginBottom: 8,
  },
});
