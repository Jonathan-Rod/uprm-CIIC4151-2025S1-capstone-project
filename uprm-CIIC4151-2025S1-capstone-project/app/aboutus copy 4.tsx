import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";

export default function AboutUsScreen() {
  const router = useRouter();

  return (
    <ThemedView>
      <ThemedText type="title">About Us</ThemedText>
      <View>
        {/* Add content for the About Us screen */}
      </View>
      <Button
        mode="outlined"
        onPress={() => router.replace("/(tabs)/settings")}
      >
        Back
      </Button>
    </ThemedView>
  );
}