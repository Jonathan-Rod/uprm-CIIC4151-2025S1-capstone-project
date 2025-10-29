import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Text, ActivityIndicator, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import ReportCard from "@/components/ReportCard";
import { getReports } from "@/utils/api";
import type { ReportCategory, ReportData } from "@/types/interfaces";
import { useAppColors } from "@/hooks/useAppColors";

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useAppColors();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const limit = 10;

  const handleExploreReports = async (page = 1, isRefresh = true) => {
    try {
      if (isRefresh) {
        setError("");
        setRefreshing(true);
      } else {
        setIsLoadingMore(true);
      }

      const data = await getReports(page, limit);

      if (isRefresh) {
        setReports(data.reports || []);
      } else {
        setReports((prev) => [...prev, ...(data.reports || [])]);
      }

      setCurrentPage(page);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "Failed to load reports");
      console.error("Error loading reports:", err);
    } finally {
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreReports = async () => {
    if (currentPage >= totalPages || isLoadingMore || refreshing) return;

    const nextPage = currentPage + 1;
    await handleExploreReports(nextPage, false);
  };

  const onRefresh = () => {
    handleExploreReports(1, true);
  };

  useEffect(() => {
    handleExploreReports(1, true);
  }, []);

  const handleReportPress = (reportId: number) => {
    router.push({
      pathname: "/(modals)/report-view",
      params: { id: reportId.toString() },
    });
  };

  const handleCreateReport = () => {
    router.push("/(modals)/report-form");
  };

  const renderReportItem = ({ item }: { item: ReportData }) => (
    <ReportCard
      report={{ ...item, category: item.category as ReportCategory }}
      onPress={() => handleReportPress(item.id)}
    />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <ActivityIndicator
        style={{ paddingVertical: 16 }}
        size="small"
        color={colors.primary}
      />
    );
  };

  const renderEmptyComponent = () => {
    if (refreshing) {
      return (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 32 }}
          color={colors.primary}
        />
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Button
            mode="outlined"
            onPress={onRefresh}
            style={styles.retryButton}
            textColor={colors.error}
          >
            Retry
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No reports available.</Text>
        <Text style={styles.emptySubtext}>
          Be the first to create a report!
        </Text>
      </View>
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Explore Reports
      </Text>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMoreReports}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.button.primary }]}
        onPress={handleCreateReport}
        accessibilityLabel="Create new report"
        accessibilityHint="Opens the report submission form"
        accessibilityRole="button"
        color={colors.button.text}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      margin: 16,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 32,
      flexGrow: 1,
    },
    errorContainer: {
      padding: 16,
      alignItems: "center",
    },
    errorText: {
      textAlign: "center",
      marginBottom: 12,
      color: colors.error,
    },
    retryButton: {
      marginTop: 8,
      borderColor: colors.error,
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 32,
    },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      marginBottom: 8,
      color: colors.textSecondary,
    },
    emptySubtext: {
      textAlign: "center",
      fontSize: 14,
      color: colors.textMuted,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });
