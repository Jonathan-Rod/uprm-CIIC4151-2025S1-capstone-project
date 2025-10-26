import { ReportFormData, ReportCategory } from "@/types/interfaces";
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, ScrollView, Alert, Platform } from "react-native";
import { Button, Chip, TextInput, Text } from "react-native-paper";
import DateTimePicker from "expo-datetimepicker";
import { useAppColors } from "@/hooks/useAppColors";
import { useRouter } from "expo-router";

export interface ReportFormRef {
  clearForm: () => void;
}

interface ReportFormProps {
  onSubmit?: (data: ReportFormData) => void;
  onCancel?: () => void;
  onClear?: () => void;
  loading?: boolean;
}

export default function ReportForm({
  onSubmit,
  onCancel,
  onClear,
  loading = false,
}: ReportFormProps) {
  const router = useRouter();
  const { colors } = useAppColors();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ReportCategory>(
    ReportCategory.OTHER
  );
  const [locationId, setLocationId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [occurredOn, setOccurredOn] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Separate date fields for web
  const [day, setDay] = useState<string>(new Date().getDate().toString());
  const [month, setMonth] = useState<string>(
    (new Date().getMonth() + 1).toString()
  );
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());

  const categories = [
    { label: "Pothole", value: ReportCategory.POTHOLE },
    { label: "Street Light", value: ReportCategory.STREET_LIGHT },
    { label: "Traffic Signal", value: ReportCategory.TRAFFIC_SIGNAL },
    { label: "Road Damage", value: ReportCategory.ROAD_DAMAGE },
    { label: "Sanitation", value: ReportCategory.SANITATION },
    { label: "Other", value: ReportCategory.OTHER },
  ];

  // Generate date options
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) =>
    (currentYear - 2 + i).toString()
  );

  // Handle web date field changes
  const handleWebDateChange = useCallback(() => {
    if (day && month && year) {
      const newDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        new Date().getHours(),
        new Date().getMinutes()
      );

      if (!isNaN(newDate.getTime())) {
        setOccurredOn(newDate);
      }
    }
  }, [day, month, year]);

  // Clear form function
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setCategory(ReportCategory.OTHER);
    setLocationId(null);
    setImageUrl("");
    setOccurredOn(new Date());
    setShowDatePicker(false);

    // Reset web date fields to current date
    const now = new Date();
    setDay(now.getDate().toString());
    setMonth((now.getMonth() + 1).toString());
    setYear(now.getFullYear().toString());

    onClear?.();
  };

  const isFormValid = () => {
    return title.trim() !== "" && description.trim() !== "";
  };

  // Handle mobile date change
  const handleMobileDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setOccurredOn(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Auto-update date when web fields change
  useEffect(() => {
    if (Platform.OS === "web" && day && month && year) {
      handleWebDateChange();
    }
  }, [day, month, year, handleWebDateChange]);

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (!onSubmit) {
      return;
    }

    // For web, ensure the date is updated from fields
    if (Platform.OS === "web") {
      handleWebDateChange();
    }

    const reportData: ReportFormData = {
      title: title.trim(),
      description: description.trim(),
      category,
      location_id: locationId || undefined,
      image_url: imageUrl.trim() || undefined,
      occurred_on: occurredOn.toISOString(),
    };

    // Call the onSubmit callback
    onSubmit(reportData);

    // Navigate back after successful submission
    router.back();
  };

  const handleClear = () => {
    Alert.alert("Clear Form", "Are you sure you want to clear all fields?", [
      { text: "Keep Editing", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: clearForm,
      },
    ]);
  };

  const styles = createStyles(colors);

  // Web Date Selector Component
  const WebDateSelector = () => (
    <View style={styles.webDateContainer}>
      <View style={styles.dateField}>
        <Text variant="bodySmall" style={styles.dateFieldLabel}>
          Day *
        </Text>
        <View style={styles.selectContainer}>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            <option value="">Select Day</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </View>
      </View>

      <View style={styles.dateField}>
        <Text variant="bodySmall" style={styles.dateFieldLabel}>
          Month *
        </Text>
        <View style={styles.selectContainer}>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </View>
      </View>

      <View style={styles.dateField}>
        <Text variant="bodySmall" style={styles.dateFieldLabel}>
          Year *
        </Text>
        <View style={styles.selectContainer}>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </View>
      </View>
    </View>
  );

  // Mobile Date Picker Component
  const MobileDatePicker = () => (
    <>
      <Button
        mode="outlined"
        onPress={showDatepicker}
        disabled={loading}
        style={styles.dateButton}
        icon="calendar"
        contentStyle={styles.dateButtonContent}
        textColor={colors.text}
      >
        {formatDate(occurredOn)}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={occurredOn}
          mode="datetime"
          onChange={handleMobileDateChange}
          style={styles.datePicker}
        />
      )}
    </>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <TextInput
          label="Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          disabled={loading}
          style={styles.input}
          maxLength={100}
          placeholder="Brief description of the issue"
          textColor={colors.input.text}
          placeholderTextColor={colors.input.placeholder}
          outlineColor={colors.input.border}
          activeOutlineColor={colors.input.borderFocused}
        />

        <View style={styles.section}>
          <Text variant="bodyMedium" style={styles.sectionLabel}>
            Category *
          </Text>
          <View style={styles.chips}>
            {categories.map((cat) => (
              <Chip
                key={cat.value}
                selected={category === cat.value}
                onPress={() => setCategory(cat.value)}
                mode="outlined"
                style={[
                  styles.chip,
                  category === cat.value && {
                    backgroundColor: colors.chip.selectedBackground,
                  },
                ]}
                showSelectedCheck
                disabled={loading}
                selectedColor={
                  category === cat.value
                    ? colors.chip.selectedText
                    : colors.chip.text
                }
              >
                {cat.label}
              </Chip>
            ))}
          </View>
        </View>

        <TextInput
          label="Description *"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          disabled={loading}
          style={styles.input}
          maxLength={500}
          placeholder="Detailed description of what happened..."
          textColor={colors.input.text}
          placeholderTextColor={colors.input.placeholder}
          outlineColor={colors.input.border}
          activeOutlineColor={colors.input.borderFocused}
        />

        {/* Occurred On Section */}
        <View style={styles.section}>
          <Text variant="bodyMedium" style={styles.sectionLabel}>
            Occurred On *
          </Text>

          {Platform.OS === "web" ? (
            <>
              <WebDateSelector />
              <Text variant="bodySmall" style={styles.dateHelperText}>
                Selected: {formatDate(occurredOn)}
              </Text>
            </>
          ) : (
            <MobileDatePicker />
          )}
        </View>

        <TextInput
          label="Location ID (Optional)"
          value={locationId?.toString() || ""}
          onChangeText={(value) => {
            const id = value ? parseInt(value) : null;
            setLocationId(isNaN(id!) ? null : id);
          }}
          mode="outlined"
          disabled={loading}
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g., 123"
          textColor={colors.input.text}
          placeholderTextColor={colors.input.placeholder}
          outlineColor={colors.input.border}
          activeOutlineColor={colors.input.borderFocused}
        />

        <TextInput
          label="Image URL (Optional)"
          value={imageUrl}
          onChangeText={setImageUrl}
          mode="outlined"
          disabled={loading}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="https://example.com/image.jpg"
          textColor={colors.input.text}
          placeholderTextColor={colors.input.placeholder}
          outlineColor={colors.input.border}
          activeOutlineColor={colors.input.borderFocused}
        />

        <View style={styles.buttonContainer}>
          {onCancel && (
            <Button
              mode="outlined"
              onPress={onCancel}
              disabled={loading}
              style={styles.button}
              icon="close"
              textColor={colors.text}
            >
              Cancel
            </Button>
          )}
          <Button
            mode="outlined"
            onPress={handleClear}
            disabled={loading}
            style={styles.button}
            icon="eraser"
            textColor={colors.text}
          >
            Clear
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!isFormValid() || loading}
            loading={loading}
            style={[styles.button, styles.submitButton]}
            icon="send"
            textColor={colors.button.text}
          >
            Submit
          </Button>
        </View>

        <View style={styles.helperText}>
          <Text variant="bodySmall" style={styles.helperTextContent}>
            * Required fields
          </Text>
          <Text variant="bodySmall" style={styles.helperTextContent}>
            Character limits: Title (100), Description (500)
          </Text>
          {Platform.OS === "web" ? (
            <Text variant="bodySmall" style={styles.helperTextContent}>
              Select day, month, and year from dropdowns
            </Text>
          ) : (
            <Text variant="bodySmall" style={styles.helperTextContent}>
              Current date and time is pre-filled, tap to change
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      gap: 20,
      padding: 16,
    },
    input: {
      backgroundColor: colors.input.background,
    },
    section: {
      gap: 8,
    },
    sectionLabel: {
      fontWeight: "500",
      color: colors.textSecondary,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      margin: 2,
    },
    // Web Date Styles
    webDateContainer: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
    dateField: {
      flex: 1,
      gap: 4,
    },
    dateFieldLabel: {
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 4,
    },
    dateHelperText: {
      marginTop: 8,
      color: colors.textMuted,
      fontStyle: "italic",
    },
    selectContainer: {
      borderWidth: 1,
      borderColor: colors.input.border,
      borderRadius: 4,
      overflow: "hidden",
      backgroundColor: colors.input.background,
    },
    select: {
      width: "100%",
      padding: 12,
      outline: "none",
      backgroundColor: colors.input.background,
      fontSize: 16,
      color: colors.input.text,
    },
    // Mobile Date Styles
    dateButton: {
      backgroundColor: colors.input.background,
      borderColor: colors.input.border,
    },
    dateButtonContent: {
      height: 44,
      justifyContent: "space-between",
    },
    datePicker: {
      alignSelf: "center",
      marginTop: 8,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 8,
    },
    button: {
      flex: 1,
    },
    submitButton: {
      flex: 2,
      backgroundColor: colors.button.primary,
    },
    helperText: {
      marginTop: 16,
      padding: 12,
      backgroundColor: colors.backgroundMuted,
      borderRadius: 8,
      gap: 4,
    },
    helperTextContent: {
      color: colors.textMuted,
      textAlign: "center",
    },
  });
