import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from "dayjs";
import Logo from "../../assets/logo.svg";
import { useAppData } from "../Data/Appcontext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetConversations,
  GetConversationsById,
  UpdateConversation,
  DeleteConversation,
} from "../../Servises/Historique";
import ConfirmModal from "../Common/ConfirmModal";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Animated,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const DRAWER_WIDTH = Dimensions.get("window").width * 0.75;

const HistoriqueDrawer = ({ visible, onClose }: Props) => {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const {
    setConversationSart,
    setconversation,
    setcoversationId,
    coversationId,
  } = useAppData();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isPending } = useQuery({
    queryKey: ["historique"],
    queryFn: GetConversations,
  });
  const { mutate: fetchConversationById, isPending: isPendingConversation } =
    useMutation({
      mutationFn: GetConversationsById,
      onSuccess: (data) => {
        setconversation(
          data.exchanges.map((exchange) => ({
            message: exchange.message,
            response: exchange.response,
            loadingResponse: false,
            createdAt: exchange.createdAt,
            lang: exchange.lang ?? undefined,
          })),
        );
        setcoversationId(data.id);
        setConversationSart(true);
        closeDrawer();
      },
    });

  const { mutate: updateTitle, isPending: isUpdatingTitle } = useMutation({
    mutationFn: UpdateConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historique"] });
      setEditingId(null);
    },
  });

  const { mutate: deleteConversation } = useMutation({
    mutationFn: DeleteConversation,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["historique"] });
      if (id === coversationId) {
        setconversation([]);
        setcoversationId(undefined);
        setConversationSart(false);
        onClose();
      }
    },
  });

  const openConversation = (id: string) => {
    fetchConversationById(id);
  };

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const confirmEditing = () => {
    const title = editingTitle.trim();
    if (editingId && title) {
      updateTitle({ id: editingId, Title: title });
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteConversation(deleteId);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

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

          <Pressable
            style={styles.newChatButton}
            onPress={() => {
              setConversationSart(false);
              setconversation([]);
              setcoversationId(undefined);
              closeDrawer();
            }}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.newChatText}>Nouvelle conversation</Text>
          </Pressable>

          <ScrollView
            style={styles.drawerList}
            contentContainerStyle={styles.drawerListContent}
            showsVerticalScrollIndicator={false}
          >
            {isPending ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Chargement...</Text>
              </View>
            ) : data && data.length > 0 ? (
              <View style={styles.historyGroup}>
                <Text style={styles.groupLabel}>Conversations</Text>
                {data.map((item) => {
                  const isEditing = editingId === item.id;
                  const isSelected = item.id === coversationId;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => !isEditing && openConversation(item.id)}
                      disabled={isPendingConversation}
                      style={({ pressed }) => [
                        styles.historyItem,
                        isSelected && styles.historyItemSelected,
                        pressed && styles.historyItemPressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.historyIcon,
                          { backgroundColor: "#DBEAFE" },
                        ]}
                      >
                        <Feather
                          name="message-circle"
                          size={15}
                          color="#2563EB"
                        />
                      </View>
                      <View style={styles.historyTextWrap}>
                        {isEditing ? (
                          <TextInput
                            value={editingTitle}
                            onChangeText={setEditingTitle}
                            style={styles.historyTitleInput}
                            autoFocus
                            onSubmitEditing={confirmEditing}
                          />
                        ) : (
                          <>
                            <Text style={styles.historyTitle} numberOfLines={1}>
                              {item.Title}
                            </Text>
                            <Text style={styles.historyDate}>
                              {dayjs(item.startedAt).format("DD/MM HH:mm")}
                            </Text>
                          </>
                        )}
                      </View>
                      {isEditing ? (
                        <>
                          <Pressable
                            onPress={confirmEditing}
                            disabled={isUpdatingTitle}
                            hitSlop={8}
                            style={styles.historyActionButton}
                          >
                            <Feather name="check" size={16} color="#2E7D32" />
                          </Pressable>
                          <Pressable
                            onPress={cancelEditing}
                            hitSlop={8}
                            style={styles.historyActionButton}
                          >
                            <Feather name="x" size={16} color="#94A3B8" />
                          </Pressable>
                        </>
                      ) : (
                        <>
                          <Pressable
                            onPress={() => startEditing(item.id, item.Title)}
                            hitSlop={8}
                            style={styles.historyActionButton}
                          >
                            <Feather name="edit-2" size={14} color="#94A3B8" />
                          </Pressable>
                          <Pressable
                            onPress={() => confirmDelete(item.id)}
                            hitSlop={8}
                            style={styles.historyActionButton}
                          >
                            <Feather name="trash-2" size={14} color="#EF4444" />
                          </Pressable>
                        </>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Feather name="message-circle" size={28} color="#CBD5E1" />
                <Text style={styles.emptyStateText}>
                  Aucune conversation pour le moment
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        <ConfirmModal
          visible={deleteId !== null}
          title="Supprimer la conversation"
          message="Cette action est définitive et supprimera l'historique de cette discussion."
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
          iconName="trash-2"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          useOverlay={true}
        />
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
  historyItemSelected: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#2E7D32",
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
  historyTitleInput: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
    padding: 0,
  },
  historyActionButton: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 10,
  },
  emptyStateText: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
  },
});
