import { saveToken } from "@/utils/auth";
import { useState } from "react";
import { View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

export default function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { login } = useAuth();

  // Validation
  const isEmailValid = validator.isEmail(email);
  const isPasswordValid = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
  const hasErrors = () => !isEmailValid || !isPasswordValid || password !== confirm;

  const handleSignUp = async () => {
    if (hasErrors()) return;

    try {
      const response = await fetch("http://192.168.0.2:5000/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, admin: false }), // default to civilian
      });

      const data = await response.json();

      if (response.ok && data.id) {
        if (data.token) await saveToken(data.token);

        login({
          id: data.id,
          email: data.email,
          admin: data.admin,
        });

        Alert.alert("Success", "Account created successfully!");
        onSuccess();
      } else {
        Alert.alert("Error", data.error_msg || "Failed to create account");
        console.error("Sign-up response:", data);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    }
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
      <HelperText type="error" visible={email.length > 0 && !isEmailValid}>
        Enter a valid email address
      </HelperText>

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
      />
      <HelperText type="error" visible={password.length > 0 && !isPasswordValid}>
        Password must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
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

