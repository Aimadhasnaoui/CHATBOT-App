import axios from "axios";
import { Lang } from "./Conversation";

export type ExchangeType = {
  id: string;
  conversationId: string;
  message: string;
  response: string;
  topic: string | null;
  lang: Lang | null;
  matched: boolean;
  createdAt: string;
};

type ConversationType = {
  id: string;
  userId: string;
  startedAt: string;
  Title: string;
  exchanges: ExchangeType[]; // l'historique de la session
};
export const GetConversations = async (): Promise<ConversationType[]> => {
  const res = await axios.get<ConversationType[]>(
    `http://192.168.55.74:3000/Conversation`,
    { timeout: 15000 },
  );
  return res.data;
};
export const GetConversationsById = async (
  id: string,
): Promise<ConversationType> => {
  const res = await axios.get<ConversationType>(
    `http://192.168.55.74:3000/Conversation/${id}`,
    { timeout: 15000 },
  );
  return res.data;
};

export const UpdateConversation = async ({
  id,
  Title,
}: {
  id: string;
  Title: string;
}): Promise<{ message: string }> => {
  const res = await axios.put<{ message: string }>(
    `http://192.168.55.74:3000/Conversation/${id}`,
    { Title },
    { timeout: 15000 },
  );
  return res.data;
};

export const DeleteConversation = async (id: string) => {
  const res = await axios.delete(
    `http://192.168.55.74:3000/Conversation/${id}`,
    { timeout: 15000 },
  );
  return res.data;
};
