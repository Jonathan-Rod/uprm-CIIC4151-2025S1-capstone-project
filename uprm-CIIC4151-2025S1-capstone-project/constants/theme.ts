/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';
const tintColorLight = '#0077B6';
const tintColorDark = '#90E0EF';

export const Colors = {
  light: {
    text: '#1E1E1E',
    background: '#F8F9FA',
    tint: tintColorLight,
    icon: '#495057',
    tabIconDefault: '#ADB5BD',
    tabIconSelected: tintColorLight,
    alert: '#D00000',
    success: '#2D6A4F',
    card: '#FFFFFF',
  },
  dark: {
    text: '#E9ECEF',
    background: '#121212',
    tint: tintColorDark,
    icon: '#CED4DA',
    tabIconDefault: '#6C757D',
    tabIconSelected: tintColorDark,
    alert: '#FF6B6B',
    success: '#95D5B2',
    card: '#1F1F1F',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
