import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// import { useColorScheme } from "@/hooks/use-color-scheme";
import { useColorScheme } from "../hooks/use-color-scheme"; // modified

import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useRouter } from "expo-router";

// import { getToken } from "@/utils/auth";
import { getToken } from "../utils/auth"; // modified

import { paperLightTheme, paperDarkTheme } from "../theme/paper-theme";
import {
  navigationLightTheme,
  navigationDarkTheme,
} from "../theme/navigation-theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? paperDarkTheme : paperLightTheme;
  const navigationTheme =
    colorScheme === "dark" ? navigationDarkTheme : navigationLightTheme;

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/"); // Redirect to SignScreen
      }
    };
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            <Stack.Screen
              name="report-modal"
              options={{ presentation: "modal", title: "Report Details" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
