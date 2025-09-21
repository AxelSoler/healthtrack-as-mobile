import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
// import { useNotification } from "@/contexts/NotificationContext";
import { supabase } from "@/utils/supabase";
import PrimaryButton from "../buttons/PrimaryButton";

async function addMetricByType(
  type: "weight" | "blood_pressure" | "sleep_hours",
  value: string | number
): Promise<{ error?: string; success?: boolean }> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to add a metric." };
  }

  const metric: Record<string, string | number> = { user_id: user.id };
  metric[type] = value;

  const { error } = await supabase.from("metrics").insert([metric]);

  if (error) {
    console.error(error);
    return { error: "Failed to save metric. Please try again." };
  }

  return { success: true };
}

// 🔹 Subcomponente para cada sección
function MetricFormSection({
  action,
  label,
  inputType,
  // onSuccess,
}: {
  action: (value: string | number) => Promise<{ error?: string; success?: boolean }>;
  label: string;
  inputType: "text" | "number";
  // onSuccess?: () => void;
}) {
  const [value, setValue] = useState("");
  // const { showNotification } = useNotification();

  const handleSubmit = async () => {
    const parsedValue =
      inputType === "number" ? Number(value) : value.trim();

    if (!parsedValue) {
      // showNotification("Please enter a valid value", "error");
      return;
    }

    const res = await action(parsedValue);

    if (res.error) {
      // showNotification(res.error, "error");
    } else if (res.success) {
      // showNotification("Metric saved successfully!", "success");
      setValue("");
      // onSuccess?.();
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={label}
        keyboardType={inputType === "number" ? "numeric" : "default"}
        style={styles.input}
      />
      <PrimaryButton title="Save" onPress={handleSubmit} />
    </View>
  );
}

export function MetricForm() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add latest metrics</Text>
      <MetricFormSection
        action={(value) => addMetricByType("weight", value)}
        label="Weight (lbs)"
        inputType="number"
        // onSuccess={onSuccess}
      />
      <MetricFormSection
        action={(value) => addMetricByType("blood_pressure", value)}
        label="Blood Pressure (e.g., 120/80)"
        inputType="text"
        // onSuccess={onSuccess}
      />
      <MetricFormSection
        action={(value) => addMetricByType("sleep_hours", value)}
        label="Sleep (hours)"
        inputType="number"
        // onSuccess={onSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginVertical: 14,
  },
});
