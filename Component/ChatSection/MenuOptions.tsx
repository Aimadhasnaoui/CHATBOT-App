import { StyleSheet, Text, View, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";

type Option = { topic: string; label: string };

type MenuOptionsProps = {
  options: Option[];
  onSelect: (userText: string, topic?: string) => void;
  disabled?: boolean;
};

const MenuOptions = ({ options, onSelect, disabled }: MenuOptionsProps) => {
  if (options.length === 0) return null;

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option.topic}
          style={({ pressed }) => [
            styles.option,
            pressed && styles.optionPressed,
            disabled && styles.optionDisabled,
          ]}
          onPress={() => onSelect(option.label || option.topic, option.topic)}
          disabled={disabled}
        >
          <Text style={styles.optionText}>{option.label}</Text>
          <Feather name="arrow-up-right" size={14} color="#2E7D32" />
        </Pressable>
      ))}
    </View>
  );
};

export default MenuOptions;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  optionPressed: {
    backgroundColor: "#DCFCE7",
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#166534",
  },
});
