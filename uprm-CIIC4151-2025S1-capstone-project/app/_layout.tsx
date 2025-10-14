// TODO
// Hide header in the login page
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  navigationDarkTheme,
  navigationLightTheme,
} from "@/theme/navigation-theme";
import { paperDarkTheme, paperLightTheme } from "@/theme/paper-theme";
import { getToken } from "@/utils/auth";
import { ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/utils/context/AuthContext";

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
  }, [router]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen name="sign-screen" options={{ headerShown: false }} />
            {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(modals)/about-us"
              options={{ presentation: "modal", title: "about-us" }}
            />
            <Stack.Screen
              name="(modals)/contact-support"
              options={{ presentation: "modal", title: "contact-support" }}
            />
            <Stack.Screen
              name="(modals)/delete-account"
              options={{ presentation: "modal", title: "delete-account" }}
            />
            <Stack.Screen
              name="(modals)/logout"
              options={{ presentation: "modal", title: "logout" }}
            />
            <Stack.Screen
              name="(modals)/modal"
              options={{ presentation: "modal", title: "modal" }}
            />
            <Stack.Screen
              name="(modals)/privacy-policy"
              options={{ presentation: "modal", title: "privacy-policy" }}
            />
            <Stack.Screen
              name="(modals)/report-form"
              options={{ presentation: "modal", title: "report-form" }}
            />
            <Stack.Screen
              name="(modals)/report-view"
              options={{ presentation: "modal", title: "report-view" }}
            />
            <Stack.Screen
              name="(modals)/terms-and-conditions"
              options={{ presentation: "modal", title: "terms-and-conditions" }}
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
