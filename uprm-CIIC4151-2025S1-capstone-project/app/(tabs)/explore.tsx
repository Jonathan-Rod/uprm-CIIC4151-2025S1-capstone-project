import { useRouter } from "expo-router";
import { View } from "react-native";
import { FAB, Text } from "react-native-paper";

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineMedium">Explore</Text>
      <FAB
        style={{ position: "absolute", bottom: 16, right: 16 }}
        icon="plus"
        label="Add"
        onPress={() => {
          router.push("/report-form");
        }}
      />
    </View>
  );
}
