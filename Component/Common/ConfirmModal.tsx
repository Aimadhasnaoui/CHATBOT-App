import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Modal,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  iconName?: keyof typeof Feather.glyphMap;
  onConfirm: () => void;
  onCancel: () => void;
  /** Set to true if rendered inside another Modal to prevent React Native nested Modal issues */
  useOverlay?: boolean;
};

const ConfirmModal = ({
  visible,
  title,
  message,
  confirmText = "Supprimer",
  cancelText = "Annuler",
  type = "danger",
  iconName = "trash-2",
  onConfirm,
  onCancel,
  useOverlay = true,
}: ConfirmModalProps) => {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 45,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const getThemeColors = () => {
    switch (type) {
      case "danger":
        return {
          iconBg: "#FEE2E2",
          iconBorder: "#FEF2F2",
          iconColor: "#EF4444",
          confirmBtnBg: "#EF4444",
          confirmBtnShadow: "#EF4444",
        };
      case "warning":
        return {
          iconBg: "#FEF3C7",
          iconBorder: "#FFFBEB",
          iconColor: "#F59E0B",
          confirmBtnBg: "#F59E0B",
          confirmBtnShadow: "#F59E0B",
        };
      default:
        return {
          iconBg: "#DBEAFE",
          iconBorder: "#EFF6FF",
          iconColor: "#2563EB",
          confirmBtnBg: "#2563EB",
          confirmBtnShadow: "#2563EB",
        };
    }
  };

  const theme = getThemeColors();

  const content = (
    <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
      <Pressable style={styles.backdropPressable} onPress={onCancel} />
      <Animated.View
        style={[
          styles.dialogCard,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.iconOuterRing, { borderColor: theme.iconBorder }]}>
          <View
            style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}
          >
            <Feather name={iconName} size={24} color={theme.iconColor} />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              {
                backgroundColor: theme.confirmBtnBg,
                shadowColor: theme.confirmBtnShadow,
              },
              pressed && styles.confirmButtonPressed,
            ]}
            onPress={onConfirm}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );

  if (useOverlay) {
    return content;
  }

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onCancel}
    >
      {content}
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    paddingHorizontal: 24,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFill,
  },
  dialogCard: {
    width: "100%",
    maxWidth: 330,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  iconOuterRing: {
    padding: 6,
    borderRadius: 100,
    borderWidth: 6,
    marginBottom: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonPressed: {
    backgroundColor: "#E2E8F0",
  },
  cancelButtonText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonPressed: {
    opacity: 0.88,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
