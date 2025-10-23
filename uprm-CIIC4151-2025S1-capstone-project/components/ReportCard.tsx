import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Badge, Card, Text, IconButton } from "react-native-paper";
import { useState, useEffect } from "react";
import { pinReport, unpinReport } from "@/utils/api";

type ReportStatus = "open" | "in_progress" | "resolved" | "denied";

const fallbackImageUrl = "https://via.placeholder.com/400x200?text=No+Image";

export default function ReportCard({
  report,
  onPress,
  onPinChange,
  afterPinNavigateHome = false,
  initiallyPinned = false,
}: {
  report: any;
  onPress?: () => void;
  onPinChange?: (id: number, nextPinned: boolean) => void;
  afterPinNavigateHome?: boolean;
  initiallyPinned?: boolean;
}) {
  const router = useRouter();

  // initialize from backend-provided report.pinned or parent-provided initiallyPinned
  const [pinned, setPinned] = useState<boolean>(
    typeof report.pinned === "boolean" ? report.pinned : initiallyPinned
  );
  const [loading, setLoading] = useState(false);

  // keep in sync if parent updates initiallyPinned (e.g., after refresh/focus)
  useEffect(() => {
    if (typeof report.pinned !== "boolean") {
      setPinned(!!initiallyPinned);
    }
  }, [initiallyPinned, report.pinned]);

  const handlePress =
    onPress ??
    (() =>
      router.push({
        pathname: "../app/(modals)/report-view",
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

  const togglePin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (pinned) {
        await unpinReport(report.id);
      } else {
        await pinReport(report.id);
      }

      const next = !pinned;
      setPinned(next);
      onPinChange?.(report.id, next);

      // Optional behavior: only navigate if parent asked for it and it was a PIN action
      if (next && afterPinNavigateHome) {
        router.push("/(tabs)/home");
      }
    } catch (e) {
      console.warn("Pin toggle failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      onPress={handlePress}
      style={styles.card}
      mode="elevated"
      accessibilityLabel={`Report card for ${report.title}`}
      testID={`report-card-${report.id}`}
    >
      {/* Pin button in upper right corner */}
      <View style={styles.pinButton}>
        <IconButton
          icon={pinned ? "pin" : "pin-outline"}
          size={22}
          onPress={togglePin}
          disabled={loading}
          accessibilityLabel={pinned ? "Unpin report" : "Pin report"}
        />
      </View>

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
          Rating: {"⭐".repeat(report.rating ?? 0)} ({report.rating ?? 0} / 5)
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 8 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badge: { alignSelf: "center" },
  description: { marginTop: 4 },
  meta: { fontSize: 12, color: Colors.light.icon, marginTop: 4 },
  pinButton: { position: "absolute", top: 4, right: 4, zIndex: 2 },
});
