import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

export type conversationType = {
  message: string;
  response: string;
  loadingResponse: boolean;
  createdAt?: string;
  /** Langue détectée de l'échange — sert à aligner l'arabe à droite. */
  lang?: "fr" | "en" | "ar";
};

type AppContextType = {
  ConversationSart: boolean;
  setConversationSart: Dispatch<SetStateAction<boolean>>;
  conversation: conversationType[];
  setconversation: Dispatch<SetStateAction<conversationType[]>>;
  coversationId:string | undefined,
  setcoversationId:Dispatch<SetStateAction<string | undefined>>
};

const Data = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ConversationSart, setConversationSart] = useState<boolean>(false);
  const [conversation, setconversation] = useState<conversationType[]>([]);
  const [coversationId,setcoversationId] = useState<string | undefined>(undefined)

  return (
    <Data.Provider
      value={{
        ConversationSart,
        setConversationSart,
        conversation,
        setconversation,
        coversationId,
        setcoversationId,
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
