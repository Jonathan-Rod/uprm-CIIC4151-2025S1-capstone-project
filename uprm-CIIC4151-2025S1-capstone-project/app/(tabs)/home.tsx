import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import {
  FAB,
  Text,
  Card,
  ActivityIndicator,
  Chip,
  Button,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOverviewStats, getPinnedReports } from "@/utils/api";
import { getStoredCredentials } from "@/utils/auth";
import type { ReportData, UserSession } from "@/types/interfaces";
import { useAppColors } from "@/hooks/useAppColors";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppColors();
  const [pinnedReports, setPinnedReports] = useState<ReportData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadHomeData = async () => {
    try {
      setError("");

      // Check if user is logged in using our new auth utility
      const credentials = await getStoredCredentials();

      if (!credentials) {
        setError("Please log in to view home data");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Set user data from stored credentials
      setUser({
        id: credentials.userId,
        email: credentials.email,
        admin: false,
        suspended: false,
        pinned: false,
        created_at: new Date().toISOString(),
      });

      // Load data
      const [pinnedData, statsData] = await Promise.all([
        getPinnedReports(),
        getOverviewStats(),
      ]);

      // Handle different response formats
      const reports =
        pinnedData.pinned_reports || pinnedData.reports || pinnedData || [];
      setPinnedReports(Array.isArray(reports) ? reports : []);
      setStats(statsData);
    } catch (err: any) {
      console.error("Error loading home data:", err);

      // Handle specific authentication errors
      if (
        err.message?.includes("not authenticated") ||
        err.message?.includes("User ID")
      ) {
        setError("Please log in to view home data");
      } else {
        setError(err.message || "Failed to load home data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  // Status styles mapping con colores de la paleta
  const statusStyles: Record<string, any> = {
    open: {
      backgroundColor: colors.reportStatus.openLight,
      borderColor: colors.reportStatus.open,
    },
    in_progress: {
      backgroundColor: colors.reportStatus.in_progressLight,
      borderColor: colors.reportStatus.in_progress,
    },
    resolved: {
      backgroundColor: colors.reportStatus.resolvedLight,
      borderColor: colors.reportStatus.resolved,
    },
    denied: {
      backgroundColor: colors.reportStatus.deniedLight,
      borderColor: colors.reportStatus.denied,
    },
    closed: {
      backgroundColor: colors.reportStatus.closedLight,
      borderColor: colors.reportStatus.closed,
    },
  };

  const getStatusTextColor = (status: string) => {
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
        return colors.chip.text;
    }
  };

  const handleReportPress = (reportId: number) => {
    router.push({
      pathname: "/(modals)/report-view",
      params: { id: reportId.toString() },
    });
  };

  const handleCreateReport = () => {
    getStoredCredentials().then((credentials) => {
      if (!credentials) {
        setError("Please log in to create reports");
        return;
      }
      router.push("/(modals)/report-form");
    });
  };

  const handleViewAllReports = () => {
    router.push("/(tabs)/explore");
  };

  const handleViewAllPinned = () => {
    router.push("/(tabs)/explore");
  };

  const handleLoginRedirect = () => {
    router.replace("/");
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show login prompt if no user data
  if (error && error.includes("log in")) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text variant="headlineMedium" style={styles.loginTitle}>
            Welcome
          </Text>
          <Text variant="bodyMedium" style={styles.loginSubtitle}>
            Please log in to view your dashboard
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.welcomeTitle}>
              Welcome back!
            </Text>
            <Text variant="bodyMedium" style={styles.welcomeSubtitle}>
              {user?.email || "User"}
            </Text>
            {user?.admin && (
              <Chip
                mode="outlined"
                style={styles.adminChip}
                textStyle={styles.adminChipText}
              >
                Administrator
              </Chip>
            )}
          </Card.Content>
        </Card>

        {/* Statistics Overview */}
        {stats && (
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                System Overview
              </Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statNumber}>
                    {stats.total_reports || 0}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Total Reports
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statNumber]}>
                    {stats.open_reports || 0}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Open
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statNumber]}>
                    {stats.resolved_reports || 0}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Resolved
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Pinned Reports Section */}
        <Card style={styles.pinnedCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Your Pinned Reports
              </Text>
              {pinnedReports.length > 0 && (
                <Button
                  mode="text"
                  compact
                  onPress={handleViewAllPinned}
                  textColor={colors.primary}
                >
                  View All
                </Button>
              )}
            </View>

            {error && !error.includes("log in") ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <Button
                  mode="outlined"
                  onPress={loadHomeData}
                  style={styles.retryButton}
                  textColor={colors.error}
                >
                  Retry
                </Button>
              </View>
            ) : pinnedReports.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No pinned reports yet</Text>
                <Text style={styles.emptySubtext}>
                  Pin important reports to see them here
                </Text>
                <Button
                  mode="contained"
                  onPress={handleViewAllReports}
                  style={styles.exploreButton}
                  textColor={colors.button.text}
                >
                  Explore Reports
                </Button>
              </View>
            ) : (
              <>
                {pinnedReports.slice(0, 5).map((report) => {
                  const statusStyle = statusStyles[report.status];
                  const textColor = getStatusTextColor(report.status);

                  return (
                    <Card
                      key={report.id}
                      style={styles.pinnedReportCard}
                      onPress={() => handleReportPress(report.id)}
                    >
                      <Card.Content>
                        <Text
                          variant="titleSmall"
                          numberOfLines={1}
                          style={styles.reportTitle}
                        >
                          {report.title}
                        </Text>
                        <Text
                          variant="bodyMedium"
                          numberOfLines={2}
                          style={styles.reportDescription}
                        >
                          {report.description}
                        </Text>
                        <View style={styles.reportMeta}>
                          <Chip
                            compact
                            mode="outlined"
                            style={[styles.statusChip, statusStyle]}
                            textStyle={[styles.chipText, { color: textColor }]}
                          >
                            {report.status?.replace("_", " ") || "Unknown"}
                          </Chip>
                          <Text variant="labelSmall" style={styles.dateText}>
                            {new Date(report.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                  );
                })}
                {pinnedReports.length > 5 && (
                  <Button
                    mode="text"
                    onPress={handleViewAllPinned}
                    style={styles.viewMoreButton}
                    textColor={colors.primary}
                  >
                    View {pinnedReports.length - 5} more pinned reports
                  </Button>
                )}
              </>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Actions
            </Text>
            <View style={styles.actionsGrid}>
              <Button
                mode="outlined"
                icon="compass"
                onPress={handleViewAllReports}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                textColor={colors.text}
              >
                Browse All
              </Button>
              <Button
                mode="outlined"
                icon="map-marker"
                accessibilityLabel="View map"
                accessibilityRole="image"
                onPress={() => {
                  /* TODO: Implement map view */
                }}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                textColor={colors.text}
              >
                View Map
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.button.primary }]}
        onPress={handleCreateReport}
        accessibilityLabel="Create new report"
        accessibilityHint="Opens the report submission form"
        accessibilityRole="button"
        color={colors.button.text}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    welcomeCard: {
      marginBottom: 16,
      backgroundColor: colors.surface,
    },
    welcomeTitle: {
      fontWeight: "bold",
      color: colors.text,
    },
    welcomeSubtitle: {
      marginTop: 4,
      color: colors.textSecondary,
    },
    adminChip: {
      alignSelf: "flex-start",
      marginTop: 8,
      borderColor: colors.primary,
    },
    adminChipText: {
      color: colors.primary,
    },
    statsCard: {
      marginBottom: 16,
      backgroundColor: colors.surface,
    },
    sectionTitle: {
      fontWeight: "bold",
      marginBottom: 16,
      color: colors.text,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statNumber: {
      fontWeight: "bold",
      color: colors.text,
    },
    statLabel: {
      marginTop: 4,
      color: colors.textSecondary,
    },
    ratingContainer: {
      marginTop: 12,
      alignItems: "center",
    },
    ratingText: {
      color: colors.textSecondary,
    },
    pinnedCard: {
      marginBottom: 16,
      backgroundColor: colors.surface,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    errorContainer: {
      alignItems: "center",
      paddingVertical: 20,
    },
    errorText: {
      textAlign: "center",
      marginBottom: 12,
      color: colors.error,
    },
    retryButton: {
      marginTop: 8,
      borderColor: colors.error,
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 30,
    },
    emptyText: {
      fontSize: 16,
      marginBottom: 8,
      color: colors.textSecondary,
    },
    emptySubtext: {
      fontSize: 14,
      textAlign: "center",
      marginBottom: 20,
      color: colors.textMuted,
    },
    exploreButton: {
      marginTop: 8,
      backgroundColor: colors.button.primary,
    },
    pinnedReportCard: {
      marginBottom: 12,
      backgroundColor: colors.card,
    },
    reportTitle: {
      color: colors.text,
    },
    reportDescription: {
      marginVertical: 8,
      color: colors.textSecondary,
    },
    reportMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statusChip: {
      height: 24,
    },
    chipText: {
      fontSize: 12,
    },
    dateText: {
      color: colors.textMuted,
    },
    viewMoreButton: {
      marginTop: 8,
    },
    actionsCard: {
      marginBottom: 16,
      backgroundColor: colors.surface,
    },
    actionsGrid: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      flex: 1,
      borderColor: colors.border,
    },
    actionButtonContent: {
      height: 44,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });
