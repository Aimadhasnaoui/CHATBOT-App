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
import { useQueryClient } from "@tanstack/react-query";
import { useAppData } from "../Data/Appcontext";
import {
  SendMesage,
  describeNetworkError,
  type NetworkFailure,
} from "../../Servises/Conversation";
import NetworkAlert from "../Common/NetworkAlert";

/** Message en échec, conservé pour pouvoir le renvoyer. */
type PendingRetry = { failure: NetworkFailure; text: string; index: number };

const BottomBar = () => {
  const { conversation, setconversation, setConversationSart,setcoversationId,coversationId} = useAppData();
  const [Text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [retry, setRetry] = useState<PendingRetry | null>(null);
  const queryClient = useQueryClient();

  /** Envoie le message et réconcilie la bulle à l'index donné. Réutilisé par « Réessayer ». */
  const deliver = async (userText: string, index: number) => {
    setSending(true);
    setRetry(null); // masque la bannière le temps de la tentative

    // Remet la bulle en chargement (utile lors d'un réessai).
    setconversation((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, loadingResponse: true } : item,
      ),
    );

    try {
      const data = await SendMesage({ message: userText, conversationId: coversationId });
      setconversation((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                response: data.response,
                loadingResponse: false,
                repondeAt: data.repondeAt,
                lang: data.lang,
              }
            : item,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["historique"] });
      setcoversationId(data?.conversationId);
    } catch (err) {
      const failure = describeNetworkError(err);

      setconversation((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, response: failure.message, loadingResponse: false }
            : item,
        ),
      );
      // La bannière reste affichée et garde de quoi renvoyer le message.
      setRetry({ failure, text: userText, index });
    } finally {
      // Réactive le bouton, que la requête ait réussi ou échoué.
      setSending(false);
    }
  };

  const SEND = async () => {
    const userText = Text.trim();
    // Empêche un second envoi tant que la réponse n'est pas revenue.
    if (!userText || sending) return;

    setText("");
    setConversationSart(true);
    Keyboard.dismiss();

    const index = conversation.length;
    setconversation((prev) => [
      ...prev,
      { message: userText, response: "", loadingResponse: true },
    ]);

    await deliver(userText, index);
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
          onRetry={() => deliver(retry.text, retry.index)}
          onDismiss={() => setRetry(null)}
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
