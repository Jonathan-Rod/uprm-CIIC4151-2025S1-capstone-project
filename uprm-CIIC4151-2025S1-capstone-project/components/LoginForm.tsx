import { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { saveToken } from "../utils/auth";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hasErrors = () => !email.includes("@") || password.length < 6;

  const handleLogin = async () => {
    if (hasErrors()) return;
    await saveToken("user-token");
    onSuccess();
  };

  const handleForgotPassword = () => {
    // You can navigate to a reset screen or show a modal
    console.log("Forgot password tapped");
  };

  return (
    <View style={{ gap: 12 }}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <HelperText type="error" visible={!email.includes("@")}>
        Enter a valid email address
      </HelperText>

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <HelperText type="error" visible={password.length < 6}>
        Password must be at least 6 characters
      </HelperText>

      <Button mode="text" onPress={handleForgotPassword}>
        Forgot Password?
      </Button>

      <Button mode="contained" onPress={handleLogin} disabled={hasErrors()}>
        Log In
      </Button>
    </View>
  );
}
