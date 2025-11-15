import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
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
  const [refreshing, setRefreshing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");
      setImageError(false);
      const data = await getReport(Number(id));
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to load report.");
      console.error("Error loading report:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) loadReport();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReport();
  };

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

  const getStatusText = (status: string) =>
    status.replace("_", " ").toUpperCase();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const styles = createStyles(colors);

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading report...</Text>
      </ThemedView>
    );
  }

  const hasValidImage =
    report?.image_url &&
    !report.image_url.includes("via.placeholder.com") &&
    !report.image_url.includes("No+Image+Available");

  const ErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorText}>{error}</Text>
      <Button
        mode="contained"
        onPress={loadReport}
        style={styles.retryButton}
        buttonColor={colors.primary}
      >
        Try Again
      </Button>
      <Button
        mode="outlined"
        onPress={() => router.back()}
        textColor={colors.text}
        style={styles.backButton}
      >
        Go Back
      </Button>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={() => router.back()}
          icon="arrow-left"
          textColor={colors.text}
          compact
        >
          Back
        </Button>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <ThemedText type="title" style={styles.title}>
          Report Details
        </ThemedText>

        {error ? (
          <ErrorState />
        ) : report ? (
          <View style={styles.reportContent}>
            {/* Image Display */}
            {hasValidImage && !imageError && (
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: report.image_url as string }}
                  style={styles.fullImage}
                  resizeMode="contain"
                  onError={() => setImageError(true)}
                />
              </View>
            )}

            {hasValidImage && imageError && (
              <View style={[styles.imageWrap, styles.imageError]}>
                <Text style={styles.imageErrorText}>Failed to load image</Text>
              </View>
            )}

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

            <View style={styles.metaSection}>
              <Text variant="labelLarge" style={styles.metaLabel}>
                Category:
              </Text>
              <Text variant="bodyMedium" style={styles.metaText}>
                {report.category}
              </Text>
            </View>

            <View style={styles.metaSection}>
              <Text variant="labelLarge" style={styles.metaLabel}>
                Created:
              </Text>
              <Text variant="bodyMedium" style={styles.metaText}>
                {formatDate(report.created_at)}
              </Text>
            </View>

            {report.resolved_at && (
              <View style={styles.metaSection}>
                <Text variant="labelLarge" style={styles.metaLabel}>
                  Resolved:
                </Text>
                <Text variant="bodyMedium" style={styles.metaText}>
                  {formatDate(report.resolved_at)}
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
            <Button
              mode="outlined"
              onPress={() => router.back()}
              textColor={colors.text}
              style={styles.backButton}
            >
              Go Back
            </Button>
          </View>
        )}
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
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
      textAlign: "center",
      color: colors.textSecondary,
    },
    reportContent: {
      flex: 1,
    },
    imageWrap: {
      width: "100%",
      height: 280,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 20,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
    },
    fullImage: {
      width: "100%",
      height: "100%",
    },
    imageError: {
      backgroundColor: colors.surfaceVariant,
    },
    imageErrorText: {
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
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
      color: colors.textSecondary,
    },
    errorContainer: {
      alignItems: "center",
      paddingVertical: 32,
    },
    errorIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    errorText: {
      color: colors.error,
      textAlign: "center",
      marginBottom: 16,
      fontSize: 16,
    },
    retryButton: {
      marginBottom: 12,
      minWidth: 120,
    },
    backButton: {
      minWidth: 120,
    },
  });
