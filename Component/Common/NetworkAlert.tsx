import { StyleSheet, Text, View, Pressable, Animated } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef } from "react";

type Props = {
  title: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  /** Libellé du bouton d'action (par défaut « Réessayer »). */
  retryLabel?: string;
  /** Désactive le bouton pendant qu'un réessai est en cours. */
  busy?: boolean;
};

const NetworkAlert = ({
  title,
  message,
  onRetry,
  onDismiss,
  retryLabel = "Réessayer",
  busy = false,
}: Props) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.iconBadge}>
        <Feather name="wifi-off" size={16} color="#FFFFFF" />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <View style={styles.actions}>
        {onRetry && (
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
              busy && styles.retryButtonDisabled,
            ]}
            onPress={onRetry}
            disabled={busy}
          >
            <Text style={styles.retryLabel}>
              {busy ? "..." : retryLabel}
            </Text>
          </Pressable>
        )}

        {onDismiss && (
          <Pressable
            style={styles.dismissButton}
            onPress={onDismiss}
            hitSlop={8}
          >
            <Feather name="x" size={14} color="#4A6F57" />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

export default NetworkAlert;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    // flexShrink permet au texte de passer à la ligne au lieu de
    // pousser le bouton hors de l'écran sur les petits téléphones.
    flex: 1,
    flexShrink: 1,
    gap: 3,
  },
  title: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#14532D",
    lineHeight: 19,
  },
  message: {
    fontSize: 12.5,
    color: "#4A6F57",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  retryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  retryButtonPressed: {
    backgroundColor: "#DCFCE7",
  },
  retryButtonDisabled: {
    opacity: 0.5,
  },
  retryLabel: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#2E7D32",
  },
  dismissButton: {
    padding: 4,
  },
});
