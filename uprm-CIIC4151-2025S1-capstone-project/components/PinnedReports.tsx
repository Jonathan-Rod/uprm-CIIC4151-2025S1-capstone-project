import { StyleSheet, View } from "react-native";
import { Text, Card } from "react-native-paper";
import type { ReportData } from "@/types/interfaces";
import { ReportStatus } from "@/types/interfaces";
import { useAppColors } from "@/hooks/useAppColors";

interface PinnedReportsProps {
  reports: ReportData[];
}

export default function PinnedReports({ reports }: PinnedReportsProps) {
  const { colors } = useAppColors();

  if (reports.length === 0) return null;

  const getStatusStyle = (status: ReportStatus) => {
    const baseStyle = {
      fontSize: 12,
      fontWeight: "500" as const,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      overflow: "hidden" as const,
    };

    switch (status) {
      case ReportStatus.OPEN:
        return {
          ...baseStyle,
          backgroundColor: colors.reportStatus.openLight,
          color: colors.reportStatus.open,
        };
      case ReportStatus.IN_PROGRESS:
        return {
          ...baseStyle,
          backgroundColor: colors.reportStatus.in_progressLight,
          color: colors.reportStatus.in_progress,
        };
      case ReportStatus.RESOLVED:
        return {
          ...baseStyle,
          backgroundColor: colors.reportStatus.resolvedLight,
          color: colors.reportStatus.resolved,
        };
      case ReportStatus.CLOSED:
        return {
          ...baseStyle,
          backgroundColor: colors.reportStatus.closedLight,
          color: colors.reportStatus.closed,
        };
      case ReportStatus.DENIED:
        return {
          ...baseStyle,
          backgroundColor: colors.reportStatus.deniedLight,
          color: colors.reportStatus.denied,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.chip.background,
          color: colors.chip.text,
        };
    }
  };

  const formatStatus = (status: ReportStatus) => {
    return status
      .replace("_", " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const styles = createStyles(colors);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          📌 Pinned Reports ({reports.length})
        </Text>

        <View style={styles.reportsList}>
          {reports.map((report) => {
            const statusStyle = getStatusStyle(report.status);

            return (
              <View key={report.id} style={styles.reportItem}>
                <Text style={styles.reportTitle} numberOfLines={2}>
                  {report.title}
                </Text>
                <View style={styles.reportMeta}>
                  <Text style={[styles.status, statusStyle]}>
                    {formatStatus(report.status)}
                  </Text>
                  <Text style={styles.date}>
                    {new Date(report.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            );
          })}
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
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      backgroundColor: colors.card,
    },
    title: {
      fontWeight: "600",
      marginBottom: 16,
      fontSize: 16,
      color: colors.text,
    },
    reportsList: {
      gap: 12,
    },
    reportItem: {
      padding: 12,
      backgroundColor: colors.backgroundMuted,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.info,
    },
    reportTitle: {
      fontWeight: "500",
      marginBottom: 8,
      lineHeight: 18,
      color: colors.text,
    },
    reportMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    status: {
      // Styles applied dynamically in getStatusStyle
    },
    date: {
      fontSize: 12,
      color: colors.textMuted,
    },
  });
