import AdminStats from "@/components/AdminStats";
import PinnedReports from "@/components/PinnedReports";
import ReportStats from "@/components/ReportStats";
import UserCard from "@/components/UserCard";
import VisitedReports from "@/components/VisitedReports";

import { mockReports } from "@/mocks/report";
import { getToken } from "@/utils/auth";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [reports] = useState(mockReports);

  // Commented out until pinned/visited logic is implemented
  // const [pinnedReports, setPinnedReports] = useState([]);
  // const [lastThreeVisitedReports, setLastThreeVisitedReports] = useState([]);
  // const [lastReportDate, setLastReportDate] = useState(null);

  const [numberOfReportsFiled, setNumberOfReportsFiled] = useState(0);
  const [numberOfReportsResolved, setNumberOfReportsResolved] = useState(0);
  const [numberOfReportsPending, setNumberOfReportsPending] = useState(0);
  const [reportsResolvedByAdmin, setReportsResolvedByAdmin] = useState(0);
  const [reportsAssignedToAdmin, setReportsAssignedToAdmin] = useState(0);
  const [reportsPendingByAdmin, setReportsPendingByAdmin] = useState(0);

  useEffect(() => {
    const fetchUserAndReports = async () => {
      const tokenResult = await getToken();

      let parsedUser = null;
      if (tokenResult) {
        try {
          parsedUser = JSON.parse(tokenResult).user;
        } catch {
          parsedUser = null;
        }
      }
      setUser(parsedUser);

      if (reports && parsedUser) {
        // Commented out until pinned/visited logic is implemented
        // const pinned = reports.filter((r) => r.pinned && r.status !== "pending");
        // setPinnedReports(pinned);

        // const visited = reports.slice(-3);
        // setLastThreeVisitedReports(visited);

        // const lastDate = reports[reports.length - 1]?.createdAt ?? null;
        // setLastReportDate(lastDate);

        setNumberOfReportsFiled(reports.length);
        setNumberOfReportsResolved(
          reports.filter((r) => r.status === "resolved").length
        );
        setNumberOfReportsPending(
          reports.filter((r) => r.status === "pending").length
        );

        if (parsedUser.admin === true) {
          setReportsResolvedByAdmin(
            reports.filter(
              (r) => r.status === "resolved" && r.resolvedBy === parsedUser.id
            ).length
          );
          setReportsAssignedToAdmin(
            reports.filter((r) => r.validatedBy === parsedUser.id).length
          );
          setReportsPendingByAdmin(
            reports.filter(
              (r) => r.validatedBy === parsedUser.id && r.status === "pending"
            ).length
          );
        }
      }
    };

    fetchUserAndReports();
  }, [reports]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Profile</Text>

        <UserCard user={user} />

        <ReportStats
          filed={numberOfReportsFiled}
          resolved={numberOfReportsResolved}
          pending={numberOfReportsPending}
          pinned={0} // Placeholder until pinnedReports is re-enabled
          lastReportDate={null} // Placeholder until lastReportDate is re-enabled
        />

        {user?.admin === true && (
          <AdminStats
            assigned={reportsAssignedToAdmin}
            pending={reportsPendingByAdmin}
            resolved={reportsResolvedByAdmin}
          />
        )}

        {/* Commented out until logic is implemented */}
        {/* <PinnedReports reports={pinnedReports} /> */}
        {/* <VisitedReports reports={lastThreeVisitedReports} /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  pageTitle: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
});
