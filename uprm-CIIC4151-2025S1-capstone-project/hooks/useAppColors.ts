import { ColorPalette, Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useAppColors() {
  const colorScheme = useColorScheme() || "light";
  const currentColors = Colors[colorScheme];

  return {
    colors: currentColors,
    colorScheme,
    isDark: colorScheme === "dark",
    palette: ColorPalette,
  };
}
