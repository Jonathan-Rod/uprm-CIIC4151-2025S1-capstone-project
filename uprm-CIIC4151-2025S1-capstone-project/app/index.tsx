import { useState } from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
// import LoginForm from "@/components/LoginForm";
import LoginForm from "../components/LoginForm"; // modified


export default function SignScreen() {
  const [isNewUser] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text
        variant="headlineMedium"
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        {isNewUser ? "Create Account" : "Welcome Back"}
      </Text>

        <LoginForm onSuccess={handleSuccess} />
    </View>
  );
}
