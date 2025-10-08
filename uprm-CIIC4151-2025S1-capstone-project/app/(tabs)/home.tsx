import ReportCard from "@/components/ReportCard";
//import { mockReports } from "@/mocks/reports";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text variant="headlineMedium" style={{ margin: 16 }}>
          Mock Reports
        </Text>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          data={[]}
          renderItem={({ item }) => <ReportCard report={item} />}
          //keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 32 }}>
              No reports available.
            </Text>
          }
        />
        <FAB
          icon={"plus"}
          style={styles.fab}
          onPress={() => router.push("/report-form")}
        ></FAB>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
