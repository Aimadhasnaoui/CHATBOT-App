import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { useSendMessage } from "../ChatSection/useSendMessage";
import NetworkAlert from "../Common/NetworkAlert";

const BottomBar = () => {
  const [Text, setText] = useState("");
  const { send, retryDeliver, sending, retry, clearRetry } = useSendMessage();

  const SEND = async () => {
    const userText = Text;
    setText("");
    Keyboard.dismiss();
    await send(userText);
  };

  // Bouton inactif pendant l'envoi ou quand le champ est vide.
  const disabled = sending || Text.trim() === "";

  return (
    <View style={styles.container}>
      {retry && (
        <NetworkAlert
          title={retry.failure.title}
          message={retry.failure.message}
          busy={sending}
          onRetry={() => retryDeliver(retry.text, retry.index)}
          onDismiss={clearRetry}
        />
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Ecrivez votre message ici ..."
          multiline
          textAlignVertical="top"
          value={Text}
          onChangeText={setText}
        ></TextInput>
        <Pressable
          style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
          onPress={SEND}
          disabled={disabled}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Feather name="arrow-up" size={18} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 24,
    paddingLeft: 15,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 9,
    maxHeight: 120,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#A7C3A8",
  },
});
