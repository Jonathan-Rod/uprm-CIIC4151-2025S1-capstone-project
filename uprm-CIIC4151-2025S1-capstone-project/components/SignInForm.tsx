import { registerUser } from "@/utils/api";
import { saveToken } from "@/utils/auth";
import { useAuth } from "@/utils/context/AuthContext";
import { useState } from "react";
import { Alert, Keyboard, StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import validator from "validator";

export default function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const isEmailValid = validator.isEmail(email);
  const isPasswordValid = validator.isStrongPassword(password, {
    minLength: 8,
    // minLowercase: 1,
    // minUppercase: 1,
    // minNumbers: 1,
    // minSymbols: 1,
  });
  const hasErrors = () =>
    !isEmailValid || !isPasswordValid || password !== confirm;

  const handleSignUp = async () => {
    if (hasErrors()) return;

    Keyboard.dismiss();
    setLoading(true);

    try {
      const data = await registerUser({
        email,
        password,
        admin: false,
      });

      // Check for user_id or id from backend
      if (data.user_id || data.id) {
        if (data.token) await saveToken(data.token);

        login({
          id: data.user_id || data.id, // Handle both response formats
          email: data.email,
          admin: data.admin,
        });

        Alert.alert("Success", "Account created successfully!");
        onSuccess();
      } else {
        Alert.alert("Error", data.error || "Failed to create account");
        console.error("Sign-up response:", data);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      Alert.alert(
        "Registration Error",
        error instanceof Error
          ? error.message
          : "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        keyboardType="email-address"
        mode="outlined"
        onChangeText={setEmail}
        label="Email"
        autoCapitalize="none"
        disabled={loading}
        style={styles.input}
        outlineStyle={styles.inputOutline}
      />
      <HelperText
        type="error"
        visible={email.length > 0 && !isEmailValid}
        style={styles.helperText}
      >
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
      <HelperText
        type="error"
        visible={password.length > 0 && !isPasswordValid}
        style={styles.helperText}
      >
        Password must be at least 8 characters
      </HelperText>

      <TextInput
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        mode="outlined"
        disabled={loading}
        style={styles.input}
        outlineStyle={styles.inputOutline}
      />
      <HelperText
        type="error"
        visible={password !== confirm}
        style={styles.helperText}
      >
        Passwords must match
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSignUp}
        disabled={hasErrors() || loading}
        loading={loading}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  input: {
    fontSize: 16,
    backgroundColor: "transparent",
  },
  inputOutline: {
    borderRadius: 8,
    borderWidth: 1,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 4,
  },
  helperText: {
    fontSize: 14,
    marginTop: -4,
    marginBottom: 4,
  },
});
