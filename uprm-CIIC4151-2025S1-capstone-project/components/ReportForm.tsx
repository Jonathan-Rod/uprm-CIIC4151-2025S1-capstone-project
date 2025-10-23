// components/ReportForm.tsx
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Chip, TextInput } from "react-native-paper";
import DatePicker from "@/components/DatePicker";
import { ReportFormData } from "@/types/interfaces";

export default function ReportForm({
  onSubmit,
  loading = false,
}: {
  onSubmit?: (data: ReportFormData) => void;
  loading?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ocurredOn, setOcurredOn] = useState(new Date()); // Current date as initial value
  const [department, setDepartment] = useState("");

  const departments = [
    { label: "Infrastructure", value: "infrastructure" },
    { label: "Energy & Water", value: "energy_water" },
    { label: "Sanitation", value: "sanitation" },
    { label: "Environment & Security", value: "environment_security" },
  ];

  const isFormValid = () => {
    return (
      title.trim() !== "" &&
      description.trim() !== "" &&
      ocurredOn instanceof Date &&
      department.trim() !== "" &&
      !isNaN(ocurredOn.getTime())
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    const reportData: ReportFormData = {
      title,
      description,
      ocurred_on: ocurredOn,
      department,
    };
    if (onSubmit) onSubmit(reportData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        disabled={loading}
        style={styles.input}
      />

      <DatePicker
        value={ocurredOn}
        onChange={setOcurredOn} // This updates the ocurredOn state
        label="Occurred On"
      />

      <View style={styles.chipContainer}>
        {departments.map((dept) => (
          <Chip
            key={dept.value}
            selected={department === dept.value}
            onPress={() => setDepartment(dept.value)}
            mode="outlined"
            style={styles.chip}
            accessibilityLabel={`Select department: ${dept.label}`}
          >
            {dept.label}
          </Chip>
        ))}
      </View>

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={5}
        disabled={loading}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!isFormValid() || loading}
        loading={loading}
        style={styles.button}
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
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 8,
  },
  input: {
    // backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
  },
  chip: {
    margin: 2,
  },
});