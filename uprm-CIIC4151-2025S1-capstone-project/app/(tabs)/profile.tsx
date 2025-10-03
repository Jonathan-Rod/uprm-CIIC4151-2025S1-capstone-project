import { View } from "react-native";
import { Text } from "react-native-paper";

import { Colors } from "@/constants/theme";
import { mockReports } from '@/mocks/report';
import { getRole, getToken } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {

  const [user, setUser] = useState<any>(null);
  const [reports] = useState(mockReports);

  const [pinnedReports, setPinnedReports] = useState([]);
  const [lastThreeVisitedReports, setLastThreeVisitedReports] = useState([]);
  const [lastReportDate, setLastReportDate] = useState(null);
  const [numberOfReportsFiled, setNumberOfReportsFiled] = useState(0);
  const [numberOfReportsResolved, setNumberOfReportsResolved] = useState(0);
  const [numberOfReportsPending, setNumberOfReportsPending] = useState(0);
  const [reportsResolvedByAdmin, setReportsResolvedByAdmin] = useState(0);
  const [reportsAssignedToAdmin, setReportsAssignedToAdmin] = useState(0);
  const [reportsPendingByAdmin, setReportsPendingByAdmin] = useState(0);

  useEffect(() => {
    const fetchUserAndReports = async () => {
      const tokenResult = await getToken();
      const roleResult = await getRole();

      // You may need to parse tokenResult to get the user object, depending on your implementation
      // For example, if tokenResult is a JWT, decode it to get user info
      // Here, we assume tokenResult is a JSON string with a 'user' property
      let parsedUser = null;
      if (tokenResult && roleResult) {
        try {
          parsedUser = JSON.parse(tokenResult).user;
          parsedUser.role = roleResult;
        } catch (e) {
          parsedUser = null;
        }
      }
      setUser(parsedUser);

      if (reports && parsedUser) {
        const pinnedReports = null; //reports.filter(report => report.status !== 'pending' && report.pinned);
        setPinnedReports(pinnedReports);

        const lastThreeVisitedReports = null; //reports.slice(-3);
        setLastThreeVisitedReports(lastThreeVisitedReports);

        const lastReportDate = null; //reports[reports.length - 1]?.createdAt;
        setLastReportDate(lastReportDate);

        const numberOfReportsFiled = reports.length;
        setNumberOfReportsFiled(numberOfReportsFiled);

        const numberOfReportsResolved = reports.filter(report => report.status === 'resolved').length;
        setNumberOfReportsResolved(numberOfReportsResolved);

        const numberOfReportsPending = reports.filter(report => report.status === 'pending').length;
        setNumberOfReportsPending(numberOfReportsPending);

        if (parsedUser.role === 'admin') {
          const reportsResolvedByAdmin = reports.filter(report => report.status === 'resolved' && report.resolvedBy === parsedUser.id).length;
          setReportsResolvedByAdmin(reportsResolvedByAdmin);

          const reportsAssignedToAdmin = reports.filter(report => report.validatedBy === parsedUser.id).length;
          setReportsAssignedToAdmin(reportsAssignedToAdmin);

          const reportsPendingByAdmin = reports.filter(report => report.validatedBy === parsedUser.id && report.status === 'pending').length;
          setReportsPendingByAdmin(reportsPendingByAdmin);
        }
      }
    };

    fetchUserAndReports();
  }, []);

  return (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Profile</Text>

      {/* ---- User Card ---- */}
      <View style={styles.card}>
        {user ? (
          <>
            <Text style={styles.name}>{user.name ?? 'User'}</Text>
            {!!user.email && <Text style={styles.muted}>{user.email}</Text>}
            {!!user.role && (
              <Text style={styles.roleBadge}>{String(user.role).toUpperCase()}</Text>
            )}
          </>
        ) : (
          <Text style={styles.muted}>Not signed in.</Text>
        )}
      </View>

      {/* ---- Overall Stats ---- */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your report activity</Text>

        <View style={styles.statsGrid}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{numberOfReportsFiled}</Text>
            <Text style={styles.statLabel}>Filed</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statValue}>{numberOfReportsResolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statValue}>{numberOfReportsPending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statValue}>{pinnedReports.length}</Text>
            <Text style={styles.statLabel}>Pinned</Text>
          </View>
        </View>

        <Text style={styles.muted}>
          Last report:{' '}
          {lastReportDate ? new Date(lastReportDate).toLocaleString() : '—'}
        </Text>
      </View>

      {/* ---- Admin-only Stats ---- */}
      {user?.role === 'admin' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Admin</Text>
          <View style={styles.rowBetween}>
            <Text>Assigned to you</Text>
            <Text style={styles.value}>{reportsAssignedToAdmin}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Pending (yours)</Text>
            <Text style={styles.value}>{reportsPendingByAdmin}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Resolved by you</Text>
            <Text style={styles.value}>{reportsResolvedByAdmin}</Text>
          </View>
        </View>
      )}

      {/* ---- Pinned Reports ---- */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Pinned reports</Text>
        {pinnedReports.length ? (
          pinnedReports.map((r: any, i: number) => (
            <View key={r.id ?? `pinned-${i}`} style={styles.reportRow}>
              <Text style={styles.reportTitle}>{r.title ?? `Report #${r.id ?? i + 1}`}</Text>
              <Text style={styles.reportMeta}>
                {r.status}{' '}
                {r.createdAt ? `• ${new Date(r.createdAt).toLocaleDateString()}` : ''}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.muted}>No pinned reports</Text>
        )}
      </View>

      {/* ---- Last 3 Visited ---- */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Last 3 visited</Text>
        {lastThreeVisitedReports.length ? (
          lastThreeVisitedReports.map((r: any, i: number) => (
            <View key={r.id ?? `visited-${i}`} style={styles.reportRow}>
              <Text style={styles.reportTitle}>{r.title ?? `Report #${r.id ?? i + 1}`}</Text>
              <Text style={styles.reportMeta}>
                {r.status}{' '}
                {r.createdAt ? `• ${new Date(r.createdAt).toLocaleDateString()}` : ''}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.muted}>—</Text>
        )}
      </View>
    </ScrollView>
  </SafeAreaView>
);


}
//const colorScheme = useColorScheme();
const styles = StyleSheet.create({
  container: { flex: 1,},
  content: { padding: 16, gap: 12 },
  pageTitle: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  card: {
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  name: { fontSize: 20, fontWeight: '600' },
  muted: { color: Colors.dark.muted }, // Use muted color from theme
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
  },
  stat: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  statValue: { fontSize: 18, fontWeight: '700' },
  statLabel: { marginTop: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  value: { fontWeight: '700' },
  reportRow: {
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  reportTitle: { fontWeight: '600' },
  reportMeta: { fontSize: 12, marginTop: 2 },
});
