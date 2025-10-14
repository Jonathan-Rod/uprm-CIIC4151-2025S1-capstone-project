import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function PrivacyPolicyModal() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Privacy Policy</ThemedText>
      <View style={styles.options}>
        <Text variant="bodyMedium" style={styles.text}>
          Here Privacy Policy Text
        </Text>
        <Button mode="outlined" onPress={() => router.back()}>
          Back
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    marginVertical: 12,
  },
  options: {
    gap: 15,
    marginTop: 20,
  },
});
