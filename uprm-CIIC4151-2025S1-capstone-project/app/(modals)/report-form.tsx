import ReportForm from "@/components/ReportForm";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function ReportFormModal() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    // TODO: Send 'data' to the backend API endpoint for report submission.

    console.log("Report submitted:", data);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Report Form</ThemedText>
      <ReportForm onSubmit={handleSubmit}></ReportForm>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
