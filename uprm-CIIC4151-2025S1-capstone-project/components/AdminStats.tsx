import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function AdminStats({
  assigned,
  pending,
  resolved,
}: {
  assigned: number;
  pending: number;
  resolved: number;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Admin</Text>
      <Row label="Assigned to you" value={assigned} />
      <Row label="Pending (yours)" value={pending} />
      <Row label="Resolved by you" value={resolved} />
    </View>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.rowBetween}>
      <Text>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 12, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  value: { fontWeight: "700" },
});
