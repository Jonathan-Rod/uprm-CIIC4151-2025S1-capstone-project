import { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { saveToken } from "@/utils/auth";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const hasErrors = () => !email || !password;

  const handleLogin = async () => {
    if (hasErrors()) return;

    setLoading(true);
    try {
      const response = await fetch("http://192.168.0.2:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.token) await saveToken(data.token);

        // Update AuthContext with full user info (id, email, admin)
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
      />
      <HelperText type="error" visible={email.length > 0 && !email.includes("@")}>
        Enter a valid email address
      </HelperText>

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

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
