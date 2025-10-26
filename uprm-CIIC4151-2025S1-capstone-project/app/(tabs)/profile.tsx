import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, RefreshControl, View } from "react-native";
import { Text, ActivityIndicator, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AdminStats from "@/components/AdminStats";
import PinnedReports from "@/components/PinnedReports";
import ReportStats from "@/components/ReportStats";
import UserCard from "@/components/UserCard";
import VisitedReports from "@/components/VisitedReports";
import {
  getUserStats,
  getPinnedReports,
  getReports,
  getAdminStats,
} from "@/utils/api";
import { getStoredCredentials } from "@/utils/auth";
import {
  ReportStatus,
  type ReportData,
  type UserSession,
} from "@/types/interfaces";
import { useAppColors } from "@/hooks/useAppColors";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useAppColors();
  const [user, setUser] = useState<UserSession | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [pinnedReports, setPinnedReports] = useState<ReportData[]>([]);
  const [allReports, setAllReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProfileData = async () => {
    try {
      setError("");
      setLoading(true);

      // Check authentication first
      const credentials = await getStoredCredentials();

      if (!credentials) {
        setError("Please log in to view profile");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Create user session from credentials
      const userData: UserSession = {
        id: credentials.userId,
        email: credentials.email,
        admin: false, // This should come from your API
        suspended: false,
        pinned: false,
        created_at: new Date().toISOString(),
      };
      setUser(userData);

      // Load all data in parallel
      const [statsData, pinnedData, reportsData] = await Promise.all([
        getUserStats(userData.id).catch((err) => {
          console.warn("Failed to load user stats:", err);
          return null;
        }),
        getPinnedReports().catch((err) => {
          console.warn("Failed to load pinned reports:", err);
          return { pinned_reports: [] };
        }),
        getReports(1, 100).catch((err) => {
          console.warn("Failed to load reports:", err);
          return { reports: [] };
        }),
      ]);

      setUserStats(statsData);

      // Handle different pinned reports response formats
      const pinnedReportsData =
        pinnedData.pinned_reports || pinnedData.reports || pinnedData || [];
      setPinnedReports(
        Array.isArray(pinnedReportsData) ? pinnedReportsData : []
      );

      setAllReports(reportsData.reports || []);

      // Load admin stats if user is admin
      if (userData.admin) {
        try {
          const adminStatsData = await getAdminStats(userData.id);
          setAdminStats(adminStatsData);
        } catch (err) {
          console.warn("Failed to load admin stats:", err);
        }
      }
    } catch (err: any) {
      console.error("Error loading profile data:", err);

      // Handle specific authentication errors
      if (
        err.message?.includes("not authenticated") ||
        err.message?.includes("User ID")
      ) {
        setError("Please log in to view profile");
      } else {
        setError(err.message || "Failed to load profile data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfileData();
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // Calculate user-specific statistics from local data
  const getUserSpecificStats = () => {
    if (!user || !allReports.length) {
      return {
        filed: 0,
        resolved: 0,
        pending: 0,
        lastThreeVisited: [],
        lastReportDate: null,
      };
    }

    const userReports = allReports.filter(
      (report) => report.created_by === user.id
    );

    return {
      filed: userReports.length,
      resolved: userReports.filter(
        (report) =>
          report.status === ReportStatus.RESOLVED ||
          report.status === ReportStatus.CLOSED
      ).length,
      pending: userReports.filter(
        (report) =>
          report.status === ReportStatus.OPEN ||
          report.status === ReportStatus.IN_PROGRESS
      ).length,
      lastThreeVisited: userReports.slice(-3).reverse(), // Show most recent first
      lastReportDate:
        userReports.length > 0
          ? userReports[userReports.length - 1]?.created_at
          : null,
    };
  };

  const userSpecificStats = getUserSpecificStats();

  const handleLoginRedirect = () => {
    router.replace("/");
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && error.includes("log in")) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text variant="headlineMedium" style={styles.loginTitle}>
            Profile
          </Text>
          <Text variant="bodyMedium" style={styles.loginSubtitle}>
            Please log in to view your profile
          </Text>
          <Button
            mode="contained"
            onPress={handleLoginRedirect}
            style={styles.loginButton}
            textColor={colors.button.text}
          >
            Sign In
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.pageTitle}>Profile</Text>

        {error && !error.includes("log in") ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <Button
              mode="outlined"
              onPress={loadProfileData}
              style={styles.retryButton}
              textColor={colors.error}
            >
              Retry
            </Button>
          </View>
        ) : (
          <>
            <UserCard user={user} />

            <ReportStats
              filed={userStats?.total_reports || userSpecificStats.filed}
              resolved={
                userStats?.resolved_reports || userSpecificStats.resolved
              }
              pending={userStats?.open_reports || userSpecificStats.pending}
              pinned={userStats?.pinned_reports_count || pinnedReports.length}
              lastReportDate={userSpecificStats.lastReportDate}
            />

            {user?.admin && adminStats && (
              <AdminStats
                assigned={adminStats?.total_assigned_reports || 0}
                pending={adminStats?.in_progress_reports || 0}
                resolved={adminStats?.resolved_personally || 0}
              />
            )}

            {pinnedReports.length > 0 && (
              <PinnedReports reports={pinnedReports} />
            )}

            {userSpecificStats.lastThreeVisited.length > 0 && (
              <VisitedReports reports={userSpecificStats.lastThreeVisited} />
            )}

            {!error &&
              pinnedReports.length === 0 &&
              userSpecificStats.lastThreeVisited.length === 0 && (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>
                    No activity data available yet.
                  </Text>
                  <Text style={styles.noDataSubtext}>
                    Start creating reports to see your activity here.
                  </Text>
                </View>
              )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      gap: 16,
      paddingBottom: 32,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 4,
      textAlign: "center",
      color: colors.text,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
    },
    loadingText: {
      color: colors.text,
    },
    loginContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      gap: 16,
    },
    loginTitle: {
      fontWeight: "bold",
      textAlign: "center",
      color: colors.text,
    },
    loginSubtitle: {
      textAlign: "center",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    loginButton: {
      marginTop: 16,
      backgroundColor: colors.button.primary,
    },
    errorContainer: {
      alignItems: "center",
      paddingVertical: 20,
    },
    errorText: {
      color: colors.error,
      textAlign: "center",
      marginBottom: 12,
    },
    retryButton: {
      marginTop: 8,
      borderColor: colors.error,
    },
    noDataContainer: {
      alignItems: "center",
      paddingVertical: 30,
    },
    noDataText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    noDataSubtext: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: "center",
    },
  });
