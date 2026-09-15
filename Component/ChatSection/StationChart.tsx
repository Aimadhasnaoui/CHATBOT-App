import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Animated,
  Modal,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { ChartData } from "../../Servises/Conversation";

type StationChartProps = {
  chartData: ChartData;
};

const StationChart = ({ chartData }: StationChartProps) => {
  const {
    title = "Evapotranspiration",
    labels = [],
    values = [],
    unit = "mm",
    sensorName = "Evapotranspiration",
  } = chartData;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    values.length > 0 ? values.length - 1 : null
  );

  // Expanded Bottom Sheet Modal State
  const [isExpandedModalVisible, setIsExpandedModalVisible] = useState(false);
  const translateYAnim = useRef(new Animated.Value(600)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isExpandedModalVisible) {
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
  }, [isExpandedModalVisible]);

  if (!labels || labels.length === 0 || !values || values.length === 0) {
    return null;
  }

  const maxVal = Math.max(...values, 8);
  const minVal = Math.min(...values);
  const avgVal = (
    values.reduce((sum, val) => sum + val, 0) / values.length
  ).toFixed(2);

  // Calculate dynamic 5-tick Y-axis scale based on maxVal
  const step = Math.ceil(maxVal / 4) || 2;
  const yTicks = [step * 4, step * 3, step * 2, step, 0];

  return (
    <View style={styles.cardContainer}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleLeft}>
          <View style={styles.leafIconBadge}>
            <Ionicons name="leaf-outline" size={18} color="#7CB342" />
          </View>
          <Text style={styles.titleText}>
            {sensorName} ({unit})
          </Text>
        </View>

        <Pressable
          style={styles.expandBadge}
          onPress={() => setIsExpandedModalVisible(true)}
        >
          <Ionicons name="expand-outline" size={16} color="#7CB342" />
        </Pressable>
      </View>

      {/* Selected Data Point Tooltip Callout */}
      {selectedIndex !== null && (
        <View style={styles.tooltipBanner}>
          <Feather name="info" size={12} color="#43A047" />
          <Text style={styles.tooltipText}>
            {labels[selectedIndex]} :{" "}
            <Text style={styles.tooltipValue}>
              {values[selectedIndex]} {unit}
            </Text>
          </Text>
        </View>
      )}

      {/* Main Card Compact Chart */}
      <View style={styles.chartGraphicContainer}>
        {/* Y-Axis Column */}
        <View style={styles.yAxisColumn}>
          <Text style={styles.yAxisUnitText}>{unit}</Text>
          <View style={styles.yTicksWrapper}>
            {yTicks.map((tick) => (
              <Text key={tick} style={styles.yTickText}>
                {tick}
              </Text>
            ))}
          </View>
        </View>

        {/* Green Vertical Axis Line */}
        <View style={styles.yAxisLine} />

        {/* Scrollable Chart Area */}
        <View style={styles.chartMainArea}>
          {/* Horizontal Background Grid Lines */}
          <View style={styles.gridLinesOverlay}>
            {yTicks.map((tick) => (
              <View key={tick} style={styles.horizontalGridLine} />
            ))}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollableContent,
              { minWidth: Math.max(280, values.length * 54) },
            ]}
          >
            <View style={styles.barsRow}>
              {values.map((val, idx) => {
                const heightPercent = Math.max(5, (val / yTicks[0]) * 100);
                const isSelected = selectedIndex === idx;

                return (
                  <Pressable
                    key={idx}
                    style={styles.singleBarColumn}
                    onPress={() => setSelectedIndex(idx)}
                  >
                    <View style={styles.pillarTrack}>
                      <View
                        style={[
                          styles.pillarFill,
                          { height: `${heightPercent}%` },
                          isSelected && styles.pillarFillSelected,
                        ]}
                      />
                    </View>

                    {/* Display X-axis date label */}
                    <Text
                      style={[
                        styles.xAxisLabelText,
                        isSelected && styles.xAxisLabelTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {labels[idx]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Expanded Fullscreen Bottom Sheet Modal */}
      {isExpandedModalVisible && (
        <Modal
          transparent
          animationType="none"
          visible={isExpandedModalVisible}
          onRequestClose={() => setIsExpandedModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
              <Pressable
                style={styles.backdropPressable}
                onPress={() => setIsExpandedModalVisible(false)}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.modalBottomSheet,
                {
                  transform: [{ translateY: translateYAnim }],
                },
              ]}
            >
              {/* Drag Handle Bar */}
              <View style={styles.handleBarContainer}>
                <View style={styles.handleBar} />
              </View>

              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <View style={styles.leafIconBadge}>
                    <Ionicons name="leaf-outline" size={20} color="#7CB342" />
                  </View>
                  <View style={styles.modalTitleTexts}>
                    <Text style={styles.modalMainTitle}>
                      {sensorName} ({unit})
                    </Text>
                    <Text style={styles.modalSubtitle}>{title}</Text>
                  </View>
                </View>

                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setIsExpandedModalVisible(false)}
                >
                  <Feather name="x" size={20} color="#64748B" />
                </Pressable>
              </View>

              {/* Summary Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Moyenne</Text>
                  <Text style={styles.statVal}>
                    {avgVal} {unit}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Max</Text>
                  <Text style={[styles.statVal, { color: "#EF4444" }]}>
                    {maxVal} {unit}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Min</Text>
                  <Text style={[styles.statVal, { color: "#2563EB" }]}>
                    {minVal} {unit}
                  </Text>
                </View>
              </View>

              {/* Tooltip callout for selected point */}
              {selectedIndex !== null && (
                <View style={styles.tooltipBanner}>
                  <Feather name="info" size={13} color="#43A047" />
                  <Text style={styles.tooltipText}>
                    {labels[selectedIndex]} :{" "}
                    <Text style={styles.tooltipValue}>
                      {values[selectedIndex]} {unit}
                    </Text>
                  </Text>
                </View>
              )}

              {/* Large Zoomed Chart Graphic View */}
              <View style={styles.modalChartGraphicContainer}>
                {/* Y-Axis Column */}
                <View style={styles.yAxisColumn}>
                  <Text style={styles.yAxisUnitText}>{unit}</Text>
                  <View style={styles.yTicksWrapper}>
                    {yTicks.map((tick) => (
                      <Text key={tick} style={styles.yTickText}>
                        {tick}
                      </Text>
                    ))}
                  </View>
                </View>

                {/* Green Vertical Axis Line */}
                <View style={styles.yAxisLineModal} />

                {/* Scrollable Zoomed Chart Area */}
                <View style={styles.chartMainArea}>
                  <View style={styles.gridLinesOverlay}>
                    {yTicks.map((tick) => (
                      <View key={tick} style={styles.horizontalGridLine} />
                    ))}
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.scrollableContent,
                      { minWidth: Math.max(300, values.length * 60) },
                    ]}
                  >
                    <View style={styles.barsRowModal}>
                      {values.map((val, idx) => {
                        const heightPercent = Math.max(
                          5,
                          (val / yTicks[0]) * 100
                        );
                        const isSelected = selectedIndex === idx;

                        return (
                          <Pressable
                            key={idx}
                            style={styles.modalSingleBarColumn}
                            onPress={() => setSelectedIndex(idx)}
                          >
                            <Text
                              style={[
                                styles.barValueTextModal,
                                isSelected && styles.barValueTextSelected,
                              ]}
                            >
                              {val}
                            </Text>

                            <View style={styles.modalPillarTrack}>
                              <View
                                style={[
                                  styles.pillarFill,
                                  { height: `${heightPercent}%` },
                                  isSelected && styles.pillarFillSelected,
                                ]}
                              />
                            </View>

                            <Text
                              style={[
                                styles.xAxisLabelText,
                                isSelected && styles.xAxisLabelTextSelected,
                              ]}
                              numberOfLines={1}
                            >
                              {labels[idx]}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              </View>

              <Pressable
                style={styles.modalCloseFooterBtn}
                onPress={() => setIsExpandedModalVisible(false)}
              >
                <Text style={styles.modalCloseFooterText}>
                  Fermer le graphique
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default StationChart;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  leafIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#475569",
  },
  expandBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  tooltipText: {
    fontSize: 11.5,
    color: "#2E7D32",
  },
  tooltipValue: {
    fontWeight: "700",
  },
  chartGraphicContainer: {
    flexDirection: "row",
    height: 180,
    marginTop: 8,
    position: "relative",
  },
  modalChartGraphicContainer: {
    flexDirection: "row",
    height: 250,
    marginVertical: 10,
    position: "relative",
  },
  yAxisColumn: {
    width: 28,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 22,
  },
  yAxisUnitText: {
    fontSize: 10.5,
    color: "#7CB342",
    fontWeight: "600",
    marginBottom: 4,
  },
  yTicksWrapper: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  yTickText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7CB342",
  },
  yAxisLine: {
    width: 1.5,
    backgroundColor: "#7CB342",
    height: "82%",
    marginTop: 20,
    marginRight: 6,
  },
  yAxisLineModal: {
    width: 2,
    backgroundColor: "#7CB342",
    height: "85%",
    marginTop: 20,
    marginRight: 8,
  },
  chartMainArea: {
    flex: 1,
    position: "relative",
  },
  gridLinesOverlay: {
    ...StyleSheet.absoluteFill,
    height: "82%",
    marginTop: 20,
    justifyContent: "space-between",
    zIndex: 0,
  },
  horizontalGridLine: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  scrollableContent: {
    flexGrow: 1,
    height: "100%",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    zIndex: 1,
    paddingBottom: 4,
  },
  barsRowModal: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    zIndex: 1,
    paddingBottom: 6,
  },
  singleBarColumn: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    gap: 6,
  },
  modalSingleBarColumn: {
    width: 54,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    gap: 6,
  },
  barValueTextModal: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  barValueTextSelected: {
    color: "#33691E",
    fontWeight: "700",
  },
  pillarTrack: {
    width: 8,
    height: "76%",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  modalPillarTrack: {
    width: 12,
    height: "78%",
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  pillarFill: {
    width: "100%",
    backgroundColor: "#7CB342",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  pillarFillSelected: {
    backgroundColor: "#33691E",
  },
  xAxisLabelText: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "500",
  },
  xAxisLabelTextSelected: {
    color: "#689F38",
    fontWeight: "700",
  },
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
  modalBottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: "90%",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
    gap: 10,
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
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  modalTitleTexts: {
    flex: 1,
    gap: 2,
  },
  modalMainTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  statVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: "#CBD5E1",
  },
  modalCloseFooterBtn: {
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },
  modalCloseFooterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
});
