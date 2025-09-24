import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import Loading from "@/components/Loading";
import { Metric } from "@/types";
import { IconSymbol } from "@/components/ui/icon-symbol";

const motivationalMessages = [
  "Every step counts! Keep going on your wellness journey.",
  "Your health is your greatest wealth. Invest in it every day.",
  "Small changes, big results. You can do it!",
  "Today is a new opportunity to be the best version of yourself.",
  "Don't give up. Progress, not perfection, is what matters.",
];

export default function DashboardScreen() {
  const [randomMessage, setRandomMessage] = useState("");
  const [latestWeight, setLatestWeight] = useState<Metric | null>(null);
  const [latestSleepHours, setLatestSleepHours] = useState<Metric | null>(
    null
  );
  const [latestBloodPressure, setLatestBloodPressure] = useState<
    Metric | null
  >(null);
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
    const getLatestMetrics = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: weightData } = await supabase
          .from("metrics")
          .select("*")
          .eq("user_id", user.id)
          .not("weight", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        setLatestWeight(weightData);

        const { data: sleepData } = await supabase
          .from("metrics")
          .select("*")
          .eq("user_id", user.id)
          .not("sleep_hours", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        setLatestSleepHours(sleepData);

        const { data: bpData } = await supabase
          .from("metrics")
          .select("*")
          .eq("user_id", user.id)
          .not("blood_pressure", "is", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        setLatestBloodPressure(bpData);
      } catch (error) {
        console.error("Error fetching latest metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    getLatestMetrics();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Health Summary</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <IconSymbol name="scalemass" style={styles.summaryIcon} size={30} color={"#da2978"} />
              <Text style={styles.summaryLabel}>Weight</Text>
              <Text style={styles.summaryValue}>
                {latestWeight ? `${latestWeight.weight} kg` : "N/A"}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <IconSymbol name="bed.double" style={styles.summaryIcon} size={30} color={"#da2978"} />
              <Text style={styles.summaryLabel}>Last Sleep</Text>
              <Text style={styles.summaryValue}>
                {latestSleepHours ? `${latestSleepHours.sleep_hours} h` : "N/A"}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <IconSymbol name="heart" style={styles.summaryIcon} size={30} color={"#da2978"} />
              <Text style={styles.summaryLabel}>Blood Pressure</Text>
              <Text style={styles.summaryValue}>
                {latestBloodPressure
                  ? latestBloodPressure.blood_pressure
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.motivation}>{randomMessage}</Text>
          <PrimaryButton
            title="Define Your Goals"
            onPress={() => router.push("/(tabs)/goals")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  motivation: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 36,
    color: "#da2978",
  },
  summarySection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryIcon: {
    marginBottom: 12,
    color: "#da2978",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
});
