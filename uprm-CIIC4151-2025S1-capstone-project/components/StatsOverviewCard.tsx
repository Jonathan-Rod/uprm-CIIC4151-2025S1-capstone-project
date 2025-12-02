// TODO REfactor to look similar as ReportStats displaying the all status numbers
import { Card, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useAppColors } from "@/hooks/useAppColors";

interface StatsCardProps {
  stats: any;
}

export default function StatsOverviewCard({ stats }: StatsCardProps) {
  const { colors } = useAppColors();
  const styles = createStyles(colors);

  if (!stats) return null;

  return (
    <Card style={styles.statsCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          System Overview
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statNumber}>
              {stats.total_reports || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Reports
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statNumber}>
              {stats.open_reports || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Open
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statNumber}>
              {stats.resolved_reports || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Resolved
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    statsCard: {
      marginBottom: 16,
      backgroundColor: colors.surface,
    },
    sectionTitle: {
      fontWeight: "bold",
      marginBottom: 16,
      color: colors.text,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statNumber: {
      fontWeight: "bold",
      color: colors.text,
    },
    statLabel: {
      marginTop: 4,
      color: colors.textSecondary,
    },
  });
