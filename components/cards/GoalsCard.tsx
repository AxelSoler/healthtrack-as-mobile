import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Metric, Profile } from "@/types";

interface GoalsCardProps {
  metrics: Metric[];
  profile: Profile;
}

const GoalsCard = ({ metrics, profile }: GoalsCardProps) => {
  const weightMetrics = metrics.filter((m) => m.weight !== null);
  const currentWeight = weightMetrics?.[0]?.weight || 0;
  const previousWeight = weightMetrics?.[1]?.weight || 0;
  const weightDifference = Math.abs(currentWeight - previousWeight);
  const weightChangeStatus =
    currentWeight < previousWeight
      ? "Lost"
      : currentWeight > previousWeight
      ? "Gained"
      : "Maintained";

  const weightGoal = profile?.weight_goal || 0;
  const poundsToGoal = Math.abs(currentWeight - weightGoal);
  const goalProgress =
    weightGoal > 0 ? Math.max(0, 100 - (poundsToGoal / weightGoal) * 100) : 0;

  return (
    <View style={styles.card}>
      {/* Diferencia de peso */}
      <View style={styles.sideBox}>
        <Text style={styles.valueText}>{weightDifference.toFixed(1)} lbs</Text>
        <Text style={styles.labelText}>{weightChangeStatus}</Text>
      </View>

      {/* Progreso circular */}
      <View style={styles.progressContainer}>
        <PieChart
          donut
          radius={60}
          innerRadius={50}
          showText={false}
          data={[
            { value: goalProgress, color: "#ec4899" },
            { value: 100 - goalProgress, color: "#fbcfe8" },
          ]}
        />
        <View style={styles.centerContent}>
          <Text style={styles.currentWeight}>
            {currentWeight.toFixed(1)} lbs
          </Text>
          <Text style={styles.labelText}>Current weight</Text>
        </View>
      </View>

      {/* Goal */}
      <View style={styles.sideBox}>
        {weightGoal > 0 ? (
          <>
            <Text style={styles.valueText}>
              {poundsToGoal.toFixed(1)} lbs
            </Text>
            <Text style={styles.labelText}>To Goal</Text>
          </>
        ) : (
          <TouchableOpacity style={styles.goalButton}>
            <Text style={styles.goalButtonText}>Set a goal!</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 180,
    borderRadius: 24,
    backgroundColor: "#fbcfe8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sideBox: {
    alignItems: "center",
  },
  valueText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#831843", // primary-dark
  },
  labelText: {
    fontSize: 12,
    color: "#db2777", // primary
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
  },
  currentWeight: {
    fontSize: 18,
    fontWeight: "700",
    color: "#831843",
  },
  goalButton: {
    backgroundColor: "#831843",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  goalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default GoalsCard;
