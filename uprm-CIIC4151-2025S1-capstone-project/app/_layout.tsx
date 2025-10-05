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

import { paperLightTheme, paperDarkTheme } from "@/theme/paper-theme";
import { navigationLightTheme, navigationDarkTheme } from "@/theme/navigation-theme";

import { AuthProvider } from "@/context/AuthContext"; // ✅ import AuthProvider

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? paperDarkTheme : paperLightTheme;
  const navigationTheme = colorScheme === "dark" ? navigationDarkTheme : navigationLightTheme;

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.replace("/"); // Redirect to login/sign in page
        }
      } catch (err) {
        console.error("Error checking token:", err);
        router.replace("/"); // fallback to login
      }
    };
    checkAuth();
  }, [router]);

  return (
    <AuthProvider> {/* ✅ Wrap everything in AuthProvider */}
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <ThemeProvider value={navigationTheme}>
            <Stack>
              {/* Hide header for the login/sign-in page */}
              <Stack.Screen name="sign-screen" options={{ headerShown: false }} />

              {/* Tab navigator */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Modals */}
              <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
              <Stack.Screen
                name="report-modal"
                options={{ presentation: "modal", title: "Report Details" }}
              />
            </Stack>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          </ThemeProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
