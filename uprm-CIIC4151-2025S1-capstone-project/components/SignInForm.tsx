import { View } from "react-native";
import { Text, Button } from "react-native-paper";


export default function SignInForm({ onSuccess }: { onSuccess: () => void }) {

  const handleSignIn = () => {
    // Implement sign-in logic here
    onSuccess();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineMedium">Sign In Form</Text>
      <Button mode="contained" onPress={handleSignIn}>
        Sign In
      </Button>
    </View>
  );
}
