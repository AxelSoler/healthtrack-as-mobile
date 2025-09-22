import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { MetricChart } from "@/components/charts/MetricChart";
import { MetricForm } from "@/components/forms/MetricForm";
import GoalsCard from "@/components/cards/GoalsCard";
import { useUser } from "@/context/UserContext";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useNotification } from "@/context/NotificationContext";
import Loading from "@/components/Loading";

export default function GoalsScreen() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState("");
  const { user } = useUser();
  const notification = useNotification();

  const fetchUserData = useCallback(async () => {
    if (!user) {
      return;
    }
    
    setLoading(true);
    const { data: metricsData } = await supabase
      .from("metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: profileData } = await supabase
      .from("profiles")
      .select("weight_goal")
      .eq("id", user.id)
      .single();

    if (metricsData) setMetrics(metricsData);
    if (profileData) setProfile(profileData);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSetGoal = async () => {
    const goal = parseFloat(newGoal);
    if (!isNaN(goal) && user?.id) {
      const { error } = await supabase
        .from("profiles")
        .update({ weight_goal: goal })
        .eq("id", user.id);

      if (error) {
        notification.showNotification(
          `Error setting goal: ${error.message}`,
          "error"
        );
      } else {
        setProfile({ ...profile, weight_goal: goal });
        setIsModalOpen(false);
        notification.showNotification("Goal updated successfully!", "success");
      }
    }
  };

  const weightGoal = profile?.weight_goal || 0;

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Your Goals</Text>
            <PrimaryButton
              title={weightGoal > 0 ? "Update Goal" : "Set a goal!"}
              onPress={() => setIsModalOpen(true)}
            />
          </View>

          <GoalsCard metrics={metrics} profile={profile} />

          <View style={styles.chartContainer}>
            <MetricChart metrics={metrics} />
          </View>

          <MetricForm onSuccess={fetchUserData} />
        </View>
      </ScrollView>

      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Your Weight Goal</Text>
            <TextInput
              keyboardType="numeric"
              value={newGoal}
              onChangeText={setNewGoal}
              placeholder="Enter your goal weight"
              style={styles.input}
            />
            <PrimaryButton title="Save Goal" onPress={handleSetGoal} />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalOpen(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 16 },
  inner: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  goalButton: {
    backgroundColor: "#1a73e8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  goalButtonText: { color: "#fff", fontWeight: "bold" },
  chartContainer: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  cancelButton: {
    padding: 10,
    marginTop: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  cancelButtonText: { textAlign: "center", color: "#555" },
});
