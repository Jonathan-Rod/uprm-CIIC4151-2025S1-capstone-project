import { deleteToken, saveRole } from "@/utils/auth";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { List, Text } from "react-native-paper";

export default function SettingsScreen() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    // Delete user data from LocalStorage
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(ROLE_KEY);

    // Navigate to login screen
    router.replace("/");
  };

  const handleLogout = async () => {
    // Log the user out
    await deleteToken();
    await saveRole("civilian");

    // Navigate to login screen
    router.replace("/");
  };

  const handleAboutUs = () => {
    // Navigate to About Us screen
    router.replace("/about-us");
  };

  const handleContactSupport = () => {
    // Navigate to Contact Support screen
    router.replace("/contact-support");
  };

  const handleTermsAndConditions = () => {
    // Navigate to Terms and Conditions screen
    router.replace("/terms-and-conditions");
  };

  const handlePrivacyPolicy = () => {
    // Navigate to Privacy Policy screen
    router.replace("/privacy-policy");
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium">Settings</Text>
      <List.Section title="Account">
        <List.Accordion
          title="Delete Account"
          left={props => <List.Icon {...props} icon="delete" />}
          onPress={handleDeleteAccount}>
          <Text variant="bodyMedium">Are you sure you want to delete your account?</Text>
        </List.Accordion>
      </List.Section>
      <List.Section title="Authentication">
        <List.Accordion
          title="Logout"
          left={props => <List.Icon {...props} icon="logout" />}
          onPress={handleLogout}>
          <Text variant="bodyMedium">Are you sure you want to logout?</Text>
        </List.Accordion>
      </List.Section>
      <List.Section title="Help">
        <List.Accordion
          title="About Us"
          left={props => <List.Icon {...props} icon="info" />}
          onPress={handleAboutUs}>
          <Text variant="bodyMedium">Learn more about our app.</Text>
        </List.Accordion>
        <List.Accordion
          title="Contact Support"
          left={props => <List.Icon {...props} icon="help" />}
          onPress={handleContactSupport}>
          <Text variant="bodyMedium">Contact our support team.</Text>
        </List.Accordion>
      </List.Section>
      <List.Section title="Legal">
        <List.Accordion
          title="Terms and Conditions"
          left={props => <List.Icon {...props} icon="file-document" />}
          onPress={handleTermsAndConditions}>
          <Text variant="bodyMedium">View our terms and conditions.</Text>
        </List.Accordion>
        <List.Accordion
          title="Privacy Policy"
          left={props => <List.Icon {...props} icon="file-document" />}
          onPress={handlePrivacyPolicy}>
          <Text variant="bodyMedium">View our privacy policy.</Text>
        </List.Accordion>
      </List.Section>
    </View>
  );
}
