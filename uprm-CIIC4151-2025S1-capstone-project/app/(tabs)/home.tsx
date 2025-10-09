import { View } from "react-native";
import { Text, FAB } from "react-native-paper";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineMedium">Home</Text>
      <FAB
        style={{ position: "absolute", bottom: 16, right: 16 }}
        icon="plus"
        label="Add"
        onPress={() => {
          router.push("/(modals)/report-form");
        }}
      />
    </View>
  );
}
