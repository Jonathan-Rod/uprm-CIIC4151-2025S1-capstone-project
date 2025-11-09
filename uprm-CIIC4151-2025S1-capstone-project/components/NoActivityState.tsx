import { View, Text, StyleSheet } from "react-native";
import { useAppColors } from "@/hooks/useAppColors";
import {} from "react-native";

export default function NoActivityState() {
  const { colors } = useAppColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>No activity data available yet.</Text>
      <Text style={styles.noDataSubtext}>
        Start creating reports to see your activity here.
      </Text>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    noDataContainer: {
      alignItems: "center",
      paddingVertical: 30,
    },
    noDataText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    noDataSubtext: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: "center",
    },
  });
