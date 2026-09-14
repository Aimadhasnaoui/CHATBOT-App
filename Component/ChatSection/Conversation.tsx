import {
  StyleSheet,
  Text,
  View,
  Animated,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ReactNode, useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppData } from "../Data/Appcontext";
import ResponseLoading from "./ResponseLoading";
import MenuOptions from "./MenuOptions";
import { useSendMessage } from "./useSendMessage";
import { ResponseDateDisplay } from "../utilis/utilis";
type AnimatedEntryProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
};
const AnimatedEntry = ({ children, style, delay = 0 }: AnimatedEntryProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 320,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const BotHeader = ({
  repondeAt,
  rtl,
}: {
  repondeAt?: string;
  rtl?: boolean;
}) => (
  <View style={[styles.botHeader, rtl && styles.botHeaderRtl]}>
    <Ionicons name="water" size={15} color="#2563EB" />
    <Text style={styles.botName}>AgroBot Automate</Text>
    <Text style={styles.botTime}>
      {repondeAt ? ResponseDateDisplay(repondeAt) : "À l'instant"}
    </Text>
  </View>
);

const Conversation = () => {
  const { conversation } = useAppData();
  const { send, sending } = useSendMessage();
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {conversation.map((item, index) => (
        <View key={index} style={styles.exchange}>
          {item.message !== "" && (
            <AnimatedEntry style={styles.userBubble}>
              <Text style={styles.userLabel}>Vous</Text>
              <Text style={styles.userMessage}>{item.message}</Text>
            </AnimatedEntry>
          )}

          <AnimatedEntry style={styles.botCard} delay={150}>
            <BotHeader repondeAt={item.createdAt} rtl={item.lang === "ar"} />

            {item.loadingResponse ? (
              <ResponseLoading />
            ) : (
              <>
                <Text
                  style={[
                    styles.botResponse,
                    item.lang === "ar" && styles.botResponseRtl,
                  ]}
                >
                  {item.response}
                </Text>
                {item.menu && (
                  <MenuOptions
                    options={item.menu}
                    onSelect={send}
                    disabled={sending}
                  />
                )}
              </>
            )}
          </AnimatedEntry>
        </View>
      ))}
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    gap: 22,
  },
  exchange: {
    gap: 12,
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "88%",
    backgroundColor: "#2E7D32",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 6,
  },
  userLabel: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    textAlign: "right",
    textTransform: "uppercase",
  },
  userMessage: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
  },
  botCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  botHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  botName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0F172A",
  },
  botTime: {
    fontSize: 12,
    color: "#94A3B8",
  },
  botResponse: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },
  // L'arabe s'écrit de droite à gauche : on aligne le texte et on inverse
  // l'ordre de l'en-tête (icône + nom + heure) pour rester cohérent.
  botResponseRtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  botHeaderRtl: {
    flexDirection: "row-reverse",
  },
});
