import { saveToken } from "@/utils/auth";
import { useState } from "react";
import { View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

export default function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // TODO: Using a library to determine if its valid or not
  const hasErrors = () =>
    !email.includes("@") || password.length < 6 || password !== confirm;

  const handleSignUp = async () => {
    if (hasErrors()) return;
    await saveToken("new-user-token"); // Replace with real token later
    onSuccess();
  };

  return (
    <View style={{ gap: 12 }}>
      <TextInput
        value={email}
        keyboardType="email-address"
        mode="outlined"
        onChangeText={setEmail}
        label="Email"
        autoCapitalize="none"
      />
      <HelperText type="error" visible={!email.includes("@")}>
        Enter a valid email address
      </HelperText>

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
      />
      <HelperText type="error" visible={password.length < 6}>
        Password must be at least 6 characters
      </HelperText>

      <TextInput
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        mode="outlined"
      />
      <HelperText type="error" visible={password !== confirm}>
        Passwords must match
      </HelperText>

      <Button mode="contained" onPress={handleSignUp} disabled={hasErrors()}>
        Sign Up
      </Button>
    </View>
  );
}
