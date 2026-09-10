import { StyleSheet, Text, View, Pressable } from "react-native";
import Logo from "../../assets/logo.svg";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import HistoriqueDrawer from "./HistoriqueDrawer";

const UpperBar = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View>
        <Pressable style={styles.icon} onPress={() => setModalVisible(true)}>
          <Feather name="menu" size={24} color="#334155" />
        </Pressable>
      </View>
      <View style={styles.titleRow}>
        <View style={styles.logoWrapp}>
          <Logo width={15} height={15} />
        </View>
        <View>
          <View style={styles.nameRow}>
            <Text style={styles.title}>AgroBot</Text>
            <Text style={styles.version}>v1.0</Text>
          </View>
          <Text style={styles.subtitle}>Assistant Irrigation connecté</Text>
        </View>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>AH</Text>
      </View>

      <HistoriqueDrawer
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default UpperBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapp: {
    backgroundColor: "#2E7D32",
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  title: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
  },
  version: {
    color: "#2E7D32",
    fontSize: 10,
    fontWeight: "normal",
    backgroundColor: "#2e7d3220",
    paddingHorizontal: 6,
    borderRadius: 70,
    paddingVertical: 2,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 10,
  },
  avatar: {
    backgroundColor: "#42914620",
    width: 40,
    height: 40,
    borderRadius: 100,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  avatarText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "bold",
  },
});
