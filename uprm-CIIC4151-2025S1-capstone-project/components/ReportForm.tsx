import { ReportData } from "@/mocks/mockReports";
import "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Chip, TextInput } from "react-native-paper";

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

  // TODO: #35 SegmentedButtons need to be allocate vertical in each case (variant screen sizes)
  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
      />
      <TextInput
        label="Occurred On"
        value={ocurredOn.toISOString()} // ISO string for now
        onChangeText={(value) => setOcurredOn(new Date(value))}
        mode="outlined"
      />
      <View style={styles.chipContainer}>
        {departments.map((dept) => (
          <Chip
            key={dept.value}
            selected={department === dept.value}
            onPress={() => setDepartment(dept.value)}
            mode="outlined"
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
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 8,
  },
});
