import { Stack } from "expo-router";
import { Image } from "react-native";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 300, height: 300, resizeMode: "contain" }}
          />
        ),
        headerTitleAlign: "center",
        headerTransparent: true,
        headerShadowVisible: false,
      }}
    />
  );
}
