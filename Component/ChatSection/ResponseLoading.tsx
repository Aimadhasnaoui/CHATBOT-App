import { StyleSheet, Text, View, Animated } from "react-native";
import { useEffect, useRef } from "react";

const usePulse = (delay: number, duration: number) => {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  return value;
};

const Dot = ({ delay }: { delay: number }) => {
  const value = usePulse(delay, 320);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: value.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          }),
          transform: [
            {
              translateY: value.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5],
              }),
            },
          ],
        },
      ]}
    />
  );
};

const SkeletonLine = ({ width, delay }: { width: number; delay: number }) => {
  const value = usePulse(delay, 620);

  return (
    <Animated.View
      style={[
        styles.line,
        {
          width: `${width}%`,
          opacity: value.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 1],
          }),
        },
      ]}
    />
  );
};

const ResponseLoading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View style={styles.dots}>
          <Dot delay={0} />
          <Dot delay={140} />
          <Dot delay={280} />
        </View>
        <Text style={styles.statusText}>Analyse votre demande en cours</Text>
      </View>

      <View style={styles.skeleton}>
        <SkeletonLine width={100} delay={0} />
        <SkeletonLine width={88} delay={140} />
        <SkeletonLine width={54} delay={280} />
      </View>
    </View>
  );
};

export default ResponseLoading;

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2E7D32",
  },
  statusText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  skeleton: {
    gap: 9,
  },
  line: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "#E2E8F0",
  },
});
