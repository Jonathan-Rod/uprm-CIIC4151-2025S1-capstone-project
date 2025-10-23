// components/DateTimeSelect.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, SegmentedButtons } from "react-native-paper";

interface DateTimeSelectProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}

export default function DatePicker({
  value,
  onChange,
  label = "Date and Time"
}: DateTimeSelectProps) {
  // Ensure the date is valid, use current date as default
  const safeDate = value instanceof Date && !isNaN(value.getTime())
    ? value
    : new Date();

  const [day, setDay] = useState<number>(safeDate.getDate());
  const [month, setMonth] = useState<number>(safeDate.getMonth());
  const [year, setYear] = useState<number>(safeDate.getFullYear());
  const [hour, setHour] = useState<number>(safeDate.getHours() % 12 || 12); // Convert to 12-hour format
  const [minute, setMinute] = useState<number>(safeDate.getMinutes());
  const [ampm, setAmPm] = useState<string>(safeDate.getHours() >= 12 ? "PM" : "AM");

  // Generate options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Update date when values change
  useEffect(() => {
    // Convert 12h to 24h format
    let hour24 = hour;
    if (ampm === "PM" && hour !== 12) {
      hour24 = hour + 12;
    } else if (ampm === "AM" && hour === 12) {
      hour24 = 0;
    }

    const newDate = new Date(year, month, day, hour24, minute);

    // Only update if date is valid
    if (!isNaN(newDate.getTime())) {
      onChange(newDate);
    }
  }, [day, month, year, hour, minute, ampm, onChange]);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.label}>{label}</Text>

      {/* Date */}
      <View style={styles.row}>
        <View style={styles.selectContainer}>
          <Text variant="labelMedium">Day</Text>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            style={styles.select}
          >
            {days.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </View>

        <View style={styles.selectContainer}>
          <Text variant="labelMedium">Month</Text>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={styles.select}
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </View>

        <View style={styles.selectContainer}>
          <Text variant="labelMedium">Year</Text>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={styles.select}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </View>
      </View>

      {/* Time */}
      <View style={styles.row}>
        <View style={styles.selectContainer}>
          <Text variant="labelMedium">Hour</Text>
          <select
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            style={styles.select}
          >
            {hours.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </View>

        <View style={styles.selectContainer}>
          <Text variant="labelMedium">Minute</Text>
          <select
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
            style={styles.select}
          >
            {minutes.map(m => (
              <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
            ))}
          </select>
        </View>

        <View style={styles.selectContainer}>
          <Text variant="labelMedium">AM/PM</Text>
          <SegmentedButtons
            value={ampm}
            onValueChange={setAmPm}
            buttons={[
              { value: 'AM', label: 'AM' },
              { value: 'PM', label: 'PM' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
      </View>

      {/* Selected Date Display */}
      <View style={styles.selectedDate}>
        <Text variant="bodyMedium">
          Selected: {safeDate.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0a5',
    borderRadius: 6,
  },
  label: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  selectContainer: {
    flex: 1,
  },
  select: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 4,
    // backgroundColor: 'white',
    fontSize: 16,
  },
  segmentedButtons: {
    marginTop: 4,
  },
  selectedDate: {
    marginTop: 12,
    padding: 12,
    // backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    // borderColor: '#e0e0e0',
  },
});