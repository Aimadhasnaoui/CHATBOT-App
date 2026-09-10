import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../assets/logo.svg";
import {useAppData} from '../Data/Appcontext'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";

type HistoryItem = {
  id: string;
  title: string;
  time: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  iconColor: string;
  iconBackground: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

const historyGroups: { label: string; items: HistoryItem[] }[] = [
  {
    label: "Aujourd'hui",
    items: [
      {
        id: "1",
        title: "Statut hydrique du Pivot 2",
        time: "09:14",
        icon: "droplet",
        iconColor: "#2563EB",
        iconBackground: "#DBEAFE",
      },
      {
        id: "2",
        title: "Alertes de stress hydrique",
        time: "08:02",
        icon: "alert-triangle",
        iconColor: "#D97706",
        iconBackground: "#FEF3C7",
      },
    ],
  },
  {
    label: "Hier",
    items: [
      {
        id: "3",
        title: "Tour d'eau du jour",
        time: "18:45",
        icon: "check-circle",
        iconColor: "#2E7D32",
        iconBackground: "#DCFCE7",
      },
      {
        id: "4",
        title: "Bilan évapotranspiration (ETO)",
        time: "11:20",
        icon: "message-circle",
        iconColor: "#0D9488",
        iconBackground: "#CCFBF1",
      },
    ],
  },
  {
    label: "Cette semaine",
    items: [
      {
        id: "5",
        title: "Prévisions météo semaine",
        time: "Lundi",
        icon: "cloud",
        iconColor: "#7C3AED",
        iconBackground: "#EDE9FE",
      },
    ],
  },
];

const DRAWER_WIDTH = Dimensions.get("window").width * 0.75;

const HistoriqueDrawer = ({ visible, onClose }: Props) => {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const {  setConversationSart,setconversation } = useAppData();
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal
      animationType="none"
      transparent
      statusBarTranslucent
      visible={visible}
      onRequestClose={closeDrawer}
    >
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={styles.backdropPress} onPress={closeDrawer} />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawer,
            { paddingTop: insets.top + 16 },
            { transform: [{ translateX }] },
          ]}
        >
          <View style={styles.drawerHeader}>
            <View style={styles.drawerHeaderTitleWrap}>
              <View style={styles.drawerLogo}>
                <Logo width={16} height={16} />
              </View>
              <View>
                <Text style={styles.drawerTitle}>Historique</Text>
                <Text style={styles.drawerSubtitle}>Vos conversations</Text>
              </View>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={closeDrawer}
              hitSlop={8}
            >
              <Feather name="x" size={18} color="#334155" />
            </Pressable>
          </View>

          <Pressable style={styles.newChatButton} onPress={()=>{
            setConversationSart(false)
            setconversation([])
            closeDrawer()
          }}>
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.newChatText}>Nouvelle conversation</Text>
          </Pressable>

          <ScrollView
            style={styles.drawerList}
            contentContainerStyle={styles.drawerListContent}
            showsVerticalScrollIndicator={false}
          >
            {historyGroups.map((group) => (
              <View key={group.label} style={styles.historyGroup}>
                <Text style={styles.groupLabel}>{group.label}</Text>
                {group.items.map((item) => (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.historyItem,
                      pressed && styles.historyItemPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.historyIcon,
                        { backgroundColor: item.iconBackground },
                      ]}
                    >
                      <Feather
                        name={item.icon}
                        size={15}
                        color={item.iconColor}
                      />
                    </View>
                    <View style={styles.historyTextWrap}>
                      <Text style={styles.historyTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.historyDate}>{item.time}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color="#CBD5E1" />
                  </Pressable>
                ))}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default HistoriqueDrawer;

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  backdropPress: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  drawerHeaderTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  drawerLogo: {
    width: 34,
    height: 34,
    borderRadius: 100,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
  drawerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0F172A",
  },
  drawerSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  newChatText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  drawerList: {
    flex: 1,
  },
  drawerListContent: {
    paddingBottom: 24,
  },
  historyGroup: {
    marginBottom: 18,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  historyItemPressed: {
    backgroundColor: "#EEF2F6",
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  historyTextWrap: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
  },
  historyDate: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
});
