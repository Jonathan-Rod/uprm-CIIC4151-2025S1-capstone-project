// components/ReportDetails.tsx
import { View, StyleSheet } from "react-native";
import { Text, Chip } from "react-native-paper";
import { useEffect, useState } from "react";
import type { ReportData } from "@/types/interfaces";
import { getUser, getLocation } from "@/utils/api";
import { useAppColors } from "@/hooks/useAppColors";

interface UserDetails {
  id: number;
  email: string;
  admin?: boolean;
  suspended?: boolean;
}

interface ReportDetailsProps {
  report: ReportData;
  ratingCount: number;
}

// ----------------------
// Styles
// ----------------------
const createStyles = (colors: any) =>
  StyleSheet.create({
    reportCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    // Header Section
    headerSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    userInfo: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    userInitials: { color: colors.textInverse, fontWeight: "600", fontSize: 16 },
    userName: { fontWeight: "600", color: colors.text, marginBottom: 2 },
    timestamp: { color: colors.textMuted, fontSize: 12 },
    statusChip: { height: 24 },
    statusText: { color: colors.textInverse, fontSize: 10, fontWeight: "600" },

    // Content Section
    title: { fontWeight: "700", color: colors.text, marginBottom: 8, lineHeight: 28 },
    categoryChip: { alignSelf: "flex-start", marginBottom: 16, backgroundColor: colors.chip.background },
    categoryText: { color: colors.chip.text, fontSize: 12, fontWeight: "500" },
    description: { color: colors.textSecondary, lineHeight: 20, marginBottom: 16 },

    // Stats Section
    statsSection: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    statItem: { alignItems: "center" },
    statLabel: { color: colors.textMuted, marginBottom: 4 },
    statValue: { color: colors.text, fontWeight: "600" },

    // Location Section
    locationSection: { marginBottom: 16 },
    sectionTitle: { fontWeight: "600", color: colors.text, marginBottom: 8 },
    locationText: { color: colors.text, fontSize: 14, fontWeight: "500" },

    // Admin Section
    adminSection: { borderTopWidth: 1, borderColor: colors.border, paddingTop: 16 },
    adminItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    adminLabel: { color: colors.textMuted },
    adminValue: { color: colors.text, fontWeight: "500" },
  });

// ----------------------
// Component
// ----------------------
export const ReportDetails = ({ report, ratingCount }: ReportDetailsProps) => {
  const { colors } = useAppColors();
  const styles = createStyles(colors);

  const [userDetails, setUserDetails] = useState<{ [key: number]: UserDetails }>({});
  const [locationString, setLocationString] = useState<string>("Loading location...");
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load user details
  useEffect(() => {
    const loadUserDetails = async () => {
      setLoadingUsers(true);
      const userIds = [report.created_by];
      if (report.validated_by) userIds.push(report.validated_by);
      if (report.resolved_by) userIds.push(report.resolved_by);

      const newUserDetails: { [key: number]: UserDetails } = {};

      for (const userId of userIds) {
        if (!userDetails[userId]) {
          try {
            const user = await getUser(userId);
            newUserDetails[userId] = user;
          } catch (error) {
            console.error(`Error loading user ${userId}:`, error);
            newUserDetails[userId] = { id: userId, email: `user${userId}@example.com` };
          }
        } else {
          newUserDetails[userId] = userDetails[userId];
        }
      }

      setUserDetails((prev) => ({ ...prev, ...newUserDetails }));
      setLoadingUsers(false);
    };

    loadUserDetails();
  }, [report.created_by, report.validated_by, report.resolved_by]);

  // Load location string based on location_id
  useEffect(() => {
    const loadLocation = async () => {
      if (report.location) {
        setLocationString(report.location.city || "Unknown");
      } else if (report.location_id) {
        try {
          const loc = await getLocation(report.location_id);
          setLocationString(loc?.city || "Unknown");
        } catch (error) {
          console.error("Error loading location:", error);
          setLocationString("Unknown");
        }
      } else {
        setLocationString("Unknown");
      }
    };

    loadLocation();
  }, [report.location, report.location_id]);

  const getUserDisplayName = (userId: number) => {
    const user = userDetails[userId];
    if (!user) return "Loading...";
    return user.email || `User #${userId}`;
  };

  const getUserInitials = (userId: number) => {
    const user = userDetails[userId];
    if (!user || !user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return colors.reportStatus.open;
      case "in_progress":
        return colors.reportStatus.in_progress;
      case "resolved":
        return colors.reportStatus.resolved;
      case "denied":
        return colors.reportStatus.denied;
      case "closed":
        return colors.reportStatus.closed;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.reportCard}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitials}>{getUserInitials(report.created_by)}</Text>
          </View>
          <View>
            <Text variant="titleMedium" style={styles.userName}>
              {getUserDisplayName(report.created_by)}
            </Text>
            <Text variant="bodySmall" style={styles.timestamp}>
              {formatDate(report.created_at)}
            </Text>
          </View>
        </View>
        <Chip
  mode="outlined"
  style={[styles.statusChip, { backgroundColor: getStatusColor(report.status) }]}
  textStyle={styles.statusText}
>
  {" "} {/* just empty space, or use an icon */}
</Chip>

      </View>

      {/* Title and Category */}
      <Text variant="headlineSmall" style={styles.title}>
        {report.title}
      </Text>
      <Chip mode="outlined" style={styles.categoryChip} textStyle={styles.categoryText}>
        {report.category}
      </Chip>

      {/* Description */}
      <Text variant="bodyMedium" style={styles.description}>
        {report.description}
      </Text>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text variant="bodySmall" style={styles.statLabel}>
            Rating
          </Text>
          <Text variant="titleSmall" style={styles.statValue}>
            {ratingCount} likes
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="bodySmall" style={styles.statLabel}>
            Updated
          </Text>
          <Text variant="bodySmall" style={styles.statValue}>
            {formatDate(report.updated_at)}
          </Text>
        </View>
        {report.resolved_at && (
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Resolved
            </Text>
            <Text variant="bodySmall" style={styles.statValue}>
              {formatDate(report.resolved_at)}
            </Text>
          </View>
        )}
      </View>

      {/* Location Section */}
      {(report.location_id || report.location) && (
        <View style={styles.locationSection}>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            Location
          </Text>
          <Text variant="bodyMedium" style={styles.locationText}>
            {locationString}
          </Text>
        </View>
      )}

      {/* Admin Section */}
      {(report.validated_by || report.resolved_by) && (
        <View style={styles.adminSection}>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            Administration
          </Text>
          {report.validated_by && (
            <View style={styles.adminItem}>
              <Text variant="bodySmall" style={styles.adminLabel}>
                Validated by:
              </Text>
              <Text variant="bodySmall" style={styles.adminValue}>
                {getUserDisplayName(report.validated_by)}
              </Text>
            </View>
          )}
          {report.resolved_by && (
            <View style={styles.adminItem}>
              <Text variant="bodySmall" style={styles.adminLabel}>
                Resolved by:
              </Text>
              <Text variant="bodySmall" style={styles.adminValue}>
                {getUserDisplayName(report.resolved_by)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
