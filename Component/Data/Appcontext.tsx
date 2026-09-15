import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

import { ChartData } from "../../Servises/Conversation";

export type MenuOption = { topic: string; label: string };

export type conversationType = {
  /** Vide pour un message d'accueil du bot, sans bulle utilisateur. */
  message: string;
  response: string;
  loadingResponse: boolean;
  createdAt?: string;
  /** Langue détectée de l'échange — sert à aligner l'arabe à droite. */
  lang?: "fr" | "en" | "ar";
  /** Options proposées par le bot pour guider la conversation. */
  menu?: MenuOption[];
  chartData?: ChartData;
};

type AppContextType = {
  ConversationSart: boolean;
  setConversationSart: Dispatch<SetStateAction<boolean>>;
  conversation: conversationType[];
  setconversation: Dispatch<SetStateAction<conversationType[]>>;
  coversationId: string | undefined;
  setcoversationId: Dispatch<SetStateAction<string | undefined>>;
  stationModalVisible: boolean;
  setStationModalVisible: Dispatch<SetStateAction<boolean>>;
};

const Data = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ConversationSart, setConversationSart] = useState<boolean>(false);
  const [conversation, setconversation] = useState<conversationType[]>([]);
  const [coversationId, setcoversationId] = useState<string | undefined>(undefined);
  const [stationModalVisible, setStationModalVisible] = useState<boolean>(false);

  return (
    <Data.Provider
      value={{
        ConversationSart,
        setConversationSart,
        conversation,
        setconversation,
        coversationId,
        setcoversationId,
        stationModalVisible,
        setStationModalVisible,
      }}
    >
      {children}
    </Data.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(Data);
  if (!context) {
    throw new Error("useAppData must be used inside an AppProvider");
  }
  return context;
};
