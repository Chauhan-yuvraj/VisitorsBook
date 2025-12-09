import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { restoreSession } from '@/store/slices/auth.slice';
import { View, ActivityIndicator } from 'react-native';

function RootStack() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  
  // ✅ FIX: Select values individually to prevent reference warnings
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  // Restore session on app startup
  useEffect(() => {
    console.log('🔄 Checking for existing session...');
    dispatch(restoreSession());
  }, [dispatch]);

  // Navigation guard - redirect based on auth state
  useEffect(() => {
    if (isLoading) {
      console.log('⏳ Loading auth state...');
      return; // Wait for session restoration to complete
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inAdminGroup = segments[0] === '(admin)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inCanvasGroup = segments[0] === '(canvas)';

    console.log('📍 Current route:', segments[0], '| Auth:', isAuthenticated);

    // Protected routes that require authentication
    const protectedRoutes = [inAdminGroup, inTabsGroup, inCanvasGroup];
    const isInProtectedRoute = protectedRoutes.some(route => route);

    if (!isAuthenticated && isInProtectedRoute) {
      // User is not authenticated but trying to access protected routes
      console.log('🚫 Not authenticated, redirecting to login');
      router.replace('/(auth)/loginPage');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but on login/signup page
      console.log('✅ Authenticated, redirecting to home');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading, router]);

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </View>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(guest)" options={{ headerShown: false }} />
        <Stack.Screen name="(canvas)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default RootStack;