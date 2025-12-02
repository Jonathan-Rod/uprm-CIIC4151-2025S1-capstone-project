// TODO REfactor to ReportStats displaying the all status numbers
import { StyleSheet, View } from "react-native";
import { Text, Card, Icon } from "react-native-paper";
import type { ReportStatsProps } from "@/types/interfaces";
import { useAppColors } from "@/hooks/useAppColors";

export default function ReportStats({
  filed,
  resolved,
  pending,
  pinned,
  lastReportDate,
}: ReportStatsProps) {
  const { colors } = useAppColors();

  const stats = [
    {
      label: "Filed",
      value: filed,
      color: colors.primary,
    },
    {
      label: "Resolved",
      value: resolved,
      color: colors.success,
    },
    {
      label: "Pending",
      value: pending,
      color: colors.warning,
    },
    {
      label: "Pinned",
      value: pinned,
      color: "#9C27B0",
    },
  ];
  // TODO Do a better rate assigning points to each status and then calculate the resolutation rate based on the total points
  const resolutionRate = filed > 0 ? Math.round((resolved / filed) * 100) : 0;

  const styles = createStyles(colors);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Icon source="chart-bar" size={22} color={colors.primary} />
          <Text variant="titleMedium" style={styles.title}>
            Report Statistics
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              {/* <Text style={styles.statIcon}>{stat.icon}</Text> */}
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Resolution Rate</Text>
            <Text
              style={[
                styles.resolutionRate,
                {
                  color: resolutionRate >= 50 ? colors.success : colors.warning,
                },
              ]}
            >
              {resolutionRate}%
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Last Report</Text>
            <Text style={styles.lastReport}>
              {lastReportDate
                ? new Date(lastReportDate).toLocaleDateString()
                : "Never"}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      marginBottom: 8,
      elevation: 2,
      boxShadow: `0px 1px 2px ${colors.border || "#0000001a"}`,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      marginBottom: 20,
    },
    title: {
      fontWeight: "600",
      fontSize: 16,
      color: colors.text,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statIcon: {
      fontSize: 20,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      paddingTop: 16,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    footerItem: {
      alignItems: "center",
    },
    footerLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 4,
    },
    resolutionRate: {
      fontSize: 14,
      fontWeight: "600",
    },
    lastReport: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
  });
