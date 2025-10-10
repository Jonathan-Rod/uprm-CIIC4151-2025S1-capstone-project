// TODO: #36 Add Pop Up View in details of a selected report card
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { fetchReport } from "@/utils/api";

export default function ReportViewModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchReport(Number(id));
        setReport(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load report.");
      }
    };

    if (id) loadReport();
  }, [id]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Report View</ThemedText>
      <View style={{ marginTop: 16 }}>
        {error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : report ? (
          <>
            <Text variant="titleLarge">{report.title}</Text>
            <Text variant="bodyMedium" style={{ marginVertical: 8 }}>
              {report.description}
            </Text>
            <Text style={styles.meta}>
              Created at: {new Date(report.created_at).toLocaleString()}
            </Text>
            {report.resolved_at && (
              <Text style={styles.meta}>
                Resolved at: {new Date(report.resolved_at).toLocaleString()}
              </Text>
            )}
            <Text style={styles.meta}>Rating: {report.rating} / 5</Text>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={{ marginTop: 24 }}
        >
          Back
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  meta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
