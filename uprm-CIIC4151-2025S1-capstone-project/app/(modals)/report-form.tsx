import ReportForm, { ReportFormRef } from "@/components/ReportForm";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { StyleSheet, Alert } from "react-native";
import { createReport } from "@/utils/api";
import type { ReportFormData } from "@/types/interfaces";
import { getStoredCredentials } from "@/utils/auth";
import { useState, useRef } from "react";
import { useAppColors } from "@/hooks/useAppColors";

export default function ReportFormModal() {
  const router = useRouter();
  const { colors } = useAppColors();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ReportFormRef>(null);

  const handleSubmit = async (data: ReportFormData) => {
    try {
      setLoading(true);

      console.log("Submitting report data:", data);

      const credentials = await getStoredCredentials();
      if (!credentials) {
        Alert.alert("Error", "Please log in to submit a report");
        router.replace("/");
        return;
      }

      if (!data.title || !data.description) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      const submissionData = {
        ...data,
        occurred_on: data.occurred_on || new Date().toISOString(),
      };

      console.log("Final submission data:", submissionData);

      await createReport(submissionData);
      formRef.current?.clearForm();

      Alert.alert("Success", "Report submitted successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Report submission error:", error);

      let errorMessage = "Failed to submit report. Please try again.";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      router.back();
    }
  };

  const handleClear = () => {
    formRef.current?.clearForm();
  };

  const styles = createStyles(colors);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Submit New Report
      </ThemedText>
      <ReportForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onClear={handleClear}
        loading={loading}
      />
    </ThemedView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    title: {
      marginBottom: 16,
      textAlign: "center",
      color: colors.text,
    },
  });
