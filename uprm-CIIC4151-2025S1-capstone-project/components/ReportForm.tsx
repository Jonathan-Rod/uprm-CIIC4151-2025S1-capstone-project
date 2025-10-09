import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, SegmentedButtons } from "react-native-paper";
import { useState } from "react";

export type ReportData = {
  title: string;
  description: string;
  ocurredOn: Date;
  department: "infrastructure" | "energy_water" | "sanitation" | "environment_security";
};

export default function ReportForm({
  onSubmit,
  loading = false,
}: {
  onSubmit?: (data: ReportData) => void;
  loading?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ocurredOn, setOcurredOn] = useState(new Date());
  const [department, setDepartment] = useState("");

  const isFormValid = () =>
    title.trim() !== "" &&
    description.trim() !== "" &&
    department.trim() !== "" &&
    ocurredOn instanceof Date;

  const handleSubmit = () => {
    if (!isFormValid()) return;
    const reportData: ReportData = {
      title,
      description,
      ocurredOn,
      department: department as ReportData["department"],
    };
    if (onSubmit) onSubmit(reportData);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>
        Create a New Report
      </Text>

      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Occurred On"
        value={ocurredOn.toISOString().split("T")[0]}
        onChangeText={(value) => setOcurredOn(new Date(value))}
        mode="outlined"
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.sectionLabel}>
        Department
      </Text>
      <SegmentedButtons
        density="small"
        value={department}
        onValueChange={setDepartment}
        buttons={[
          { value: "infrastructure", label: "Infrastructure", icon: "road-variant" },
          { value: "energy_water", label: "Energy & Water", icon: "water" },
          { value: "sanitation", label: "Sanitation", icon: "trash-can" },
          { value: "environment_security", label: "Environment & Security", icon: "shield-check" },
        ]}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!isFormValid() || loading}
        loading={loading}
      >
        Submit Report
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  heading: {
    marginBottom: 8,
    textAlign: "center",
  },
  sectionLabel: {
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: "transparent",
  },
});
