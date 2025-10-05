import { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";

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
      const response = await fetch("http://192.168.4.29:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email, // backend expects username field
          password,
          position: "civilian", // default
          email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        login({ username: email, position: "civilian" });
        onSuccess();
      } else {
        Alert.alert("Invalid Credentials", "Please check your login details.");
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
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin} disabled={hasErrors() || loading} loading={loading}>
        Log In
      </Button>
    </View>
  );
}
