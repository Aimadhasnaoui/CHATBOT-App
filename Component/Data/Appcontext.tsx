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
};

type AppContextType = {
  ConversationSart: boolean;
  setConversationSart: Dispatch<SetStateAction<boolean>>;
  conversation: conversationType[];
  setconversation: Dispatch<SetStateAction<conversationType[]>>;
};

const Data = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ConversationSart, setConversationSart] = useState<boolean>(false);
  const [conversation, setconversation] = useState<conversationType[]>([]);

  return (
    <Data.Provider
      value={{
        ConversationSart,
        setConversationSart,
        conversation,
        setconversation,
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
