import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { useState, useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { UserProvider } from "@/context/UserContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Notification from "@/components/notifications/Notification";

export const unstable_settings = {
  anchor: "(tabs)",
};
export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for changes to auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Redirects depending on whether the user is signed in
    if (session && inAuthGroup) {
      // User is signed in and in the auth group, redirect to app
      router.replace("/dashboard");
    } else if (!session && !inAuthGroup) {
      // User is not signed in and not in the auth group, redirect to auth
      router.replace("/login");
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return <View />;
  }

  // Slot renders the active route
  return (
    <NotificationProvider>
      <UserProvider user={session?.user ?? null}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Slot />
          <Notification />
        </ThemeProvider>
      </UserProvider>
    </NotificationProvider>
  );
}
