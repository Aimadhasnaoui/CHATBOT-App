import { StyleSheet, ScrollView } from "react-native";
import { useRef } from "react";
import WelcomPage from "./WelcomPage";
import { useAppData } from "../Data/Appcontext";
import Conversation from "./Conversation";

const ChatPage = () => {
  const { ConversationSart } = useAppData();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.wrapper}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
    >
      {ConversationSart ? <Conversation /> : <WelcomPage />}
    </ScrollView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
