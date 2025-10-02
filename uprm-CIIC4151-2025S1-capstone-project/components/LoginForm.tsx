import { View } from "react-native";
import { Text, Button } from "react-native-paper";

export default function LogInForm({ onSuccess }: { onSuccess: () => void }) {
  const handleLogin = () => {
    // Implement login logic here
    onSuccess();
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineMedium">Login Form</Text>
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
    </View>
  );
}
