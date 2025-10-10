import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function DeleteAccountModal() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    // TODO: Delete account using API
    console.log("Delete Account");
    router.push("/");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Delete Account</ThemedText>
      <Text variant="bodyMedium" style={styles.text}>
        Are you sure you want to delete your account?
      </Text>
      <View style={styles.options}>
        <Button mode="outlined" onPress={handleDeleteAccount}>
          Delete Account
        </Button>
        <Button mode="outlined" onPress={() => router.back()}>
          Cancel
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
    flexDirection: "row",
    gap: 15,
    marginTop: 20,
  },
});
