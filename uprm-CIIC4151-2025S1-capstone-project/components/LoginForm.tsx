import { API_BASE_URL } from '@/utils/api';
import { saveToken } from '@/utils/auth';
import { useAuth } from '@/utils/context/AuthContext';
import { useState } from 'react';
import { StyleSheet, View, Keyboard, Alert } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { login } = useAuth();

  const hasErrors = () => !email || !password;
  const hasEmailError = () => email.length > 0 && !email.includes("@");

  const handleLogin = async () => {
    setAuthError(false);
    if (hasErrors() || hasEmailError()) return;

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
        setAuthError(true);
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
        setAuthError(true);
        Alert.alert("Invalid Credentials", data.error_msg || "Check your login details.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(true);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        disabled={loading}
        style={styles.input}
        outlineStyle={styles.inputOutline}
      />
      <HelperText type="error" visible={hasEmailError()} style={styles.helperText}>
        Enter a valid email address
      </HelperText>

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        disabled={loading}
        style={styles.input}
        outlineStyle={styles.inputOutline}
      />

      <HelperText type="error" visible={hasErrors()} style={styles.helperText}>
        Email and password are required
      </HelperText>

      <Button
        mode="contained"
        onPress={handleLogin}
        disabled={hasErrors() || hasEmailError() || loading}
        loading={loading}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Log In
      </Button>

      <HelperText type="error" visible={authError} style={styles.authErrorText}>
        The user does not exist or the associated password is incorrect.
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  input: {
    // backgroundColor: '#fff',
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 8,
    borderWidth: 1,
  },
  button: {
    // color: ""
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonLabel: {
    // TODO : Set a bright color but not blue!! (white or gray)
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
  },
  helperText: {
    fontSize: 14,
    marginTop: -8,
    marginBottom: 4,
  },
  authErrorText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 8,
  },
});