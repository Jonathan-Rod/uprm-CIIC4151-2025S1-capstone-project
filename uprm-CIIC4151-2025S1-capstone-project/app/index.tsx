import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";

import LoginForm from "@/components/LoginForm";
import SignInForm from "@/components/SignInForm";

export default function IndexScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSuccess = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.headline}>
        {isLogin ? "Login" : "Sign In"}
      </Text>
      {isLogin ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <SignInForm onSuccess={handleSuccess} />
      )}
      <Button
        mode="text"
        onPress={() => setIsLogin(!isLogin)}
        style={styles.button}
      >
        {isLogin
          ? "Don't have an account? Sign In"
          : "Already have an account? Login"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  headline: {
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});
