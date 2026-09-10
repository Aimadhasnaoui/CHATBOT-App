import { StyleSheet, View, TextInput, Pressable, Keyboard } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { useAppData } from "../Data/Appcontext";

const BottomBar = () => {
  const { conversation, setconversation, setConversationSart } = useAppData();
  const [Text, setText] = useState("");
  const SEND = () => {
    console.log(Text);
    const conversationArray = [...conversation,{
      message:Text,
      response:'test',
      loadingResponse:false,
    }]
    setText('')
    setconversation(conversationArray)
    setConversationSart(true);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Ecrivez votre message ici ..."
          multiline
          textAlignVertical="top"
          value={Text}
          onChangeText={setText}
        ></TextInput>
        <Pressable style={styles.sendButton} onPress={SEND}>
          <Feather name="arrow-up" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 24,
    paddingLeft: 15,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 9,
    maxHeight: 120,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
});
