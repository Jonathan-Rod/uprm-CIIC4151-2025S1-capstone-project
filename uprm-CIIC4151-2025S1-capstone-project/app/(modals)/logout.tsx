import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { deleteToken } from "@/utils/auth";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function LogoutModal() {
  const router = useRouter();

  const handleLogOut = async () => {
  console.log("Log Out");

  await deleteToken();
  router.push("/");
};


  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Log Out</ThemedText>
      <Text variant="bodyMedium" style={styles.text}>
        Are you sure you want to log out?
      </Text>
      <View style={styles.options}>
        <Button mode="outlined" onPress={handleLogOut}>
          Log Out
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
