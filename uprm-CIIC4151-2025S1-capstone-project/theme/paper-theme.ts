import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { Colors } from "@/constants/theme";

export const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    text: Colors.light.text,
    surface: "#ffffff",
  },
};

export const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    text: Colors.dark.text,
    surface: "#151718",
  },
};
