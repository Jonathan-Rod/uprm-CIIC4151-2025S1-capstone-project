import { ReportData } from "@/mocks/mockReports";
import "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Chip, TextInput } from "react-native-paper";

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
    if (!isFormValid()) return;
    const reportData: ReportData = {
      title,
      description,
      ocurredOn,
      department: department as ReportData["department"],
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
        value={ocurredOn.toISOString().split("T")[0]}
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
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 8,
  },
});
