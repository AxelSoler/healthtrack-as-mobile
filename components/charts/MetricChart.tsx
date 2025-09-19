import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface Metric {
  id: string;
  created_at: string;
  user_id: string;
  weight?: number;
  blood_pressure?: string;
  sleep_hours?: number;
}

interface MetricChartProps {
  metrics: Metric[];
}

export const MetricChart = ({ metrics }: MetricChartProps) => {
  // Ordenar por fecha ascendente
  const sortedMetrics = [...metrics].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Filtrar solo los que tienen peso
  const weightData = sortedMetrics
    .filter((metric) => metric.weight !== undefined && metric.weight !== null)
    .map((metric) => ({
      value: metric.weight as number,
      label: new Date(metric.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));

  if (weightData.length === 0) {
    return (
      <Text style={styles.noData}>
        No weight data available to display chart.
      </Text>
    );
  }

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={weightData}
        curved
        height={220}
        thickness={3}
        color="#8884d8"
        hideDataPoints={false}
        dataPointsColor="#8884d8"
        yAxisTextStyle={{ color: "#777" }}
        xAxisLabelTextStyle={{ color: "#777", fontSize: 10 }}
        spacing={40}
        initialSpacing={10}
        animateOnDataChange
        animationDuration={500}
        scrollAnimation
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    paddingVertical: 16,
  },
  noData: {
    textAlign: "center",
    color: "#777",
    paddingVertical: 24,
  },
});
