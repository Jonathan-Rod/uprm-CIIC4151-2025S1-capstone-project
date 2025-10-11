import { View, StyleSheet, Alert } from "react-native";
import ReportForm, { ReportData } from "@/components/ReportForm";
import { useState } from "react";
import { useRouter } from "expo-router";
import { getToken } from "@/utils/auth";

export default function ReportFormModal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ReportData) => {
    const token = await getToken();
    if (!token) {
      Alert.alert("Unauthorized", "You must be logged in to submit a report.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.0.2:5000/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          ocurredOn: data.ocurredOn.toISOString(),
          department: data.department,
        }),
      });

      const resData = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Report submitted successfully!");
        router.back(); // closes modal
        // No need for onAdded callback — ExploreScreen refreshes on focus
      } else {
        Alert.alert("Error", resData.error || "Failed to submit report");
      }
    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ReportForm onSubmit={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
