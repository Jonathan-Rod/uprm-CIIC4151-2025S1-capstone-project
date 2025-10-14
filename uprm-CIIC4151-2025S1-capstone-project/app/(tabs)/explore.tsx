import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Text, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import ReportCard from "@/components/ReportCard";
import { fetchReports } from "@/utils/api";
// import type { Report } from "@/types/report"; // Adjust path if needed

type Report = { id: number; title: string; description: string; status: string; createdAt: string; updatedAt: string; pinned: boolean; createdBy: number; validatedBy: number | null; resolvedBy: number | null; category: string; location: string | null; image_url: string | null; rating: number | null; }; type User = { id: number; email: string; admin: boolean; };

export default function ExploreScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const handleExploreReports = async () => {
    try {
      setError("");
      setRefreshing(true);
      const data = await fetchReports(); // No pagination
      setReports(data); // Assumes backend returns an array of reports
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setRefreshing(false);
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
