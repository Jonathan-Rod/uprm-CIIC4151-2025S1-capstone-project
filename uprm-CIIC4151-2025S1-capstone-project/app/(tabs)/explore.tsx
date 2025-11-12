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
type CategoryFilter =
  | ""
  | "pothole"
  | "street_light"
  | "traffic_signal"
  | "road_damage"
  | "sanitation"
  | "other";
type SortOrder = "asc" | "desc";

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

  // filter & sort
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc"); // newest first

  // menus
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

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

      // If we're actively searching, the unified search path handles it
      if (query.trim()) return;

      let resp: ReportsResponse;

      if (statusFilter || categoryFilter) {
        // Filtered results (server-side; first page only)
        resp = (await filterReports(
          statusFilter || undefined,
          categoryFilter || undefined,
          1,
          limit,
          sortOrder
        )) as ReportsResponse;

        setReports(resp.reports || []);
        setCurrentPage(1);
        setTotalPages(resp.totalPages || 1);
      } else {
        // ALL (paginated, server-side sort)
        resp = (await getReports(page, limit, sortOrder)) as ReportsResponse;

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

  // Unified server-side search (q + status + category + sort)
  const loadSearchResults = async (q: string, nextStatus?: StatusFilter) => {
    const effectiveStatus = nextStatus ?? statusFilter;

    // If no query and no status/category selected, fall back to feed
    if (!q.trim() && !effectiveStatus && !categoryFilter) {
      setIsSearching(false);
      await loadExploreReports(1, true);
      return;
    }

    try {
      setError("");
      setIsSearching(!!q.trim());
      setRefreshing(true);

      const resp = (await searchReports(
        q.trim() || "",
        effectiveStatus || undefined,
        categoryFilter || undefined,
        1,
        limit,
        sortOrder
      )) as ReportsResponse;

      setReports(resp.reports || []);
      setCurrentPage(1);
      setTotalPages(resp.totalPages || 1);
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
    // initial load
    loadExploreReports(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when status/category/sort changes:
  // if there is an active search term, re-run search; else load filtered/sorted feed
  useEffect(() => {
    if (query.trim()) {
      loadSearchResults(query, statusFilter);
    } else {
      loadExploreReports(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, sortOrder]);

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
    if (statusFilter || categoryFilter) return; // no pagination for filtered list (first page only)
    if (currentPage >= totalPages || isLoadingMore || refreshing) return;
    const nextPage = currentPage + 1;
    await loadExploreReports(nextPage, false);
  };

  const onRefresh = () => {
    if (query.trim()) {
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

  const onSelectStatus = (value: StatusFilter) => {
    setStatusMenuVisible(false);
    setStatusFilter(value);
    // Do NOT clear the search bar — effects will re-run appropriately.
  };

  const onSelectCategory = (value: CategoryFilter) => {
    setCategoryMenuVisible(false);
    setCategoryFilter(value);
  };

  const onSelectSort = (value: SortOrder) => {
    setSortMenuVisible(false);
    setSortOrder(value);
  };

  const renderReportItem = ({ item }: { item: ReportData }) => (
    <ReportCard
      report={{ ...item, category: item.category as ReportCategory }}
      onPress={() => handleReportPress(item.id)}
    />
  );

  const renderFooter = () => {
    if (isSearching || statusFilter || categoryFilter || !isLoadingMore) return null;
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

    const hasFilter = !!(query.trim() || statusFilter || categoryFilter);
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {hasFilter ? "No results found." : "No reports available."}
        </Text>
        <Text style={styles.emptySubtext}>
          {hasFilter
            ? "Try a different keyword, status, category, or sort."
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

        {/* Status menu */}
        <Menu
          visible={statusMenuVisible}
          onDismiss={() => setStatusMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter-variant"
              onPress={() => setStatusMenuVisible(true)}
              accessibilityLabel="Filter by status"
              style={styles.filterBtn}
            />
          }
          contentStyle={{ backgroundColor: colors.surface }}
        >
          <Menu.Item
            onPress={() => onSelectStatus("")}
            title="All statuses"
            leadingIcon={statusFilter === "" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => onSelectStatus("open")}
            title="Open"
            leadingIcon={statusFilter === "open" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => onSelectStatus("in_progress")}
            title="In Progress"
            leadingIcon={statusFilter === "in_progress" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => onSelectStatus("resolved")}
            title="Resolved"
            leadingIcon={statusFilter === "resolved" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => onSelectStatus("denied")}
            title="Denied"
            leadingIcon={statusFilter === "denied" ? "check" : undefined}
          />
        </Menu>

        {/* Category menu */}
        <Menu
          visible={categoryMenuVisible}
          onDismiss={() => setCategoryMenuVisible(false)}
          anchor={
            <IconButton
              icon="shape"
              onPress={() => setCategoryMenuVisible(true)}
              accessibilityLabel="Filter by category"
              style={styles.filterBtn}
            />
          }
          contentStyle={{ backgroundColor: colors.surface }}
        >
          {(
            [
              ["", "All categories"],
              ["pothole", "Pothole"],
              ["street_light", "Street light"],
              ["traffic_signal", "Traffic signal"],
              ["road_damage", "Road damage"],
              ["sanitation", "Sanitation"],
              ["other", "Other"],
            ] as [CategoryFilter, string][]
          ).map(([value, label]) => (
            <Menu.Item
              key={value || "all"}
              onPress={() => onSelectCategory(value)}
              title={label}
              leadingIcon={categoryFilter === value ? "check" : undefined}
            />
          ))}
        </Menu>

        {/* Sort menu (created_at asc/desc) */}
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <IconButton
              icon={sortOrder === "desc" ? "sort-clock-descending" : "sort-clock-ascending"}
              onPress={() => setSortMenuVisible(true)}
              accessibilityLabel="Sort by date"
              style={styles.filterBtn}
            />
          }
          contentStyle={{ backgroundColor: colors.surface }}
        >
          <Menu.Item
            onPress={() => onSelectSort("desc")}
            title="Newest first"
            leadingIcon={sortOrder === "desc" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => onSelectSort("asc")}
            title="Oldest first"
            leadingIcon={sortOrder === "asc" ? "check" : undefined}
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
