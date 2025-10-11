import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { View, Image } from "react-native";
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

  // Fallbacks for missing fields
  const image =
    report.image_url ||
    "https://via.placeholder.com/400x200.png?text=No+Image+Available";
  const createdAt = report.created_at || report.createdAt;
  const resolvedAt = report.resolved_at || report.resolvedAt;

  return (
    <Card
      onPress={() => {
        // Optional: navigate to detail page later
        // router.push(`/report-modal?id=${report.id}`);
      }}
      style={{
        marginVertical: 8,
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        overflow: "hidden",
      }}
      mode="elevated"
    >
      {/* Cover image */}
      <Image
        source={{ uri: image }}
        style={{
          width: "100%",
          height: 180,
          backgroundColor: "#e0e0e0",
        }}
        resizeMode="cover"
      />

      {/* Content */}
      <Card.Content style={{ paddingVertical: 12 }}>
        {/* Title + Status */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <Text variant="titleMedium" style={{ flex: 1, flexWrap: "wrap" }}>
            {report.title}
          </Text>
          <Badge
            style={{
              backgroundColor: statusColor,
              color: "#fff",
              textTransform: "capitalize",
            }}
          >
            {report.status}
          </Badge>
        </View>

        {/* Description */}
        <Text
          style={{
            marginTop: 4,
            color: Colors.light.text,
          }}
        >
          {report.description}
        </Text>

        {/* Metadata */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 12, color: Colors.light.icon }}>
            Created: {createdAt ? new Date(createdAt).toLocaleString() : "—"}
          </Text>

          {resolvedAt && (
            <Text style={{ fontSize: 12, color: Colors.light.icon }}>
              Resolved: {new Date(resolvedAt).toLocaleString()}
            </Text>
          )}

          {report.rating && (
            <Text style={{ fontSize: 12, color: Colors.light.icon }}>
              Rating: {report.rating} / 5
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}
