import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Badge, Card, Text, Chip } from "react-native-paper";
import type { ReportData } from "@/types/interfaces";
import { ReportStatus, ReportCategory } from "@/types/interfaces";
import { useAppColors } from "@/hooks/useAppColors";

interface ReportCardProps {
  report: Omit<ReportData, "category"> & { category: ReportCategory };
  onPress?: () => void;
}

export default function ReportCard({ report, onPress }: ReportCardProps) {
  const router = useRouter();
  const { colors } = useAppColors();

  const handlePress =
    onPress ??
    (() =>
      router.push({
        pathname: "/(modals)/report-view",
        params: { id: report.id },
      }));

  const getStatusStyles = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.OPEN:
        return {
          backgroundColor: colors.reportStatus.open,
          color: colors.textInverse,
        };
      case ReportStatus.IN_PROGRESS:
        return {
          backgroundColor: colors.reportStatus.in_progress,
          color: colors.textInverse,
        };
      case ReportStatus.RESOLVED:
        return {
          backgroundColor: colors.reportStatus.resolved,
          color: colors.textInverse,
        };
      case ReportStatus.DENIED:
        return {
          backgroundColor: colors.reportStatus.denied,
          color: colors.textInverse,
        };
      case ReportStatus.CLOSED:
        return {
          backgroundColor: colors.reportStatus.closed,
          color: colors.textInverse,
        };
      default:
        return {
          backgroundColor: colors.chip.background,
          color: colors.chip.text,
        };
    }
  };

  const getStatusLabel = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.OPEN:
        return "Open";
      case ReportStatus.IN_PROGRESS:
        return "In Progress";
      case ReportStatus.RESOLVED:
        return "Resolved";
      case ReportStatus.DENIED:
        return "Denied";
      case ReportStatus.CLOSED:
        return "Closed";
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: ReportCategory) => {
    switch (category) {
      case ReportCategory.POTHOLE:
        return "🕳️";
      case ReportCategory.STREET_LIGHT:
        return "💡";
      case ReportCategory.TRAFFIC_SIGNAL:
        return "🚦";
      case ReportCategory.ROAD_DAMAGE:
        return "🛣️";
      case ReportCategory.SANITATION:
        return "🧹";
      case ReportCategory.OTHER:
        return "📋";
      default:
        return "📄";
    }
  };

  const getCategoryLabel = (category: ReportCategory) => {
    switch (category) {
      case ReportCategory.POTHOLE:
        return "Pothole";
      case ReportCategory.STREET_LIGHT:
        return "Street Light";
      case ReportCategory.TRAFFIC_SIGNAL:
        return "Traffic Signal";
      case ReportCategory.ROAD_DAMAGE:
        return "Road Damage";
      case ReportCategory.SANITATION:
        return "Sanitation";
      case ReportCategory.OTHER:
        return "Other";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: ReportCategory) => {
    switch (category) {
      case ReportCategory.POTHOLE:
        return colors.reportCategory.pothole;
      case ReportCategory.STREET_LIGHT:
        return colors.reportCategory.street_light;
      case ReportCategory.TRAFFIC_SIGNAL:
        return colors.reportCategory.traffic_signal;
      case ReportCategory.ROAD_DAMAGE:
        return colors.reportCategory.road_damage;
      case ReportCategory.SANITATION:
        return colors.reportCategory.sanitation;
      case ReportCategory.OTHER:
        return colors.reportCategory.other;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if the image URL is the placeholder
  const hasValidImage =
    report.image_url &&
    !report.image_url.includes("via.placeholder.com") &&
    !report.image_url.includes("No+Image+Available");

  const statusStyles = getStatusStyles(report.status);
  const categoryColor = getCategoryColor(report.category);

  const styles = createStyles(colors);

  return (
    <Card
      onPress={handlePress}
      style={styles.card}
      mode="elevated"
      accessibilityLabel={`Report card for ${report.title}`}
      testID={`report-card-${report.id}`}
    >
      {/* Only show image if it's not the placeholder */}
      {hasValidImage && (
        <Card.Cover
          source={{ uri: report.image_url }}
          style={styles.cardCover}
        />
      )}

      <Card.Content
        style={[
          styles.cardContent,
          // Adjust padding if no image
          !hasValidImage && styles.cardContentNoImage,
        ]}
      >
        {/* Header with Title and Status */}
        <View style={styles.headerRow}>
          <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
            {report.title}
          </Text>
          <Badge
            style={[
              styles.badge,
              { backgroundColor: statusStyles.backgroundColor },
            ]}
            size={16}
          >
            {/* {getStatusLabel(report.status)} */}
          </Badge>
        </View>

        {/* Category and ID */}
        <View style={styles.metaRow}>
          <Chip
            mode="outlined"
            style={[styles.categoryChip, { borderColor: categoryColor }]}
            textStyle={[styles.categoryText, { color: categoryColor }]}
            compact
          >
            {getCategoryIcon(report.category)}{" "}
            {getCategoryLabel(report.category)}
          </Chip>
          <Text variant="bodySmall" style={styles.reportId}>
            #{report.id}
          </Text>
        </View>

        {/* Description */}
        <Text variant="bodyMedium" style={styles.description} numberOfLines={3}>
          {report.description}
        </Text>

        {/* Metadata */}
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Text variant="bodySmall" style={styles.metaLabel}>
              📅 Created:
            </Text>
            <Text variant="bodySmall" style={styles.metaValue}>
              {formatDate(report.created_at)}
            </Text>
          </View>

          {report.resolved_at && (
            <View style={styles.metaItem}>
              <Text variant="bodySmall" style={styles.metaLabel}>
                ✅ Resolved:
              </Text>
              <Text variant="bodySmall" style={styles.metaValue}>
                {formatDate(report.resolved_at)}
              </Text>
            </View>
          )}

          {report.rating && (
            <View style={styles.metaItem}>
              <Text variant="bodySmall" style={styles.metaLabel}>
                ⭐ Rating:
              </Text>
              <Text variant="bodySmall" style={styles.metaValue}>
                {report.rating}/5
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      marginVertical: 8,
      overflow: "hidden",
      backgroundColor: colors.card,
    },
    cardCover: {
      height: 160,
    },
    cardContent: {
      paddingVertical: 12,
      gap: 12,
    },
    cardContentNoImage: {
      paddingTop: 16, // Extra padding when no image
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 8,
    },
    title: {
      flex: 1,
      fontWeight: "600",
      lineHeight: 22,
      color: colors.text,
    },
    badge: {
      alignSelf: "flex-start",
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    categoryChip: {
      height: 28,
      borderWidth: 1,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: "500",
    },
    reportId: {
      fontWeight: "500",
      color: colors.textMuted,
    },
    description: {
      lineHeight: 20,
      color: colors.textSecondary,
    },
    metadata: {
      gap: 6,
    },
    metaItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    metaLabel: {
      fontWeight: "500",
      color: colors.textMuted,
    },
    metaValue: {
      fontWeight: "400",
      color: colors.text,
    },
  });
