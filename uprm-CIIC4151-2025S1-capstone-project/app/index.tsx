import LoginForm from "@/components/LoginForm";
import SignInForm from "@/components/SignInForm";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSuccess = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
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
