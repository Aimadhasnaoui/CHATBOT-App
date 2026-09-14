import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppData } from "../Data/Appcontext";
import {
  SendMesage,
  describeNetworkError,
  type NetworkFailure,
} from "../../Servises/Conversation";

/** Message en échec, conservé pour pouvoir le renvoyer. */
export type PendingRetry = { failure: NetworkFailure; text: string; index: number };

/** Logique d'envoi partagée entre le champ de saisie et les options de menu
 * tapées : les deux doivent réconcilier la même bulle et gérer le même
 * réessai en cas d'échec réseau. */
export const useSendMessage = () => {
  const { conversation, setconversation, setConversationSart, setcoversationId, coversationId } =
    useAppData();
  const [sending, setSending] = useState(false);
  const [retry, setRetry] = useState<PendingRetry | null>(null);
  const queryClient = useQueryClient();

  const deliver = async (userText: string, index: number) => {
    setSending(true);
    setRetry(null); // masque la bannière le temps de la tentative

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
                createdAt: data.repondeAt,
                lang: data.lang,
                menu: data.action?.options,
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
      setRetry({ failure, text: userText, index });
    } finally {
      setSending(false);
    }
  };

  const send = async (userText: string) => {
    const text = userText.trim();
    if (!text || sending) return;

    setConversationSart(true);

    const index = conversation.length;
    setconversation((prev) => [
      ...prev,
      { message: text, response: "", loadingResponse: true },
    ]);

    await deliver(text, index);
  };

  return {
    send,
    retryDeliver: deliver,
    sending,
    retry,
    clearRetry: () => setRetry(null),
  };
};
