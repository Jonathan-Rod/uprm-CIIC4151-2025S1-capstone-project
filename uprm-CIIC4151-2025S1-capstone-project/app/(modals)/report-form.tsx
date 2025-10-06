import ReportForm from "@/components/ReportForm";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { addReport } from "@/mocks/mockReports";
export default function ReportFormModal() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    // TODO: Send 'data' to the backend API endpoint for report submission.
    const uniqueId = `report-${Date.now()}`;
    addReport(uniqueId, data);
    console.log("Report submitted:", data);
    router.back(); // or router.replace("/home") if needed
  };

  return (
    <View style={styles.container}>
      <ReportForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

// import { useState } from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { Text, Button, TextInput, Surface, Chip } from "react-native-paper";
// import { Link } from "expo-router";
// import { ThemedView } from "@/components/themed-view";
// import { ThemedText } from "@/components/themed-text";

// export default function ReportFormModalScreen() {
//   const [selectedDepartment, setSelectedDepartment] = useState<
//     keyof typeof reportTypes | null
//   >(null);
//   const [selectedReportType, setSelectedReportType] = useState<string | null>(
//     null
//   );
//   const [fields, setFields] = useState({
//     field1: "",
//     field2: "",
//     field3: "",
//     field4: "",
//   });

//   const departments = [
//     "Department 1",
//     "Department 2",
//     "Department 3",
//     "Department 4",
//   ];

//   const reportTypes = {
//     "Department 1": ["Form 1", "Form 2"],
//     "Department 2": ["Form 1", "Form 2"],
//     "Department 3": ["Form 1", "Form 2", "Form 3"],
//     "Department 4": ["Form 1", "Form 2"],
//   };

//   const handleDepartmentSelect = (department: keyof typeof reportTypes) => {
//     setSelectedDepartment(department);
//     setSelectedReportType(null);
//   };

//   const handleReportTypeSelect = (reportType: string) => {
//     setSelectedReportType(reportType);
//   };

//   const handleFieldChange = (key: keyof typeof fields, value: string) => {
//     setFields((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = () => {
//     const isValid = Object.values(fields).every((val) => val.trim() !== "");
//     if (!isValid) {
//       alert("Please fill out all fields.");
//       return;
//     }
//     alert("Form submitted!");
//     setSelectedDepartment(null);
//     setSelectedReportType(null);
//     setFields({ field1: "", field2: "", field3: "", field4: "" });
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={{ flex: 1 }}
//     >
//       <ThemedView style={styles.container}>
//         <Surface style={styles.chipBar}>
//           {departments.map((dept) => (
//             <Chip
//               key={dept}
//               selected={selectedDepartment === dept}
//               onPress={() =>
//                 handleDepartmentSelect(dept as keyof typeof reportTypes)
//               }
//               style={styles.chip}
//             >
//               {dept}
//             </Chip>
//           ))}
//         </Surface>

//         {selectedDepartment && !selectedReportType && (
//           <Surface style={styles.chipGroup}>
//             {reportTypes[selectedDepartment].map((type) => (
//               <Chip
//                 key={type}
//                 onPress={() => handleReportTypeSelect(type)}
//                 style={styles.chip}
//               >
//                 {type}
//               </Chip>
//             ))}
//           </Surface>
//         )}

//         {selectedReportType && (
//           <ScrollView contentContainerStyle={styles.formContainer}>
//             <Text variant="titleMedium" style={styles.formTitle}>
//               Fill the {selectedReportType} Form
//             </Text>
//             {Object.keys(fields).map((key) => (
//               <TextInput
//                 key={key}
//                 label={key.replace("field", "Field ")}
//                 value={fields[key as keyof typeof fields]}
//                 onChangeText={(text) =>
//                   handleFieldChange(key as keyof typeof fields, text)
//                 }
//                 style={styles.input}
//                 mode="outlined"
//               />
//             ))}
//             <Button
//               mode="contained"
//               onPress={handleSubmit}
//               style={styles.submit}
//             >
//               Submit
//             </Button>
//           </ScrollView>
//         )}

//         <Link href="/(tabs)/home" dismissTo style={styles.link}>
//           <ThemedText type="link">Go to home sffcreen</ThemedText>
//         </Link>
//       </ThemedView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   chipBar: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: 20,
//     padding: 8,
//     elevation: 2,
//   },
//   chipGroup: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: 20,
//     padding: 8,
//     elevation: 1,
//   },
//   chip: {
//     margin: 4,
//   },
//   formContainer: {
//     paddingVertical: 20,
//   },
//   formTitle: {
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     marginBottom: 12,
//   },
//   submit: {
//     marginTop: 16,
//   },
//   link: {
//     marginTop: 15,
//     paddingVertical: 15,
//   },
// });
