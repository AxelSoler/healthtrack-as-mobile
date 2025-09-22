import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import Loading from "@/components/Loading";

const motivationalMessages = [
  "Every step counts! Keep going on your wellness journey.",
  "Your health is your greatest wealth. Invest in it every day.",
  "Small changes, big results. You can do it!",
  "Today is a new opportunity to be the best version of yourself.",
  "Don't give up. Progress, not perfection, is what matters.",
];

export default function DashboardScreen() {
  const [randomMessage, setRandomMessage] = useState("");
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setRandomMessage(
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ]
    );
  }, []);

  useEffect(() => {
    const getMetrics = async () => {
      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from("metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setMetrics(data);
      }
      setLoading(false);
    };

    getMetrics();
  }, [user]);

  const weights = metrics
    ?.map((metric) => metric.weight)
    .filter(Boolean) as number[];
  const latestWeight = weights && weights.length > 0 ? weights[0] : null;

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.motivation}>{randomMessage}</Text>
          {latestWeight && (
            <Text style={styles.latestWeight}>
              Great job with your current weight of {latestWeight} kg! Keep it
              up.
            </Text>
          )}

          <PrimaryButton
            title="Define Your Goals"
            onPress={() => router.push("/goals")}
          />
        </View>

        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Last Metrics</Text>
          {metrics && metrics.length > 0 ? (
            metrics.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <Text style={styles.metricDate}>
                  {new Date(metric.created_at).toLocaleDateString()}
                </Text>
                <View style={styles.metricValues}>
                  {metric.weight && <Text>Weight: {metric.weight} kg</Text>}
                  {metric.blood_pressure && (
                    <Text>BP: {metric.blood_pressure}</Text>
                  )}
                  {metric.sleep_hours && (
                    <Text>Sleep: {metric.sleep_hours}h</Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noMetrics}>
              You haven&apos;t logged any metrics yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  motivation: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 16,
    color: "#da2978",
  },
  latestWeight: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 12,
  },
  metricsSection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricDate: {
    fontSize: 12,
    color: "#777",
  },
  metricValues: {
    flexDirection: "row",
    gap: 12,
  },
  noMetrics: {
    textAlign: "center",
    color: "#777",
    paddingVertical: 16,
  },
});
