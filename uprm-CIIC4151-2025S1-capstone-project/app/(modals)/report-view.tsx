import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, Text, Chip, ActivityIndicator } from "react-native-paper";
import { useEffect, useState } from "react";
import { getReport } from "@/utils/api";
import type { ReportData } from "@/types/interfaces";
import { useAppColors } from "@/hooks/useAppColors";

export default function ReportViewModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useAppColors();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await getReport(Number(id));
        setReport(data);
      } catch (err: any) {
        setError(err.message || "Failed to load report.");
        console.error("Error loading report:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadReport();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return colors.reportStatus.open;
      case "in_progress":
        return colors.reportStatus.in_progress;
      case "resolved":
        return colors.reportStatus.resolved;
      case "denied":
        return colors.reportStatus.denied;
      case "closed":
        return colors.reportStatus.closed;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    return status.replace("_", " ").toUpperCase();
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading report...</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>
          Report Details
        </ThemedText>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.backButton}
              textColor={colors.text}
            >
              Go Back
            </Button>
          </View>
        ) : report ? (
          <View style={styles.reportContent}>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                { borderColor: getStatusColor(report.status) },
              ]}
              textStyle={[
                styles.statusText,
                { color: getStatusColor(report.status) },
              ]}
            >
              {getStatusText(report.status)}
            </Chip>

            <Text variant="headlineSmall" style={styles.reportTitle}>
              {report.title}
            </Text>

            <Text variant="bodyMedium" style={styles.description}>
              {report.description}
            </Text>

            {report.category && (
              <View style={styles.metaSection}>
                <Text variant="labelLarge" style={styles.metaLabel}>
                  Category:
                </Text>
                <Text variant="bodyMedium" style={styles.metaText}>
                  {report.category}
                </Text>
              </View>
            )}

            <View style={styles.metaSection}>
              <Text variant="labelLarge" style={styles.metaLabel}>
                Created:
              </Text>
              <Text variant="bodyMedium" style={styles.metaText}>
                {new Date(report.created_at).toLocaleString()}
              </Text>
            </View>

            {report.resolved_at && (
              <View style={styles.metaSection}>
                <Text variant="labelLarge" style={styles.metaLabel}>
                  Resolved:
                </Text>
                <Text variant="bodyMedium" style={styles.metaText}>
                  {new Date(report.resolved_at).toLocaleString()}
                </Text>
              </View>
            )}

            {report.rating && report.rating > 0 && (
              <View style={styles.metaSection}>
                <Text variant="labelLarge" style={styles.metaLabel}>
                  Rating:
                </Text>
                <Text variant="bodyMedium" style={styles.metaText}>
                  {report.rating} / 5
                </Text>
              </View>
            )}

            {report.location && (
              <View style={styles.metaSection}>
                <Text variant="labelLarge" style={styles.metaLabel}>
                  Location ID:
                </Text>
                <Text variant="bodyMedium" style={styles.metaText}>
                  {report.location_id}
                </Text>
              </View>
            )}

            {report.created_by && (
              <View style={styles.metaSection}>
                <Text variant="labelLarge" style={styles.metaLabel}>
                  Reported By:
                </Text>
                <Text variant="bodyMedium" style={styles.metaText}>
                  User #{report.created_by}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.metaText}>Report not found.</Text>
          </View>
        )}

        {/* <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.backButton}
          textColor={colors.text}
        >
          Back
        </Button> */}
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    title: {
      marginBottom: 24,
      textAlign: "center",
      color: colors.text,
    },
    loadingText: {
      marginTop: 16,
      color: colors.text,
    },
    reportContent: {
      flex: 1,
    },
    statusChip: {
      alignSelf: "flex-start",
      marginBottom: 16,
      backgroundColor: "transparent",
    },
    statusText: {
      fontWeight: "bold",
      fontSize: 12,
    },
    reportTitle: {
      marginBottom: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    description: {
      marginBottom: 24,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    metaSection: {
      marginBottom: 16,
    },
    metaLabel: {
      fontWeight: "bold",
      marginBottom: 4,
      color: colors.text,
    },
    metaText: {
      color: colors.text,
    },
    errorContainer: {
      alignItems: "center",
      paddingVertical: 32,
    },
    errorText: {
      color: colors.error,
      textAlign: "center",
      marginBottom: 16,
    },
    backButton: {
      marginTop: 24,
      alignSelf: "center",
    },
  });
