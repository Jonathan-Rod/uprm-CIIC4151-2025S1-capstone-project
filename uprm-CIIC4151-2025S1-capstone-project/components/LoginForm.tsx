import { useState } from "react";
import { View, Alert, Keyboard } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { useAuth } from "@/utils/context/AuthContext";
import { saveToken } from "@/utils/auth";
import { API_BASE_URL } from "@/utils/api"; // Import shared base URL

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const hasErrors = () => !email || !password;

  const handleLogin = async () => {
    if (hasErrors()) return;

    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (data.success) {
        if (data.token) await saveToken(data.token);

        login({
          id: data.user.id,
          email: data.user.email,
          admin: data.user.admin,
        });

        onSuccess();
      } else {
        Alert.alert("Invalid Credentials", data.error_msg || "Check your login details.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        disabled={loading}
      />
      <HelperText type="error" visible={email.length > 0 && !email.includes("@")}>
        Enter a valid email address
      </HelperText>

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        disabled={loading}
      />

      <HelperText type="error" visible={hasErrors()}>
        Email and password are required
      </HelperText>

      <Button
        mode="contained"
        onPress={handleLogin}
        disabled={hasErrors() || loading}
        loading={loading}
      >
        Log In
      </Button>
    </View>
  );
}
