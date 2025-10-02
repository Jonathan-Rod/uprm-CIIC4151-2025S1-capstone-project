import {
  DarkTheme as NavigationDark,
  DefaultTheme as NavigationLight,
} from "@react-navigation/native";
import { Colors } from "@/constants/theme";

export const navigationLightTheme = {
  ...NavigationLight,
  colors: {
    ...NavigationLight.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    text: Colors.light.text,
    card: Colors.light.card,
    border: Colors.light.icon,
    notification: Colors.light.alert,
  },
};


export const navigationDarkTheme = {
  ...NavigationDark,
  colors: {
    ...NavigationDark.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    text: Colors.dark.text,
    card: Colors.dark.card,
    border: Colors.dark.icon,
    notification: Colors.dark.alert,
  },
};
