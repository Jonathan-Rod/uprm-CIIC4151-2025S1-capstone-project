import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useRouter } from "expo-router";

import { getToken } from "@/utils/auth";
import { useAuth, AuthProvider } from "@/context/AuthContext";

import {
  paperLightTheme,
  paperDarkTheme,
} from "@/theme/paper-theme";
import {
  navigationLightTheme,
  navigationDarkTheme,
} from "@/theme/navigation-theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

// This inner component uses AuthContext
function AppContent() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? paperDarkTheme : paperLightTheme;
  const navigationTheme =
    colorScheme === "dark" ? navigationDarkTheme : navigationLightTheme;

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      // if neither a token nor user info exists → redirect to login
      if (!token || !user) {
        router.replace("/");
      }
    };
    checkAuth();
  }, [user, router]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen name="sign-screen" options={{ headerShown: false }} />
            {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(modals)/modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            <Stack.Screen
              name="(modals)/report-form"
              options={{ presentation: "modal", title: "Report Form" }}
            />
          </Stack>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// Wrap everything with AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
