import React from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { FAB, Text, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReportData } from "@/types/interfaces";
import { fetchPinnedReports } from "@/utils/api";
import PinnedReports from "@/components/PinnedReports";

export default function HomeScreen() {
  const router = useRouter();
  const [pinnedReports, setPinnedReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadPinnedReports = useCallback(async () => {
    setError("");
    try {
      const data = await fetchPinnedReports();
      setPinnedReports(data?.reports ?? []);
    } catch (err) {
      console.warn("Failed to fetch pinned reports:", err);
      setError("Could not load pinned reports");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPinnedReports();
    setRefreshing(false);
  };

  useEffect(() => {
    setLoading(true);
    loadPinnedReports();
  }, [loadPinnedReports]);

  useFocusEffect(
    useCallback(() => {
      loadPinnedReports();
    }, [loadPinnedReports])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text variant="headlineMedium" style={styles.header}>Home</Text>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      >
        {loading ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : error ? (
          <Text style={{ color: "red", padding: 16 }}>Error: {error}</Text>
        ) : pinnedReports.length === 0 ? (
          <Text style={{ padding: 16 }}>No pinned reports available.</Text>
        ) : (
          <PinnedReports reports={pinnedReports} />
        )}
      </ScrollView>

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
  header: { margin: 16 },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
});
