import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Button, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Settings
      </Text>

      <List.Section title="General">
        <List.Item
          title="About Us"
          description="Learn more about our app"
          left={(props) => <List.Icon {...props} icon="information-outline" />}
          onPress={() => router.push("/about-us")}
        />
        <List.Item
          title="Contact Support"
          description="Reach out to our team"
          left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
          onPress={() => router.push("/contact-support")}
        />
      </List.Section>

      <List.Section title="Account">
        <List.Accordion
          title="Account Options"
          left={(props) => (
            <List.Icon {...props} icon="account-circle-outline" />
          )}
        >
          <Button
            onPress={() => router.push("/delete-account")}
            style={styles.button}
          >
            Delete Account
          </Button>
          <Button onPress={() => router.push("/logout")} style={styles.button}>
            Logout
          </Button>
        </List.Accordion>
      </List.Section>

      <List.Section title="Legal">
        <List.Item
          title="Terms and Conditions"
          left={(props) => (
            <List.Icon {...props} icon="file-document-outline" />
          )}
          onPress={() => router.push("/terms-and-conditions")}
        />
        <List.Item
          title="Privacy Policy"
          left={(props) => <List.Icon {...props} icon="shield-lock-outline" />}
          onPress={() => router.push("/privacy-policy")}
        />
      </List.Section>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 4,
    alignSelf: "flex-start",
  },
});
