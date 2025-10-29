/**
 * Enhanced design system colors and typography definitions
 * Improved color palette with better contrast, accessibility, and visual harmony
 * Supports light and dark mode with consistent naming
 */

import { Platform } from "react-native";

// Core brand colors - Enhanced for better visual appeal
const primaryLight = "#2563EB"; // Vibrant blue (main brand)
// const primaryDark = "#3B82F6"; // Softer blue for dark mode
const accentLight = "#8B5CF6"; // Rich purple (accent)
// const accentDark = "#A78BFA"; // Muted purple for dark mode

// Extended color palette with improved balance and accessibility
const extendedColors = {
  // Primary colors - Enhanced blue palette
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: primaryLight, // #2563EB
    600: "#1D4ED8",
    700: "#1E40AF",
    800: "#1E3A8A",
    900: "#1E3A8A",
  },

  // Secondary colors - Enhanced purple palette
  secondary: {
    50: "#FAF5FF",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: accentLight, // #8B5CF6
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
  },

  // Tertiary colors - Emerald green palette
  tertiary: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
  },

  // Neutral colors - Improved contrast ratios
  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  // Status colors - Better distinction
  success: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E", // Brighter green for better visibility
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
  },

  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  error: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
  },

  // Info colors - Distinct from success
  info: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6", // Blue for info
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },

  // Report status colors - More vibrant and distinct
  reportStatus: {
    open: "#2563EB", // Blue
    in_progress: "#F59E0B", // Amber
    resolved: "#10B981", // Emerald
    denied: "#EF4444", // Red
    closed: "#6B7280", // Gray
  },

  // Category colors - More vibrant and accessible
  reportCategory: {
    pothole: "#8B5CF6", // Purple
    street_light: "#F59E0B", // Amber
    traffic_signal: "#EF4444", // Red
    road_damage: "#F97316", // Orange
    sanitation: "#10B981", // Emerald
    other: "#6B7280", // Gray
  },

  // Department colors - Enhanced contrast
  department: {
    DTOP: "#2563EB", // Blue
    LUMA: "#F59E0B", // Amber
    AAA: "#EF4444", // Red
    DDS: "#10B981", // Emerald
  },
};

// Semantic color tokens - Improved contrast and accessibility
export const Colors = {
  light: {
    // Primary colors
    primary: extendedColors.primary[600], // Better contrast
    onPrimary: "#FFFFFF",
    primaryContainer: extendedColors.primary[100],
    onPrimaryContainer: extendedColors.primary[900],

    // Secondary colors
    secondary: extendedColors.secondary[600],
    onSecondary: "#FFFFFF",
    secondaryContainer: extendedColors.secondary[100],
    onSecondaryContainer: extendedColors.secondary[900],

    // Tertiary colors
    tertiary: extendedColors.tertiary[600],
    onTertiary: "#FFFFFF",
    tertiaryContainer: extendedColors.tertiary[100],
    onTertiaryContainer: extendedColors.tertiary[900],

    // Surface colors
    background: extendedColors.neutral[50],
    surface: "#FFFFFF",
    onSurface: extendedColors.neutral[900],
    surfaceVariant: extendedColors.neutral[100],
    onSurfaceVariant: extendedColors.neutral[700],

    // Card colors
    card: "#FFFFFF",
    cardVariant: extendedColors.neutral[50],

    // Text colors - Improved contrast ratios
    text: extendedColors.neutral[900],
    textSecondary: extendedColors.neutral[700],
    textMuted: extendedColors.neutral[600],
    textInverse: "#FFFFFF",
    textDisabled: extendedColors.neutral[400],

    // Interactive elements
    tint: extendedColors.primary[600],
    icon: extendedColors.neutral[700],
    tabIconDefault: extendedColors.neutral[500],
    tabIconSelected: extendedColors.primary[600],

    // Border and divider
    border: extendedColors.neutral[300],
    borderLight: extendedColors.neutral[200],
    outline: extendedColors.neutral[400],
    outlineVariant: extendedColors.neutral[200],
    divider: extendedColors.neutral[200],

    // Status colors
    success: extendedColors.success[600],
    successContainer: extendedColors.success[100],
    onSuccess: "#FFFFFF",
    onSuccessContainer: extendedColors.success[900],

    warning: extendedColors.warning[600],
    warningContainer: extendedColors.warning[100],
    onWarning: extendedColors.neutral[900],
    onWarningContainer: extendedColors.warning[900],

    error: extendedColors.error[600],
    errorContainer: extendedColors.error[100],
    onError: "#FFFFFF",
    onErrorContainer: extendedColors.error[900],

    info: extendedColors.info[600],
    infoContainer: extendedColors.info[100],
    onInfo: "#FFFFFF",
    onInfoContainer: extendedColors.info[900],

    // Background variants
    backgroundElevated: "#FFFFFF",
    backgroundMuted: extendedColors.neutral[100],
    backdrop: "rgba(0, 0, 0, 0.4)",

    // Component-specific colors
    chip: {
      background: extendedColors.neutral[100],
      text: extendedColors.neutral[700],
      border: extendedColors.neutral[300],
      selectedBackground: extendedColors.primary[600],
      selectedText: "#FFFFFF",
    },

    button: {
      primary: extendedColors.primary[600],
      primaryPressed: extendedColors.primary[700],
      secondary: extendedColors.neutral[200],
      secondaryPressed: extendedColors.neutral[300],
      danger: extendedColors.error[600],
      dangerPressed: extendedColors.error[700],
      disabled: extendedColors.neutral[300],
      text: "#FFFFFF",
      secondaryText: extendedColors.neutral[700],
      dangerText: "#FFFFFF",
    },

    // Input fields
    input: {
      background: "#FFFFFF",
      border: extendedColors.neutral[300],
      borderFocused: extendedColors.primary[600],
      placeholder: extendedColors.neutral[500],
      text: extendedColors.neutral[900],
      disabledBackground: extendedColors.neutral[100],
      disabledText: extendedColors.neutral[400],
    },

    // Report status colors - Enhanced for better visibility
    reportStatus: {
      open: extendedColors.reportStatus.open,
      openLight: "#DBEAFE",
      in_progress: extendedColors.reportStatus.in_progress,
      in_progressLight: "#FEF3C7",
      resolved: extendedColors.reportStatus.resolved,
      resolvedLight: "#D1FAE5",
      denied: extendedColors.reportStatus.denied,
      deniedLight: "#FEE2E2",
      closed: extendedColors.reportStatus.closed,
      closedLight: "#F3F4F6",
    },

    // Report category colors
    reportCategory: {
      pothole: extendedColors.reportCategory.pothole,
      street_light: extendedColors.reportCategory.street_light,
      traffic_signal: extendedColors.reportCategory.traffic_signal,
      road_damage: extendedColors.reportCategory.road_damage,
      sanitation: extendedColors.reportCategory.sanitation,
      other: extendedColors.reportCategory.other,
    },
  },
  dark: {
    // Primary colors
    primary: extendedColors.primary[400],
    onPrimary: extendedColors.neutral[900],
    primaryContainer: extendedColors.primary[800],
    onPrimaryContainer: extendedColors.primary[100],

    // Secondary colors
    secondary: extendedColors.secondary[400],
    onSecondary: extendedColors.neutral[900],
    secondaryContainer: extendedColors.secondary[800],
    onSecondaryContainer: extendedColors.secondary[100],

    // Tertiary colors
    tertiary: extendedColors.tertiary[400],
    onTertiary: extendedColors.neutral[900],
    tertiaryContainer: extendedColors.tertiary[800],
    onTertiaryContainer: extendedColors.tertiary[100],

    // Surface colors
    background: extendedColors.neutral[900],
    surface: extendedColors.neutral[800],
    onSurface: extendedColors.neutral[50],
    surfaceVariant: extendedColors.neutral[700],
    onSurfaceVariant: extendedColors.neutral[200],

    // Card colors
    card: extendedColors.neutral[800],
    cardVariant: extendedColors.neutral[700],

    // Text colors - Better contrast in dark mode
    text: extendedColors.neutral[50],
    textSecondary: extendedColors.neutral[200],
    textMuted: extendedColors.neutral[400],
    textInverse: extendedColors.neutral[900],
    textDisabled: extendedColors.neutral[600],

    // Interactive elements
    tint: extendedColors.primary[400],
    icon: extendedColors.neutral[200],
    tabIconDefault: extendedColors.neutral[500],
    tabIconSelected: extendedColors.primary[400],

    // Border and divider
    border: extendedColors.neutral[600],
    borderLight: extendedColors.neutral[700],
    outline: extendedColors.neutral[500],
    outlineVariant: extendedColors.neutral[600],
    divider: extendedColors.neutral[700],

    // Status colors
    success: extendedColors.success[400],
    successContainer: extendedColors.success[800],
    onSuccess: extendedColors.neutral[900],
    onSuccessContainer: extendedColors.success[100],

    warning: extendedColors.warning[400],
    warningContainer: extendedColors.warning[800],
    onWarning: extendedColors.neutral[900],
    onWarningContainer: extendedColors.warning[100],

    error: extendedColors.error[400],
    errorContainer: extendedColors.error[800],
    onError: extendedColors.neutral[900],
    onErrorContainer: extendedColors.error[100],

    info: extendedColors.info[400],
    infoContainer: extendedColors.info[800],
    onInfo: extendedColors.neutral[900],
    onInfoContainer: extendedColors.info[100],

    // Background variants
    backgroundElevated: extendedColors.neutral[800],
    backgroundMuted: extendedColors.neutral[700],
    backdrop: "rgba(0, 0, 0, 0.6)",

    // Component-specific colors
    chip: {
      background: extendedColors.neutral[700],
      text: extendedColors.neutral[200],
      border: extendedColors.neutral[600],
      selectedBackground: extendedColors.primary[400],
      selectedText: extendedColors.neutral[900],
    },

    button: {
      primary: extendedColors.primary[400],
      primaryPressed: extendedColors.primary[500],
      secondary: extendedColors.neutral[600],
      secondaryPressed: extendedColors.neutral[500],
      danger: extendedColors.error[400],
      dangerPressed: extendedColors.error[500],
      disabled: extendedColors.neutral[600],
      text: extendedColors.neutral[900],
      secondaryText: extendedColors.neutral[200],
      dangerText: extendedColors.neutral[900],
    },

    // Input fields
    input: {
      background: extendedColors.neutral[700],
      border: extendedColors.neutral[600],
      borderFocused: extendedColors.primary[400],
      placeholder: extendedColors.neutral[500],
      text: extendedColors.neutral[50],
      disabledBackground: extendedColors.neutral[800],
      disabledText: extendedColors.neutral[500],
    },

    // Report status colors - Dark mode variants
    reportStatus: {
      open: extendedColors.primary[400],
      openLight: "#1E3A8A",
      in_progress: extendedColors.warning[400],
      in_progressLight: "#78350F",
      resolved: extendedColors.success[400],
      resolvedLight: "#064E3B",
      denied: extendedColors.error[400],
      deniedLight: "#7F1D1D",
      closed: extendedColors.neutral[500],
      closedLight: "#374151",
    },

    // Report category colors
    reportCategory: {
      pothole: extendedColors.secondary[400],
      street_light: extendedColors.warning[400],
      traffic_signal: extendedColors.error[400],
      road_damage: "#FB923C", // Orange in dark mode
      sanitation: extendedColors.success[400],
      other: extendedColors.neutral[400],
    },
  },
} as const;

// Platform-specific font configurations
export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});

// Type definitions
export type ColorScheme = keyof typeof Colors;
export type FontFamily = keyof typeof Fonts;

// Color palette export for direct access
export const ColorPalette = extendedColors;

// Utility functions for color access
export const getColor = (scheme: ColorScheme, path: string) => {
  const paths = path.split(".");
  let result: any = Colors[scheme];

  for (const p of paths) {
    result = result?.[p];
  }

  return result;
};
