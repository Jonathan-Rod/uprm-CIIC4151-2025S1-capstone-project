import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Text, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import ReportCard from "@/components/ReportCard";
import { fetchReports } from "@/utils/api";

export default function ExploreScreen() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const limit = 10;

  const handleExploreReports = async () => {
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
  };

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

  useEffect(() => {
    handleExploreReports();
  }, []);

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
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleExploreReports}
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
            <Text style={{ color: "red", padding: 16 }}>Error: {error}</Text>
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
