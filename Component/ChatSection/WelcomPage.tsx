import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import Logo from "../../assets/Symbol.svg";
import { useAppData } from "../Data/Appcontext";
import { CreatNewConversation } from "../../Servises/Historique";
import { describeNetworkError } from "../../Servises/Conversation";

type Suggestion = {
  id: string;
  label: string;
  iconColor: string;
  iconBackground: string;
} & (
  | { iconSet: "feather"; iconName: React.ComponentProps<typeof Feather>["name"] }
  | { iconSet: "ionicons"; iconName: React.ComponentProps<typeof Ionicons>["name"] }
);

const suggestions: Suggestion[] = [
  {
    id: "hydric-status",
    label: "Statut hydrique du maïs sur le Pivot 2",
    iconSet: "feather",
    iconName: "droplet",
    iconColor: "#2563EB",
    iconBackground: "#DBEAFE",
  },
  {
    id: "stress-alerts",
    label: "Alertes & seuils de stress hydrique",
    iconSet: "feather",
    iconName: "alert-triangle",
    iconColor: "#D97706",
    iconBackground: "#FEF3C7",
  },
  {
    id: "watering-plan",
    label: "Préconisations de tour d'eau du jour",
    iconSet: "feather",
    iconName: "check-circle",
    iconColor: "#2E7D32",
    iconBackground: "#DCFCE7",
  },
  {
    id: "evapotranspiration",
    label: "Bilan évapotranspiration (ETO)",
    iconSet: "ionicons",
    iconName: "leaf-outline",
    iconColor: "#0D9488",
    iconBackground: "#CCFBF1",
  },
];

const ChatPage = () => {
  const { setConversationSart, setconversation, setcoversationId } = useAppData();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (starting) return;
    setStarting(true);
    setError(null);

    try {
      const data = await CreatNewConversation();
      setcoversationId(data.conversationId);
      setconversation([
        {
          message: "",
          response: data.response,
          loadingResponse: false,
          menu: data.menu.map((item) => ({ topic: item.topic, label: item.descepretion })),
        },
      ]);
      setConversationSart(true);
    } catch (err) {
      setError(describeNetworkError(err).message);
    } finally {
      setStarting(false);
    }
  };

  return (
    <ScrollView
      style={styles.wrapper}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.ContainerlogoImage}>
          <Logo width={40} height={40} />
        </View>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            • En direct
          </Text>
        </View>

        <Text style={styles.greeting}>Bonjour Aimad 👋</Text>
        <Text style={styles.TextStyle}>
          Comment puis-je optimiser votre arrosage aujourd'hui ? Cliquez sur
          « Démarrer Conversation » ou écrivez directement votre message
          ci-dessous.
        </Text>
        <Pressable
          style={[styles.buttonDemarrer, starting && styles.buttonDemarrerDisabled]}
          onPress={handleStart}
          disabled={starting}
        >
          {starting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.DemarrerText}>
            Démarrer Conversation
            </Text>
          )}
        </Pressable>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* <View style={styles.suggestionsSection}>
        <Text style={styles.sectionLabel}>Questions fréquentes</Text>

        {suggestions.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.suggestionCard,
              pressed && styles.suggestionCardPressed,
            ]}
          >
            <View
              style={[
                styles.suggestionIcon,
                { backgroundColor: item.iconBackground },
              ]}
            >
              {item.iconSet === "feather" ? (
                <Feather name={item.iconName} size={16} color={item.iconColor} />
              ) : (
                <Ionicons name={item.iconName} size={16} color={item.iconColor} />
              )}
            </View>
            <Text style={styles.suggestionText}>{item.label}</Text>
            <Feather name="arrow-up-right" size={16} color="#94A3B8" />
          </Pressable>
        ))}
      </View> */}
    </ScrollView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  hero: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ContainerlogoImage: {
    backgroundColor: "rgba(46, 125, 50, 0.1)",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2e7d3220",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2E7D32",
  },
  statusText: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "600",
  },
  greeting: {
    fontSize: 28,
    color: "#334155",
    fontWeight: "bold",
  },
  TextStyle: {
    textAlign: "center",
    color: "#475569",
    paddingHorizontal: 10,
  },
  suggestionsSection: {
    marginTop: 24,
    gap: 10,
  },
  sectionLabel: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  suggestionCardPressed: {
    backgroundColor: "#F8FAFC",
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  buttonDemarrer:{
    backgroundColor: "#2E7D32",
      flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal:16,
    marginBottom: 20,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  DemarrerText:{
     color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  buttonDemarrerDisabled: {
    opacity: 0.7,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
