import React, { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Text, ActivityIndicator, Button } from "react-native-paper";
import { useRouter, useFocusEffect } from "expo-router";
import ReportCard from "@/components/ReportCard";
import { fetchReports, fetchPinnedReports } from "@/utils/api";
import type { ReportData } from "@/types/interfaces";

export default function ExploreScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [pinnedIds, setPinnedIds] = useState<Set<number>>(new Set()); // NEW: set of pinned IDs
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const limit = 10;

  const loadPinnedIds = useCallback(async () => {
    try {
      const data = await fetchPinnedReports(); // { reports: Report[] }
      const ids = new Set<number>((data?.reports ?? []).map((r: any) => r.id));
      setPinnedIds(ids);
    } catch {
      // ignore softly; explore still works even if this fails
    }
  }, []);

  const handleExploreReports = useCallback(async () => {
    try {
      setError("");
      setRefreshing(true);
      const data = await fetchReports(1, limit);
      setReports(data.reports);
      setCurrentPage(1);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadMoreReports = async () => {
    if (currentPage >= totalPages || isLoadingMore || refreshing) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const data = await fetchReports(nextPage, limit);
      setReports((prev) => [...prev, ...data.reports]);
      setCurrentPage(nextPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // initial load
  useEffect(() => {
    handleExploreReports();
    loadPinnedIds();
  }, [handleExploreReports, loadPinnedIds]);

  // refresh pinned IDs whenever Explore regains focus (e.g., after pinning elsewhere)
  useFocusEffect(
    useCallback(() => {
      loadPinnedIds();
    }, [loadPinnedIds])
  );

  // keep local Set in sync when user toggles a pin on this screen
  const handlePinChange = (id: number, nextPinned: boolean) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (nextPinned) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text variant="headlineMedium" style={styles.header}>
        Explore
      </Text>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={reports}
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() =>
              router.push({
                pathname: "/report-view",
                params: { id: item.id },
              })
            }
            initiallyPinned={pinnedIds.has(item.id)} // tell the card if pinned
            onPinChange={handlePinChange}            // keep the Set updated
          />
        )}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              await Promise.all([handleExploreReports(), loadPinnedIds()]);
            }}
          />
        }
        onEndReached={loadMoreReports}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator style={{ paddingVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={
          refreshing ? (
            <ActivityIndicator />
          ) : error !== "" ? (
            <View style={{ padding: 16 }}>
              <Text style={{ color: "red" }}>Error: {error}</Text>
              <Button mode="outlined" onPress={handleExploreReports} style={{ marginTop: 8 }}>
                Retry
              </Button>
            </View>
          ) : (
            <Text style={{ textAlign: "center", marginTop: 32 }}>
              No reports available.
            </Text>
          )
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/report-form")}
        accessibilityLabel="Create new report"
        accessibilityHint="Opens the report submission form"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
