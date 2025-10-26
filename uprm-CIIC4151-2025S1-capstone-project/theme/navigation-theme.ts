import {
  DarkTheme as NavigationDark,
  DefaultTheme as NavigationLight,
} from "@react-navigation/native";
import { Colors } from "@/constants/theme";

export const navigationLightTheme = {
  ...NavigationLight,
  colors: {
    ...NavigationLight.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.error,
  },
};

export const navigationDarkTheme = {
  ...NavigationDark,
  colors: {
    ...NavigationDark.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.error,
  },
};

export type NavigationTheme =
  | typeof navigationLightTheme
  | typeof navigationDarkTheme;
