import axios from "axios";
import { Lang } from "./Conversation";
import {API_URL} from '../config/Env.config'

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
    `${API_URL}/Conversation`,
    { timeout: 15000 },
  );
  return res.data;
};
export const GetConversationsById = async (
  id: string,
): Promise<ConversationType> => {
  const res = await axios.get<ConversationType>(
    `${API_URL}/Conversation/${id}`,
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
    `${API_URL}/Conversation/${id}`,
    { Title },
    { timeout: 15000 },
  );
  return res.data;
};

export const DeleteConversation = async (id: string) => {
  const res = await axios.delete(
    `${API_URL}/Conversation/${id}`,
    { timeout: 15000 },
  );
  return res.data;
};

export type MenuItem = { descepretion: string; topic: string };

export type CreateConversationResponse = {
  message: string;
  conversationId: string;
  menu: MenuItem[];
  response: string;
};

export const CreatNewConversation = async (): Promise<CreateConversationResponse> => {
  const res = await axios.post<CreateConversationResponse>(
    `${API_URL}/Conversation`,
    {},
    { timeout: 15000 },
  );
  return res.data;
};