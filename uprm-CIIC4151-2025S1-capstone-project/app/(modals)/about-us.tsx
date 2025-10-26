import { ThemedView } from "@/components/themed-view";
import { useAppColors } from "@/hooks/useAppColors";
import { useRouter } from "expo-router";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutUsModal() {
  const router = useRouter();
  const { colors } = useAppColors();

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineMedium" style={styles.title}>
            About Us
          </Text>

          <View style={styles.content}>
            <Text variant="headlineSmall" style={styles.subtitle}>
              Welcome to Our Reporting Platform
            </Text>

            <Text variant="bodyMedium" style={styles.text}>
              We are committed to creating safer, more responsive communities
              through our innovative reporting platform. Our mission is to
              bridge the gap between citizens and local authorities, making it
              easier to report issues and track their resolution.
            </Text>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🎯 Our Mission
              </Text>
              <Text variant="bodyMedium" style={styles.text}>
                To empower communities by providing a transparent, efficient,
                and user-friendly platform for reporting and resolving local
                issues.
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                💡 What We Do
              </Text>
              <Text variant="bodyMedium" style={styles.text}>
                • Enable real-time issue reporting with photo evidence{"\n"}•
                Provide transparent tracking of report status{"\n"}• Facilitate
                communication between users and administrators{"\n"}• Generate
                actionable insights for community improvement
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🌟 Our Values
              </Text>
              <Text variant="bodyMedium" style={styles.text}>
                • <Text style={styles.bold}>Transparency:</Text> Clear
                communication and status updates{"\n"}•{" "}
                <Text style={styles.bold}>Efficiency:</Text> Streamlined
                reporting and resolution processes{"\n"}•{" "}
                <Text style={styles.bold}>Community:</Text> Putting people at
                the center of everything we do{"\n"}•{" "}
                <Text style={styles.bold}>Innovation:</Text> Continuously
                improving our platform
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                📊 Our Impact
              </Text>
              <Text variant="bodyMedium" style={styles.text}>
                Since our launch, we&apos;ve helped resolve thousands of
                community issues, from infrastructure problems to environmental
                concerns. Our platform has become a trusted tool for citizens
                and local authorities alike.
              </Text>
            </View>

            <View style={styles.contactInfo}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                📞 Get In Touch
              </Text>
              <Text variant="bodyMedium" style={styles.text}>
                Have questions or suggestions? We&apos;d love to hear from you!
                {"\n"}
                Visit the Contact Support section in Settings to reach our team.
              </Text>
            </View>

            <Text variant="bodySmall" style={styles.versionText}>
              App Version 1.0.0 • Making Communities Better
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.back()}
            style={styles.button}
            icon="arrow-left"
            textColor={colors.button.text}
          >
            Back to Settings
          </Button>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
    },
    title: {
      textAlign: "center",
      marginBottom: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    content: {
      gap: 20,
    },
    subtitle: {
      textAlign: "center",
      marginBottom: 8,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    text: {
      lineHeight: 22,
      textAlign: "left",
      color: colors.text,
    },
    section: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    sectionTitle: {
      marginBottom: 8,
      fontWeight: "600",
      color: colors.text,
    },
    bold: {
      fontWeight: "600",
    },
    contactInfo: {
      backgroundColor: colors.successContainer,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.success,
    },
    versionText: {
      textAlign: "center",
      marginTop: 24,
      color: colors.textMuted,
      fontStyle: "italic",
    },
    buttonContainer: {
      padding: 20,
      paddingBottom: 30,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      backgroundColor: colors.surface,
    },
    button: {
      borderRadius: 8,
      backgroundColor: colors.button.primary,
    },
  });
