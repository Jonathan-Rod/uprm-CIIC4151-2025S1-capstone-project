import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import ReportCard from "@/components/ReportCard";
import type { ReportData } from "@/types/interfaces";

export default function PinnedReports({ reports }: { reports: ReportData[] }) {
  const router = useRouter();
  const [items, setItems] = useState<ReportData[]>(reports);

  // Fast lookup to tell ReportCard which items start pinned
  const pinnedIdSet = useMemo(() => new Set(items.map((r) => r.id)), [items]);

  const handlePinChange = (id: number, nextPinned: boolean) => {
    // If unpinned from Home, remove from the local list for instant UX
    if (!nextPinned) {
      setItems((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Pinned reports</Text>

      {items.length ? (
        items.map((r) => (
          <ReportCard
            key={r.id}
            report={r}
            initiallyPinned={pinnedIdSet.has(r.id)}
            onPinChange={handlePinChange}
            onPress={() =>
              router.push({
                pathname: "/report-view",
                params: { id: r.id },
              })
            }
          />
        ))
      ) : (
        <Text style={styles.muted}>No pinned reports</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: 12, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  muted: { color: "#888" },
});
