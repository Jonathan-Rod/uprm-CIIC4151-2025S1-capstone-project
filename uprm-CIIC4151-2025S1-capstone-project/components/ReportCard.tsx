import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Badge, Card, Text } from "react-native-paper";
type ReportStatus = "open" | "in_progress" | "resolved" | "denied";

export default function ReportCard({ report }: { report: any }) {
  const router = useRouter();

  const statusColorMap: Record<ReportStatus, string> = {
    open: Colors.light.alert,
    in_progress: "#F9A825", // amber
    resolved: Colors.light.success,
    denied: "#B00020", // red
  };

  const statusColor =
    statusColorMap[report.status as ReportStatus] || Colors.light.icon;

  return (
    <Card
      //onPress={() => router.push(`/report-modal?id=${report.id}`)}
      style={{ marginVertical: 8 }}
    >
      <Card.Cover source={{ uri: report.image_url }} />
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text variant="titleMedium">{report.title}</Text>
          <Badge style={{ backgroundColor: statusColor }}>
            {report.status}
          </Badge>
        </View>
        <Text style={{ marginTop: 4 }}>{report.description}</Text>
        <Text style={{ fontSize: 12, color: Colors.light.icon, marginTop: 8 }}>
          Created at: {new Date(report.created_at).toLocaleString()}
        </Text>
        {report.resolved_at && (
          <Text style={{ fontSize: 12, color: Colors.light.icon }}>
            Resolved at: {new Date(report.resolved_at).toLocaleString()}
          </Text>
        )}
        <Text style={{ fontSize: 12, color: Colors.light.icon }}>
          Rating: {report.rating} / 5
        </Text>
      </Card.Content>
    </Card>
  );
}
