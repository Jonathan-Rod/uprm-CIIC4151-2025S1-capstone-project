import { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import validator from "validator";

export default function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Validation rules same as LoginForm
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
      const response = await fetch("http://192.168.4.29:5000/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email, // match UsersHandler
          password,
          position: "civilian", // default
          email,
        }),
      });

      const data = await response.json();

      if (data.id) {
        Alert.alert("Success", "Account created successfully!");
        onSuccess();
      } else {
        Alert.alert("Error", "Failed to create account");
        console.error("Sign-up response:", data);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  return (
    <View style={{ gap: 12 }}>
      {/* Email */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <HelperText type="error" visible={email.length > 0 && !isEmailValid}>
        Enter a valid email address
      </HelperText>

      {/* Password */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <HelperText type="error" visible={password.length > 0 && !isPasswordValid}>
        Password must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
      </HelperText>

      {/* Confirm Password */}
      <TextInput
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />
      <HelperText type="error" visible={password !== confirm}>
        Passwords must match
      </HelperText>

      {/* Submit */}
      <Button mode="contained" onPress={handleSignUp} disabled={hasErrors()}>
        Sign Up
      </Button>
    </View>
  );
}
