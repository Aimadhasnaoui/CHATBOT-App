import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UpperBar from "./Bars/UpperBar";
import BottomBar from "./Bars/BottomBar";
import ChatPage from "./ChatSection/ChatPage";
import StationDataModal from "./ChatSection/StationDataModal";
import { useAppData } from "./Data/Appcontext";
import { useSendMessage } from "./ChatSection/useSendMessage";

function HomePage() {
  const { stationModalVisible, setStationModalVisible } = useAppData();
  const { send } = useSendMessage();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <UpperBar />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ChatPage />
        <BottomBar />
      </KeyboardAvoidingView>

      <StationDataModal
        visible={stationModalVisible}
        onClose={() => setStationModalVisible(false)}
        onSubmit={(formattedMessage) => {
          send(formattedMessage, "donnestation");
        }}
      />
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
