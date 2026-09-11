import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UpperBar from "./Bars/UpperBar";
import BottomBar from "./Bars/BottomBar";
import ChatPage from "./ChatSection/ChatPage";

function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <UpperBar />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ChatPage></ChatPage>
        <BottomBar />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e2e8f080",
    paddingLeft: 20,
    paddingRight: 20,
  },
  keyboardAvoiding: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
export default HomePage;
