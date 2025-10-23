import ReportForm from "@/components/ReportForm";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { StyleSheet, Alert } from "react-native";
import { createReport } from "@/utils/api";
import type { ReportFormData } from "@/types/interfaces";

export default function ReportFormModal() {
  const router = useRouter();

  const handleSubmit = async (data: ReportFormData) => {
    try {
      await createReport(data);
      Alert.alert("Success", "Report submitted successfully!");
      router.back();
    } catch (error) {
      console.error("Report submission error:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Report Form</ThemedText>
      <ReportForm onSubmit={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
