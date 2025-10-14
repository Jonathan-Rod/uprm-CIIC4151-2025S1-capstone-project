import { Colors } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function VisitedReports({ reports }: { reports: any[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Last 3 visited</Text>
      {reports.length ? (
        reports.map((r, i) => (
          <View key={r.id ?? `visited-${i}`} style={styles.reportRow}>
            <Text style={styles.reportTitle}>
              {r.title ?? `Report #${r.id ?? i + 1}`}
            </Text>
            <Text style={styles.reportMeta}>
              {r.status}{" "}
              {r.createdAt
                ? `• ${new Date(r.createdAt).toLocaleDateString()}`
                : ""}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.muted}>—</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 12, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  reportRow: { paddingVertical: 8, borderTopWidth: 1 },
  reportTitle: { fontWeight: "600" },
  reportMeta: { fontSize: 12, marginTop: 2 },
  muted: { color: Colors.dark.muted },
});
