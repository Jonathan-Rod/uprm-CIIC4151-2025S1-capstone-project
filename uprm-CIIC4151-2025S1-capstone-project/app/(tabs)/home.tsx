import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReportData } from "@/types/interfaces"; // Type import

export default function HomeScreen() {
  const router = useRouter();
  const [pinnedReports, setPinnedReports] = useState<ReportData[]>([]); // Typed state
  const [error, setError] = useState("");

  useEffect(() => {
    // TODO: #37 Load pinned reports when backend supports it
    setPinnedReports([]); // Placeholder for future logic
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text variant="headlineMedium" style={styles.header}>
        Home
      </Text>

      {error ? (
        <Text style={{ color: "red", padding: 16 }}>Error: {error}</Text>
      ) : pinnedReports.length === 0 ? (
        <Text style={{ padding: 16 }}>No pinned reports available.</Text>
      ) : (
        // Future: render pinned reports here
        null
      )}

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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
