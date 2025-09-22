import { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { supabase } from "@/utils/supabase";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { Link } from "expo-router";
import { useNotification } from "@/context/NotificationContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const notification = useNotification();

  async function handleLogin() {
    if (!email || !password) {
      notification.showNotification(
        "Please enter both email and password",
        "error"
      );
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      notification.showNotification(`Login error: ${error.message}`, "error");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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
        title={loading ? "Loging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
      <Link href="/signup" style={styles.link}>
        Don&apos;t have an account? Sign up
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
