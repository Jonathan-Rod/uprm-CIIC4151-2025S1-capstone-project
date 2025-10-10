import { Colors } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function UserCard({ user }: { user: any }) {
  return (
    <View style={styles.card}>
      {user ? (
        <>
          <Text style={styles.name}>{user.name ?? "User"}</Text>
          {!!user.email && <Text style={styles.muted}>{user.email}</Text>}
          {!!user.role && (
            <Text style={styles.roleBadge}>
              {String(user.role).toUpperCase()}
            </Text>
          )}
        </>
      ) : (
        <Text style={styles.muted}>Not signed in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 12, gap: 8 },
  name: { fontSize: 20, fontWeight: "600" },
  muted: { color: Colors.dark.muted },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
  },
});
