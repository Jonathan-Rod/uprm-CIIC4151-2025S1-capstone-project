import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { Colors } from "@/constants/theme";

// Common theme properties
const commonThemeProps = {
  roundness: 12,
  version: 3 as const,
};

export const paperLightTheme = {
  ...MD3LightTheme,
  ...commonThemeProps,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors
    primary: Colors.light.primary,
    onPrimary: Colors.light.onPrimary,
    primaryContainer: Colors.light.primaryContainer,
    onPrimaryContainer: Colors.light.onPrimaryContainer,

    // Secondary colors
    secondary: Colors.light.secondary,
    onSecondary: Colors.light.onSecondary,
    secondaryContainer: Colors.light.secondaryContainer,
    onSecondaryContainer: Colors.light.onSecondaryContainer,

    // Tertiary colors
    tertiary: Colors.light.tertiary,
    onTertiary: Colors.light.onTertiary,
    tertiaryContainer: Colors.light.tertiaryContainer,
    onTertiaryContainer: Colors.light.onTertiaryContainer,

    // Surface colors
    background: Colors.light.background,
    surface: Colors.light.surface,
    onSurface: Colors.light.onSurface,
    surfaceVariant: Colors.light.surfaceVariant,
    onSurfaceVariant: Colors.light.onSurfaceVariant,

    // Outline and border
    outline: Colors.light.outline,
    outlineVariant: Colors.light.outlineVariant,

    // Status colors
    error: Colors.light.error,
    onError: Colors.light.onError,
    errorContainer: Colors.light.errorContainer,
    onErrorContainer: Colors.light.onErrorContainer,

    // Custom status colors for RN Paper
    success: Colors.light.success,
    onSuccess: Colors.light.onSuccess,
    successContainer: Colors.light.successContainer,
    onSuccessContainer: Colors.light.onSuccessContainer,

    warning: Colors.light.warning,
    onWarning: Colors.light.onWarning,
    warningContainer: Colors.light.warningContainer,
    onWarningContainer: Colors.light.onWarningContainer,

    info: Colors.light.info,
    onInfo: Colors.light.onInfo,
    infoContainer: Colors.light.infoContainer,
    onInfoContainer: Colors.light.onInfoContainer,

    // Additional properties
    surfaceDisabled: Colors.light.textDisabled,
    onSurfaceDisabled: Colors.light.textDisabled,
    backdrop: Colors.light.backdrop,

    // Elevation
    elevation: {
      level0: "transparent",
      level1: Colors.light.backgroundElevated,
      level2: Colors.light.cardVariant,
      level3: Colors.light.surfaceVariant,
      level4: Colors.light.border,
      level5: Colors.light.textDisabled,
    },
  },
};

export const paperDarkTheme = {
  ...MD3DarkTheme,
  ...commonThemeProps,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors
    primary: Colors.dark.primary,
    onPrimary: Colors.dark.onPrimary,
    primaryContainer: Colors.dark.primaryContainer,
    onPrimaryContainer: Colors.dark.onPrimaryContainer,

    // Secondary colors
    secondary: Colors.dark.secondary,
    onSecondary: Colors.dark.onSecondary,
    secondaryContainer: Colors.dark.secondaryContainer,
    onSecondaryContainer: Colors.dark.onSecondaryContainer,

    // Tertiary colors
    tertiary: Colors.dark.tertiary,
    onTertiary: Colors.dark.onTertiary,
    tertiaryContainer: Colors.dark.tertiaryContainer,
    onTertiaryContainer: Colors.dark.onTertiaryContainer,

    // Surface colors
    background: Colors.dark.background,
    surface: Colors.dark.surface,
    onSurface: Colors.dark.onSurface,
    surfaceVariant: Colors.dark.surfaceVariant,
    onSurfaceVariant: Colors.dark.onSurfaceVariant,

    // Outline and border
    outline: Colors.dark.outline,
    outlineVariant: Colors.dark.outlineVariant,

    // Status colors
    error: Colors.dark.error,
    onError: Colors.dark.onError,
    errorContainer: Colors.dark.errorContainer,
    onErrorContainer: Colors.dark.onErrorContainer,

    // Custom status colors for RN Paper
    success: Colors.dark.success,
    onSuccess: Colors.dark.onSuccess,
    successContainer: Colors.dark.successContainer,
    onSuccessContainer: Colors.dark.onSuccessContainer,

    warning: Colors.dark.warning,
    onWarning: Colors.dark.onWarning,
    warningContainer: Colors.dark.warningContainer,
    onWarningContainer: Colors.dark.onWarningContainer,

    info: Colors.dark.info,
    onInfo: Colors.dark.onInfo,
    infoContainer: Colors.dark.infoContainer,
    onInfoContainer: Colors.dark.onInfoContainer,

    // Additional properties
    surfaceDisabled: Colors.dark.textDisabled,
    onSurfaceDisabled: Colors.dark.textDisabled,
    backdrop: Colors.dark.backdrop,

    // Elevation
    elevation: {
      level0: "transparent",
      level1: Colors.dark.backgroundElevated,
      level2: Colors.dark.cardVariant,
      level3: Colors.dark.surfaceVariant,
      level4: Colors.dark.tabIconDefault,
      level5: Colors.dark.tabIconSelected,
    },
  },
};

export type PaperTheme = typeof paperLightTheme | typeof paperDarkTheme;
