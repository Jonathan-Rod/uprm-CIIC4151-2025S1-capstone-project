import FABCreateReport from "@/components/FABCreateReport";
import ReportCard from "@/components/ReportCard";
import { useAppColors } from "@/hooks/useAppColors";
import type { ReportCategory, ReportData } from "@/types/interfaces";
import { filterReports, getReports, searchReports } from "@/utils/api";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Menu,
  Searchbar,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

/** API response shape used by /reports, /reports/search, /reports/filter */
type ReportsResponse = {
  reports?: ReportData[];
  totalPages?: number;
};

type StatusFilter = "" | "open" | "in_progress" | "resolved" | "denied";

export default function ReportScreen() {
  const router = useRouter();
  const { colors } = useAppColors();

  // data
  const [reports, setReports] = useState<ReportData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // pagination (only for ALL feed)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // search
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // filter
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [menuVisible, setMenuVisible] = useState(false);

  // debounce
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const limit = 10;

  const styles = useMemo(() => createStyles(colors), [colors]);

  // -------------------------
  // Fetch helpers
  // -------------------------
  const loadExploreReports = async (page = 1, isRefresh = true) => {
    try {
      if (isRefresh) {
        setError("");
        setRefreshing(true);
      } else {
        setIsLoadingMore(true);
      }

      // If we're actively searching, don't fetch regular feed here
      if (query.trim()) return;

      let resp: ReportsResponse;

      if (statusFilter) {
        // Filtered results (simple first-page load)
        resp = (await filterReports(
          statusFilter,
          undefined,
          1,
          limit
        )) as ReportsResponse;
        setReports(resp.reports || []);
        setCurrentPage(1);
        setTotalPages(1);
      } else {
        // ALL (paginated)
        resp = (await getReports(page, limit)) as ReportsResponse;
        if (isRefresh) {
          setReports(resp.reports || []);
        } else {
          setReports((prev) => [...prev, ...(resp.reports || [])]);
        }
        setCurrentPage(page);
        setTotalPages(resp.totalPages || 1);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load reports");
      console.error("Error loading reports:", err);
    } finally {
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const loadSearchResults = async (q: string) => {
    if (!q.trim()) {
      // empty -> go back to feed (respecting current filter)
      setIsSearching(false);
      await loadExploreReports(1, true);
      return;
    }
    try {
      setError("");
      setIsSearching(true);
      setRefreshing(true);

      const resp = (await searchReports(q, 1, limit)) as ReportsResponse;
      setReports(resp.reports || []);
      // optional: you can also add pagination for search in the future
    } catch (err: any) {
      setError(err.message || "Failed to search");
      console.error("Error searching reports:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    loadExploreReports(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    // initial load
    loadExploreReports(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce query changes
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadSearchResults(query);
    }, 350);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // -------------------------
  // UI handlers
  // -------------------------
  const loadMoreReports = async () => {
    if (isSearching) return; // disable infinite scroll during search
    if (statusFilter) return; // no pagination for filtered list (first page only)
    if (currentPage >= totalPages || isLoadingMore || refreshing) return;
    const nextPage = currentPage + 1;
    await loadExploreReports(nextPage, false);
  };

  const onRefresh = () => {
    if (isSearching) {
      loadSearchResults(query);
    } else {
      loadExploreReports(1, true);
    }
  };

  const handleReportPress = (reportId: number) => {
    router.push({
      pathname: "/(modals)/report-view",
      params: { id: reportId.toString() },
    });
  };

  const handleCreateReport = () => {
    router.push("/(modals)/report-form");
  };

  const onSelectFilter = (value: StatusFilter) => {
    setMenuVisible(false);
    setStatusFilter(value);
    // when changing the filter, clear search
    if (query) setQuery("");
  };

  const renderReportItem = ({ item }: { item: ReportData }) => (
    <ReportCard
      report={{ ...item, category: item.category as ReportCategory }}
      onPress={() => handleReportPress(item.id)}
    />
  );

  const renderFooter = () => {
    if (isSearching || statusFilter || !isLoadingMore) return null;
    return (
      <ActivityIndicator
        style={{ paddingVertical: 16 }}
        size="small"
        color={colors.primary}
      />
    );
  };

  const renderEmptyComponent = () => {
    if (refreshing) {
      return (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 32 }}
          color={colors.primary}
        />
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Button
            mode="outlined"
            onPress={onRefresh}
            style={styles.retryButton}
            textColor={colors.error}
          >
            Retry
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {isSearching ? "No results found." : "No reports available."}
        </Text>
        <Text style={styles.emptySubtext}>
          {isSearching
            ? "Try a different keyword."
            : "Be the first to create a report!"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Explore
      </Text>

      {/* Search + Filter row */}
      <View style={styles.row}>
        <View style={styles.searchFlex}>
          <Searchbar
            value={query}
            onChangeText={setQuery}
            placeholder="Search reports..."
            style={styles.searchbar}
            inputStyle={{ fontSize: 16, color: colors.text }}
            iconColor={colors.textSecondary}
            clearIcon="close"
          />
        </View>

        {/* Filter button (menu) */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter-variant"
              onPress={() => setMenuVisible(true)}
              accessibilityLabel="Filter reports"
              style={styles.filterBtn}
            />
          }
          contentStyle={{ backgroundColor: colors.surface }}
        >
          <Menu.Item
            onPress={() => onSelectFilter("")}
            title="All"
            leadingIcon={statusFilter === "" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => onSelectFilter("open")}
            title="Open"
            leadingIcon={statusFilter === "open" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => onSelectFilter("in_progress")}
            title="In Progress"
            leadingIcon={statusFilter === "in_progress" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => onSelectFilter("resolved")}
            title="Resolved"
            leadingIcon={statusFilter === "resolved" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => onSelectFilter("denied")}
            title="Denied"
            leadingIcon={statusFilter === "denied" ? "check" : undefined}
          />
        </Menu>
      </View>

      {/* Results */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMoreReports}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />

      <FABCreateReport onPress={handleCreateReport} />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      margin: 16,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    searchFlex: {
      flex: 1,
    },
    searchbar: {
      borderRadius: 12,
      backgroundColor: colors.surface,
      elevation: 0,
    },
    filterBtn: {
      margin: 0,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 32,
      flexGrow: 1,
    },
    errorContainer: {
      padding: 16,
      alignItems: "center",
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
      paddingVertical: 32,
    },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      marginBottom: 8,
      color: colors.textSecondary,
    },
    emptySubtext: {
      textAlign: "center",
      fontSize: 14,
      color: colors.textMuted,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });
