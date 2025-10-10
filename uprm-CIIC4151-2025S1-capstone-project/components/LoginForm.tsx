import { saveToken } from "@/utils/auth";
import { useState } from "react";
import { View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import validator from "validator";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = validator.isEmail(email);

  const isPasswordValid = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  const hasErrors = () => !isEmailValid || !isPasswordValid;

  const handleLogin = async () => {
    if (hasErrors()) return;
    await saveToken("user-token");
    onSuccess();
  };

  // const handleForgotPassword = () => {
  //   console.log("Forgot password tapped");
  // };

  return (
    <View style={{ gap: 12 }}>
      {/* Email */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
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
        mode="outlined"
      />
      <HelperText
        type="error"
        visible={password.length > 0 && !isPasswordValid}
      >
        Password must be at least 8 characters, include 1 uppercase, 1 number,
        and 1 symbol
      </HelperText>

      {/* Forgot Password */}
      {/* <Button mode="text" onPress={handleForgotPassword}>
        Forgot Password?
      </Button> */}

      {/* Submit */}
      <Button mode="contained" onPress={handleLogin} disabled={hasErrors()}>
        Log In
      </Button>
    </View>
  );
}
