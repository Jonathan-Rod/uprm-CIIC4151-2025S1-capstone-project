import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Badge, Card, Text } from "react-native-paper";

type ReportStatus = "open" | "in_progress" | "resolved" | "denied"; // this should be in interfaces.tsx

const fallbackImageUrl = "https://via.placeholder.com/400x200?text=No+Image";

export default function ReportCard({
  report,
  onPress,
}: {
  report: any;
  onPress?: () => void;
}) {
  const router = useRouter();

  const handlePress =
    onPress ??
    (() =>
      router.push({
        pathname: "/report-view",
        params: { id: report.id },
      }));

  const statusColorMap: Record<ReportStatus, string> = {
    open: Colors.light.alert,
    in_progress: "#F9A825",
    resolved: Colors.light.success,
    denied: "#B00020",
  };

  const statusColor =
    statusColorMap[report.status as ReportStatus] || Colors.light.icon;

  return (
    <Card
      onPress={handlePress}
      style={styles.card}
      mode="elevated"
      accessibilityLabel={`Report card for ${report.title}`}
      testID={`report-card-${report.id}`}
    >
      <Card.Cover source={{ uri: report.image_url || fallbackImageUrl }} />
      <Card.Content>
        <View style={styles.headerRow}>
          <Text variant="titleMedium">{report.title}</Text>
          <Badge style={[styles.badge, { backgroundColor: statusColor }]}>
            {report.status}
          </Badge>
        </View>

        <Text style={styles.description}>{report.description}</Text>

        <Text style={styles.meta}>
          Created at: {new Date(report.created_at).toLocaleString()}
        </Text>

        {report.resolved_at && (
          <Text style={styles.meta}>
            Resolved at: {new Date(report.resolved_at).toLocaleString()}
          </Text>
        )}

        <Text style={styles.meta}>
          Rating: {"⭐".repeat(report.rating)} ({report.rating} / 5)
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    alignSelf: "center",
  },
  description: {
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 4,
  },
});
