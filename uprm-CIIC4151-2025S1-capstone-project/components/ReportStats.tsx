import { Colors } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function ReportStats({
  filed: filed,
  resolved,
  pending,
  pinned,
  lastReportDate,
}: {
  filed: number;
  resolved: number;
  pending: number;
  pinned: number;
  lastReportDate: string | null;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Your report activity</Text>
      <View style={styles.statsGrid}>
        <Stat label="Filed" value={filed} />
        <Stat label="Resolved" value={resolved} />
        <Stat label="Pending" value={pending} />
        <Stat label="Pinned" value={pinned} />
      </View>
      <Text style={styles.muted}>
        Last report:{" "}
        {lastReportDate ? new Date(lastReportDate).toLocaleString() : "—"}
      </Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 12, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 6,
  },
  stat: {
    width: "47%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { marginTop: 2 },
  muted: { color: Colors.dark.muted },
});
