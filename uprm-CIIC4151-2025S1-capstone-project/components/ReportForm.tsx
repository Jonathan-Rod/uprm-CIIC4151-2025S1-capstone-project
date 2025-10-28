import { ReportFormData, ReportCategory } from "@/types/interfaces";
import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { Button, Chip, TextInput, Text } from "react-native-paper";
import { useAppColors } from "@/hooks/useAppColors";
import { useRouter } from "expo-router";
import DateTimeSelector from "@/components/DateTimeSelector";

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
  const [category, setCategory] = useState<ReportCategory>(ReportCategory.OTHER);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [occurredOn, setOccurredOn] = useState<Date>(new Date());

  const categories = [
    { label: "Pothole", value: ReportCategory.POTHOLE },
    { label: "Street Light", value: ReportCategory.STREET_LIGHT },
    { label: "Traffic Signal", value: ReportCategory.TRAFFIC_SIGNAL },
    { label: "Road Damage", value: ReportCategory.ROAD_DAMAGE },
    { label: "Sanitation", value: ReportCategory.SANITATION },
    { label: "Other", value: ReportCategory.OTHER },
  ];

  // Clear form function
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setCategory(ReportCategory.OTHER);
    setLocationId(null);
    setImageUrl("");
    setOccurredOn(new Date());
    onClear?.();
  };

  const isFormValid = () => {
    return title.trim() !== "" && description.trim() !== "";
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (!onSubmit) {
      return;
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

        {/* TODO fix date picker for phone */}
        {/* Occurred On Section */}
        {/* <View style={styles.section}>
          <Text variant="bodyMedium" style={styles.sectionLabel}>
            Occurred On *
          </Text>
          <DateTimeSelector
            value={occurredOn}
            onChange={setOccurredOn}
            disabled={loading}
          />
        </View> */}

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
          <Text variant="bodySmall" style={styles.helperTextContent}>
            Select date and time from dropdowns
          </Text>
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