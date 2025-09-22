import { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { supabase } from "@/utils/supabase";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { Link } from "expo-router";
import { useNotification } from "@/context/NotificationContext";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const notification = useNotification();

  async function handleSignUp() {
    if (!email || !password) {
      notification.showNotification(
        "Please enter both email and password",
        "error"
      );
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      notification.showNotification(`Sign up error: ${error.message}`, "error");
    } else if (!data.session) {
      notification.showNotification(
        "Sign up successful! Please check your email to confirm your account.",
        "success"
      );
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <PrimaryButton
        title={loading ? "Creating account..." : "Create Account"}
        onPress={handleSignUp}
        disabled={loading}
      />
      <Link href="/login" style={styles.link}>
        Already have an account? Log in
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    textAlign: "center",
    color: "blue",
  },
});
