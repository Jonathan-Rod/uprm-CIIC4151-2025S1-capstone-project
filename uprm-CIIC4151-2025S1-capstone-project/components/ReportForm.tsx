import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import { ReportData } from "@/mocks/mockReports";

export default function ReportForm({
  onSubmit,
}: {
  onSubmit?: (data: ReportData) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // TODO: #32 Replace with date picker
  const [ocurredOn, setOcurredOn] = useState(new Date());
  const [department, setDepartment] = useState("");

  const isFormValid = () => {
    return (
      title.trim() !== "" &&
      description.trim() !== "" &&
      ocurredOn instanceof Date &&
      department.trim() !== ""
    );
  };

  const handleSubmit = () => {
    const reportData: ReportData = {
      title,
      description,
      ocurredOn: ocurredOn,
      department: department as
        | "infrastructure"
        | "energy_water"
        | "sanitation"
        | "environment_security",
      status: "created",
      createdAt: new Date(),
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
        value={ocurredOn.toISOString()} // ISO string for now
        onChangeText={(value) => setOcurredOn(new Date(value))}
        mode="outlined"
        style={styles.input}
      />
      <SegmentedButtons
        density="small"
        value={department}
        onValueChange={setDepartment}
        buttons={[
          {
            value: "infrastructure",
            label: "Infrastructure",
            icon: "road-variant",
          },
          {
            value: "energy_water",
            label: "Energy & Water",
            icon: "water",
          },
          {
            value: "sanitation",
            label: "Sanitation",
            icon: "trash-can",
          },
          {
            value: "environment_security",
            label: "Environment & Security",
            icon: "shield-check",
          },
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
      <Button mode="contained" onPress={handleSubmit} disabled={!isFormValid()}>
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
  },
  input: {
    backgroundColor: "transparent",
  },
});
