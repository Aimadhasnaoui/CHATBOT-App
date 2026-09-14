import axios from "axios";


type sendData = {
  message: string;
  conversationId: string | undefined
};

export type Lang = "fr" | "en" | "ar";

export type MenuOption = { topic: string; label: string };

export type ChatResponse = {
  response: string;
  lang?: Lang;
  repondeAt: string;
  conversationId: string;
  /** Présent quand le bot propose un menu d'options à sélectionner. */
  action?: { label: string; options: MenuOption[] };
};

export type NetworkFailure = {
  /** offline = rien n'a pu partir · timeout = parti mais pas de réponse à temps · server = le serveur a répondu une erreur */
  kind: "offline" | "timeout" | "server";
  title: string;
  message: string;
};

/**
 * Traduit une erreur axios en message lisible.
 * axios ne distingue pas "pas de réseau" de "serveur injoignable" : dans les
 * deux cas il n'y a pas de `response`, d'où le message qui couvre les deux.
 */
export const describeNetworkError = (error: unknown): NetworkFailure => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return {
        kind: "timeout",
        title: "Délai dépassé",
        message:
          "Le serveur met trop de temps à répondre. Vérifiez votre connexion et réessayez.",
      };
    }

    if (!error.response) {
      return {
        kind: "offline",
        title: "Pas de connexion",
        message:
          "Impossible de joindre le serveur. Vérifiez que vous êtes connecté au réseau et réessayez.",
      };
    }

    return {
      kind: "server",
      title: "Erreur du serveur",
      message: `Le serveur a renvoyé une erreur (${error.response.status}). Réessayez dans un instant.`,
    };
  }

  return {
    kind: "server",
    title: "Erreur",
    message: "Une erreur inattendue s'est produite. Réessayez.",
  };
};

export const SendMesage = async (data: sendData): Promise<ChatResponse> => {
  const res = await axios.post<ChatResponse>(
    `http://192.168.20.10:3000/exchange`,
    data,
    // Sans timeout, axios attend indéfiniment et l'utilisateur reste
    // bloqué sur les points de chargement.
    { timeout: 15000 },
  );
  return res.data;
};

