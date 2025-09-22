import { View, StyleSheet, Dimensions } from "react-native";
import { useNotification } from "@/context/NotificationContext";
import { ThemedText } from "@/components/themed-text";

const { width } = Dimensions.get("window");

export default function Notification() {
  const { notification } = useNotification();

  if (!notification) {
    return null;
  }

  const { message, type } = notification;

  const containerStyle = [styles.container, styles[type]];

  return (
    <View style={containerStyle}>
      <ThemedText>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    width: width * 0.9,
    alignSelf: "center",
    padding: 15,
    borderRadius: 10,
    zIndex: 1000,
    elevation: 10,
  },
  success: {
    backgroundColor: "#4CAF50",
  },
  error: {
    backgroundColor: "#F44336",
  },
  alert: {
    backgroundColor: "#FF9800",
  },
});
