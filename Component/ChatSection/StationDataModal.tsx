import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";

type StationDataModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formattedMessage: string) => void;
};

const STATIONS = [
  { id: "s1", name: "Station 1 - Parcelle Nord", desc: "Secteur A - Culture Maïs" },
  { id: "s2", name: "Station 2 - Parcelle Sud", desc: "Secteur B - Arboriculture" },
  { id: "s3", name: "Station 3 - Serre Principal", desc: "Secteur C - Horticole" },
  { id: "all", name: "Toutes les stations", desc: "Vue globale agrégée" },
];

const PAS_DE_MESURE = [
  { id: "15min", label: "15 Min", desc: "Fréquence haute précision" },
  { id: "horaire", label: "Horaire (1h)", desc: "Moyennes horaires recommandées" },
  { id: "journalier", label: "Journalier (24h)", desc: "Relevé quotidien cumulé" },
  { id: "mensuel", label: "Mensuel", desc: "Bilan mensuel global" },
];

const PARAMETRES = [
  { id: "temp", label: "Température", icon: "thermometer-outline", color: "#EF4444", bg: "#FEE2E2" },
  { id: "humidity_air", label: "Humidité Air", icon: "water-outline", color: "#2563EB", bg: "#DBEAFE" },
  { id: "humidity_soil", label: "Humidité Sol", icon: "leaf-outline", color: "#2E7D32", bg: "#DCFCE7" },
  { id: "rain", label: "Pluviométrie", icon: "rainy-outline", color: "#0D9488", bg: "#CCFBF1" },
  { id: "wind", label: "Vent", icon: "speedometer-outline", color: "#D97706", bg: "#FEF3C7" },
];

const StationDataModal = ({ visible, onClose, onSubmit }: StationDataModalProps) => {
  const translateYAnim = useRef(new Animated.Value(600)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const stepAnim = useRef(new Animated.Value(1)).current;

  // Wizard step state (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [selectedStation, setSelectedStation] = useState(STATIONS[0].name);
  const [selectedPas, setSelectedPas] = useState(PAS_DE_MESURE[1].label);
  const [selectedParam, setSelectedParam] = useState(PARAMETRES[0].label);

  const todayStr = dayjs().format("YYYY-MM-DD");
  const sevenDaysAgoStr = dayjs().subtract(7, "day").format("YYYY-MM-DD");

  const [dateFrom, setDateFrom] = useState(sevenDaysAgoStr);
  const [dateTo, setDateTo] = useState(todayStr);

  // Active preset tracking (0: aujourd'hui, 7: 7 jours, 30: 30 jours, null: custom)
  const [activePreset, setActivePreset] = useState<number | null>(7);

  // Date Picker Modal state ('from' | 'to' | null)
  const [datePickerMode, setDatePickerMode] = useState<"from" | "to" | null>(null);
  const [pickerDate, setPickerDate] = useState<dayjs.Dayjs>(dayjs());

  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 8,
          tension: 45,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 600,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const animateNextStep = (targetStep: number) => {
    Animated.sequence([
      Animated.timing(stepAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(stepAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentStep(targetStep);
  };

  if (!visible) return null;

  const applyPresetDate = (days: number) => {
    setActivePreset(days);
    if (days === 0) {
      setDateFrom(todayStr);
      setDateTo(todayStr);
    } else {
      setDateFrom(dayjs().subtract(days, "day").format("YYYY-MM-DD"));
      setDateTo(todayStr);
    }
  };

  const handleOpenDatePicker = (mode: "from" | "to") => {
    const currentVal = mode === "from" ? dateFrom : dateTo;
    const parsed = dayjs(currentVal, "YYYY-MM-DD");
    setPickerDate(parsed.isValid() ? parsed : dayjs());
    setDatePickerMode(mode);
  };

  const handleSelectCalendarDay = (dayNum: number) => {
    const selected = pickerDate.date(dayNum);
    const formatted = selected.format("YYYY-MM-DD");
    if (datePickerMode === "from") {
      setDateFrom(formatted);
    } else if (datePickerMode === "to") {
      setDateTo(formatted);
    }
    setActivePreset(null);
    setDatePickerMode(null);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      animateNextStep(currentStep + 1);
    } else {
      handleConfirm();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      animateNextStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    const formattedMessage = `📡 Données station requested:\n• Station: ${selectedStation}\n• Pas de mesure: ${selectedPas}\n• Paramètre: ${selectedParam}\n• Période: Du ${dateFrom} au ${dateTo}`;
    onSubmit(formattedMessage);
    onClose();
  };

  const getStepTheme = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Étape 1: Choix de la Station",
          icon: "location-outline" as const,
          iconBg: "#DCFCE7",
          iconColor: "#2E7D32",
          badgeBorder: "#BBF7D0",
        };
      case 2:
        return {
          title: "Étape 2: Pas de mesure",
          icon: "time-outline" as const,
          iconBg: "#DBEAFE",
          iconColor: "#2563EB",
          badgeBorder: "#BFDBFE",
        };
      case 3:
        return {
          title: "Étape 3: Paramètre à mesurer",
          icon: "stats-chart-outline" as const,
          iconBg: "#FEF3C7",
          iconColor: "#D97706",
          badgeBorder: "#FDE68A",
        };
      case 4:
      default:
        return {
          title: "Étape 4: Période (Du ... Au ...)",
          icon: "calendar-outline" as const,
          iconBg: "#F3E8FF",
          iconColor: "#9333EA",
          badgeBorder: "#E9D5FF",
        };
    }
  };

  const theme = getStepTheme();

  // Calendar calculations
  const daysInMonth = pickerDate.daysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
          <Pressable style={styles.backdropPressable} onPress={onClose} />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoiding}
        >
          <Animated.View
            style={[
              styles.dialogCard,
              {
                transform: [{ translateY: translateYAnim }],
              },
            ]}
          >
            {/* Handle Drag Indicator */}
            <View style={styles.handleBarContainer}>
              <View style={styles.handleBar} />
            </View>

            {/* Header & Step Indicator */}
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <View style={[styles.iconOuterRing, { borderColor: theme.badgeBorder }]}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
                    <Ionicons name={theme.icon} size={22} color={theme.iconColor} />
                  </View>
                </View>

                <View style={styles.headerTitles}>
                  <Text style={styles.stepBadgeText}>
                    Étape {currentStep} sur 4
                  </Text>
                  <Text style={styles.mainTitle}>{theme.title}</Text>
                </View>

                <Pressable style={styles.closeBtn} onPress={onClose}>
                  <Feather name="x" size={18} color="#64748B" />
                </Pressable>
              </View>

              {/* Progress Bar & Dots */}
              <View style={styles.progressSection}>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${(currentStep / 4) * 100}%` },
                    ]}
                  />
                </View>

                <View style={styles.dotsRow}>
                  {[1, 2, 3, 4].map((stepNum) => {
                    const isActive = stepNum === currentStep;
                    const isPassed = stepNum < currentStep;
                    return (
                      <Pressable
                        key={stepNum}
                        style={[
                          styles.dot,
                          isActive && styles.dotActive,
                          isPassed && styles.dotPassed,
                        ]}
                        onPress={() => setCurrentStep(stepNum)}
                      >
                        <Text
                          style={[
                            styles.dotText,
                            (isActive || isPassed) && styles.dotTextActive,
                          ]}
                        >
                          {stepNum}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Step Body Content */}
            <Animated.View style={{ flexShrink: 1, opacity: stepAnim }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollBody}
              >
                {/* STEP 1: Station */}
                {currentStep === 1 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepInstruction}>
                      Saisissez ou choisissez la station agricole souhaitée :
                    </Text>

                    {/* Text Input for Custom Station Name */}
                    <View style={styles.customStationBox}>
                      <Ionicons name="pencil-outline" size={18} color="#2E7D32" />
                      <TextInput
                        style={styles.customStationInput}
                        value={selectedStation}
                        onChangeText={setSelectedStation}
                        placeholder="Ex: Station 4 - Serre Est, ou nom personnalisé..."
                        placeholderTextColor="#94A3B8"
                      />
                      {selectedStation.trim().length > 0 && (
                        <Pressable onPress={() => setSelectedStation("")}>
                          <Ionicons name="close-circle" size={18} color="#94A3B8" />
                        </Pressable>
                      )}
                    </View>

                    <Text style={styles.subSectionTitle}>Ou choisissez une station suggérée :</Text>

                    <View style={styles.cardList}>
                      {STATIONS.map((station) => {
                        const isSelected = selectedStation === station.name;
                        return (
                          <Pressable
                            key={station.id}
                            style={[
                              styles.selectCard,
                              isSelected && styles.selectCardActive,
                            ]}
                            onPress={() => setSelectedStation(station.name)}
                          >
                            <View
                              style={[
                                styles.cardIconCircle,
                                isSelected && styles.cardIconCircleActive,
                              ]}
                            >
                              <Ionicons
                                name="location"
                                size={18}
                                color={isSelected ? "#FFFFFF" : "#2E7D32"}
                              />
                            </View>

                            <View style={styles.cardTextWrapper}>
                              <Text
                                style={[
                                  styles.cardTitle,
                                  isSelected && styles.cardTitleActive,
                                ]}
                              >
                                {station.name}
                              </Text>
                              <Text style={styles.cardDesc}>{station.desc}</Text>
                            </View>

                            {isSelected ? (
                              <Ionicons
                                name="checkmark-circle"
                                size={22}
                                color="#2E7D32"
                              />
                            ) : (
                              <View style={styles.radioOutline} />
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* STEP 2: Pas de mesure */}
                {currentStep === 2 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepInstruction}>
                      Sélectionnez la fréquence d'agrégation des mesures :
                    </Text>
                    <View style={styles.cardList}>
                      {PAS_DE_MESURE.map((pas) => {
                        const isSelected = selectedPas === pas.label;
                        return (
                          <Pressable
                            key={pas.id}
                            style={[
                              styles.selectCard,
                              isSelected && styles.selectCardActiveBlue,
                            ]}
                            onPress={() => setSelectedPas(pas.label)}
                          >
                            <View
                              style={[
                                styles.cardIconCircle,
                                { backgroundColor: isSelected ? "#2563EB" : "#DBEAFE" },
                              ]}
                            >
                              <Ionicons
                                name="time"
                                size={18}
                                color={isSelected ? "#FFFFFF" : "#2563EB"}
                              />
                            </View>

                            <View style={styles.cardTextWrapper}>
                              <Text
                                style={[
                                  styles.cardTitle,
                                  isSelected && styles.cardTitleActiveBlue,
                                ]}
                              >
                                {pas.label}
                              </Text>
                              <Text style={styles.cardDesc}>{pas.desc}</Text>
                            </View>

                            {isSelected ? (
                              <Ionicons
                                name="checkmark-circle"
                                size={22}
                                color="#2563EB"
                              />
                            ) : (
                              <View style={styles.radioOutline} />
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* STEP 3: Paramètre */}
                {currentStep === 3 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepInstruction}>
                      Choisissez le paramètre météo ou agronomique à analyser :
                    </Text>
                    <View style={styles.cardList}>
                      {PARAMETRES.map((param) => {
                        const isSelected = selectedParam === param.label;
                        return (
                          <Pressable
                            key={param.id}
                            style={[
                              styles.selectCard,
                              isSelected && styles.selectCardActiveAmber,
                            ]}
                            onPress={() => setSelectedParam(param.label)}
                          >
                            <View
                              style={[
                                styles.cardIconCircle,
                                { backgroundColor: isSelected ? param.color : param.bg },
                              ]}
                            >
                              <Ionicons
                                name={param.icon as any}
                                size={18}
                                color={isSelected ? "#FFFFFF" : param.color}
                              />
                            </View>

                            <View style={styles.cardTextWrapper}>
                              <Text
                                style={[
                                  styles.cardTitle,
                                  isSelected && styles.cardTitleActiveAmber,
                                ]}
                              >
                                {param.label}
                              </Text>
                              <Text style={styles.cardDesc}>
                                Mesure de {param.label.toLowerCase()} en temps réel
                              </Text>
                            </View>

                            {isSelected ? (
                              <Ionicons
                                name="checkmark-circle"
                                size={22}
                                color={param.color}
                              />
                            ) : (
                              <View style={styles.radioOutline} />
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* STEP 4: Dates (Du ... Au ...) */}
                {currentStep === 4 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepInstruction}>
                      Définissez la plage de dates (Du ... Au ...) :
                    </Text>

                    {/* Quick Presets with active color change */}
                    <Text style={styles.presetLabel}>Raccourcis de période :</Text>
                    <View style={styles.presetRow}>
                      <Pressable
                        style={[
                          styles.presetBadge,
                          activePreset === 0 && styles.presetBadgeActive,
                        ]}
                        onPress={() => applyPresetDate(0)}
                      >
                        <Text
                          style={[
                            styles.presetText,
                            activePreset === 0 && styles.presetTextActive,
                          ]}
                        >
                          Aujourd'hui
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[
                          styles.presetBadge,
                          activePreset === 7 && styles.presetBadgeActive,
                        ]}
                        onPress={() => applyPresetDate(7)}
                      >
                        <Text
                          style={[
                            styles.presetText,
                            activePreset === 7 && styles.presetTextActive,
                          ]}
                        >
                          7 Derniers Jours
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[
                          styles.presetBadge,
                          activePreset === 30 && styles.presetBadgeActive,
                        ]}
                        onPress={() => applyPresetDate(30)}
                      >
                        <Text
                          style={[
                            styles.presetText,
                            activePreset === 30 && styles.presetTextActive,
                          ]}
                        >
                          30 Jours
                        </Text>
                      </Pressable>
                    </View>

                    {/* Date Inputs & Date Picker triggers */}
                    <View style={styles.dateInputsContainer}>
                      {/* Date de début (Du) */}
                      <View style={styles.dateInputBlock}>
                        <Text style={styles.inputTitle}>Date de début (Du)</Text>
                        <Pressable
                          style={styles.inputBox}
                          onPress={() => handleOpenDatePicker("from")}
                        >
                          <Ionicons name="calendar" size={18} color="#9333EA" />
                          <TextInput
                            style={styles.dateTextInput}
                            value={dateFrom}
                            onChangeText={(val) => {
                              setDateFrom(val);
                              setActivePreset(null);
                            }}
                            placeholder="AAAA-MM-JJ"
                            placeholderTextColor="#94A3B8"
                          />
                          <Pressable
                            style={styles.calendarPickBtn}
                            onPress={() => handleOpenDatePicker("from")}
                          >
                            <Feather name="calendar" size={14} color="#9333EA" />
                          </Pressable>
                        </Pressable>
                      </View>

                      {/* Date de fin (Au) */}
                      <View style={styles.dateInputBlock}>
                        <Text style={styles.inputTitle}>Date de fin (Au)</Text>
                        <Pressable
                          style={styles.inputBox}
                          onPress={() => handleOpenDatePicker("to")}
                        >
                          <Ionicons name="calendar" size={18} color="#9333EA" />
                          <TextInput
                            style={styles.dateTextInput}
                            value={dateTo}
                            onChangeText={(val) => {
                              setDateTo(val);
                              setActivePreset(null);
                            }}
                            placeholder="AAAA-MM-JJ"
                            placeholderTextColor="#94A3B8"
                          />
                          <Pressable
                            style={styles.calendarPickBtn}
                            onPress={() => handleOpenDatePicker("to")}
                          >
                            <Feather name="calendar" size={14} color="#9333EA" />
                          </Pressable>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </Animated.View>

            {/* Footer Buttons Navigation */}
            <View style={styles.footer}>
              {currentStep > 1 ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.prevBtn,
                    pressed && styles.btnPressed,
                  ]}
                  onPress={handlePrev}
                >
                  <Feather name="arrow-left" size={16} color="#475569" />
                  <Text style={styles.prevBtnText}>Précédent</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.prevBtn,
                    pressed && styles.btnPressed,
                  ]}
                  onPress={onClose}
                >
                  <Text style={styles.prevBtnText}>Annuler</Text>
                </Pressable>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.nextBtn,
                  currentStep === 4 && styles.nextBtnSubmit,
                  pressed && styles.btnPressed,
                ]}
                onPress={handleNext}
              >
                <Text style={styles.nextBtnText}>
                  {currentStep === 4 ? "Obtenir les données 🚀" : "Suivant"}
                </Text>
                {currentStep < 4 && (
                  <Feather name="arrow-right" size={16} color="#FFFFFF" />
                )}
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>

      {/* Calendar Date Picker Modal Overlay */}
      {datePickerMode && (
        <Modal
          transparent
          animationType="fade"
          visible={Boolean(datePickerMode)}
          onRequestClose={() => setDatePickerMode(null)}
        >
          <View style={styles.pickerBackdrop}>
            <Pressable
              style={styles.backdropPressable}
              onPress={() => setDatePickerMode(null)}
            />
            <View style={styles.pickerDialog}>
              {/* Header */}
              <View style={styles.pickerHeader}>
                <Pressable
                  style={styles.monthNavBtn}
                  onPress={() => setPickerDate(pickerDate.subtract(1, "month"))}
                >
                  <Ionicons name="chevron-back" size={20} color="#0F172A" />
                </Pressable>

                <Text style={styles.pickerMonthTitle}>
                  {pickerDate.format("MMMM YYYY")}
                </Text>

                <Pressable
                  style={styles.monthNavBtn}
                  onPress={() => setPickerDate(pickerDate.add(1, "month"))}
                >
                  <Ionicons name="chevron-forward" size={20} color="#0F172A" />
                </Pressable>
              </View>

              <Text style={styles.pickerSubLabel}>
                Sélectionner la {datePickerMode === "from" ? "date de début (Du)" : "date de fin (Au)"} :
              </Text>

              {/* Day Grid */}
              <View style={styles.calendarGrid}>
                {daysArray.map((dayNum) => {
                  const targetFormatted = pickerDate.date(dayNum).format("YYYY-MM-DD");
                  const currentSelected = datePickerMode === "from" ? dateFrom : dateTo;
                  const isSelectedDay = targetFormatted === currentSelected;

                  return (
                    <Pressable
                      key={dayNum}
                      style={[
                        styles.dayCell,
                        isSelectedDay && styles.dayCellSelected,
                      ]}
                      onPress={() => handleSelectCalendarDay(dayNum)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelectedDay && styles.dayTextSelected,
                        ]}
                      >
                        {dayNum}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                style={styles.pickerCloseBtn}
                onPress={() => setDatePickerMode(null)}
              >
                <Text style={styles.pickerCloseText}>Fermer</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

export default StationDataModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
  },
  backdropPressable: {
    flex: 1,
  },
  keyboardAvoiding: {
    width: "100%",
    justifyContent: "flex-end",
  },
  dialogCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: "85%",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  handleBarContainer: {
    alignItems: "center",
    paddingVertical: 6,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
  },
  header: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 12,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconOuterRing: {
    padding: 3,
    borderRadius: 22,
    borderWidth: 1,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitles: {
    flex: 1,
    gap: 2,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  progressSection: {
    gap: 8,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 2,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  dotActive: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  dotPassed: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },
  dotText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  dotTextActive: {
    color: "#FFFFFF",
  },
  scrollBody: {
    paddingVertical: 14,
  },
  stepContainer: {
    gap: 12,
  },
  stepInstruction: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
    lineHeight: 19,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 4,
  },
  customStationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1.5,
    borderColor: "#2E7D32",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  customStationInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "600",
    color: "#14532D",
    padding: 0,
  },
  cardList: {
    gap: 10,
  },
  selectCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 12,
  },
  selectCardActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#2E7D32",
  },
  selectCardActiveBlue: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  selectCardActiveAmber: {
    backgroundColor: "#FFFBEB",
    borderColor: "#D97706",
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconCircleActive: {
    backgroundColor: "#2E7D32",
  },
  cardTextWrapper: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#1E293B",
  },
  cardTitleActive: {
    color: "#166534",
    fontWeight: "700",
  },
  cardTitleActiveBlue: {
    color: "#1E40AF",
    fontWeight: "700",
  },
  cardTitleActiveAmber: {
    color: "#B45309",
    fontWeight: "700",
  },
  cardDesc: {
    fontSize: 11.5,
    color: "#64748B",
  },
  radioOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
  },
  presetBadge: {
    backgroundColor: "#F3E8FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  presetBadgeActive: {
    backgroundColor: "#9333EA",
    borderColor: "#7E22CE",
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  presetText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#7E22CE",
  },
  presetTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dateInputsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  dateInputBlock: {
    flex: 1,
    gap: 4,
  },
  inputTitle: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#475569",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 8,
  },
  dateTextInput: {
    flex: 1,
    fontSize: 12.5,
    color: "#0F172A",
    padding: 0,
  },
  calendarPickBtn: {
    padding: 4,
    backgroundColor: "#F3E8FF",
    borderRadius: 6,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 4,
  },
  prevBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
  },
  prevBtnText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#475569",
  },
  nextBtn: {
    flex: 1.8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#2E7D32",
  },
  nextBtnSubmit: {
    backgroundColor: "#166534",
  },
  nextBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  btnPressed: {
    opacity: 0.85,
  },
  // Calendar Date Picker Modal Styles
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  pickerDialog: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
    gap: 12,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerMonthTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    textTransform: "capitalize",
  },
  pickerSubLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginVertical: 4,
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  dayCellSelected: {
    backgroundColor: "#9333EA",
    borderColor: "#7E22CE",
  },
  dayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  pickerCloseBtn: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },
  pickerCloseText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
});
