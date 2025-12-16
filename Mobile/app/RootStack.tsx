import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { restoreSession } from "@/store/slices/auth.slice";
import { View, ActivityIndicator } from "react-native";

function RootStack() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  // Restore session on app startup
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Navigation guard
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";
    // const inCanvasGroup = segments[0] === "(canvas)"; // ❌ Don't protect this

    // Only protect Admin and Tabs (Dashboard) routes
    const protectedRoutes = [inAdminGroup];
    const isInProtectedRoute = protectedRoutes.some((route) => route);

    if (!isAuthenticated && isInProtectedRoute) {
      console.log("🚫 Not authenticated, redirecting to login");
      router.replace("/(auth)/loginPage");
    } else if (isAuthenticated && inAuthGroup) {
      console.log("✅ Authenticated, redirecting to dashboard");
      router.replace("/(admin)/Dashboard");
    }
  }, [isAuthenticated, segments, isLoading, router]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(guest)" />
        <Stack.Screen name="(canvas)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default RootStack;