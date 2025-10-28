import { ThemedView } from "@/components/themed-view";
import { useAppColors } from "@/hooks/useAppColors";
import { useRouter } from "expo-router";
import { StyleSheet, View, ScrollView, Linking } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsAndConditionsModal() {
  const router = useRouter();
  const { colors } = useAppColors();

  const handleViewFullTerms = () => {
    Linking.openURL("https://www.communityreports.com/terms");
  };

  const handleContactLegal = () => {
    Linking.openURL(
      "mailto:legal@communityreports.com?subject=Terms and Conditions Inquiry"
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="headlineMedium" style={styles.title}>
            Terms & Conditions
          </Text>

          <Text variant="bodySmall" style={styles.effectiveDate}>
            Last Updated: December 2024
          </Text>

          <Text variant="bodyMedium" style={styles.introText}>
            Welcome to Community Reports. By accessing or using our services,
            you agree to be bound by these Terms and Conditions.
          </Text>

          {/* Acceptance of Terms */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              1. Acceptance of Terms
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              By accessing and using Community Reports, you accept and agree to
              be bound by the terms and provision of this agreement.
            </Text>
          </View>

          {/* Use License */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              2. Use License
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              Permission is granted to temporarily use Community Reports for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title.
            </Text>
          </View>

          {/* User Responsibilities */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              3. User Responsibilities
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              <Text style={styles.bold}>Accurate Information:</Text> You agree
              to provide accurate and complete information when submitting
              reports.{"\n\n"}
              <Text style={styles.bold}>Appropriate Content:</Text> Reports must
              not contain offensive, defamatory, or illegal content.{"\n\n"}
              <Text style={styles.bold}>Respectful Use:</Text> You agree to use
              the service in compliance with all applicable laws and
              regulations.
            </Text>
          </View>

          {/* Privacy */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              4. Privacy Policy
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              Your privacy is important to us. Our Privacy Policy explains how
              we collect, use, and protect your personal information. By using
              our services, you agree to the collection and use of information
              in accordance with our Privacy Policy.
            </Text>
          </View>

          {/* Intellectual Property */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              5. Intellectual Property
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of Community Reports
              and its licensors. The Service is protected by copyright,
              trademark, and other laws.
            </Text>
          </View>

          {/* Termination */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              6. Termination
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              We may terminate or suspend your account and bar access to the
              Service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever, including but not
              limited to a breach of the Terms.
            </Text>
          </View>

          {/* Limitation of Liability */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              7. Limitation of Liability
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              In no event shall Community Reports, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses.
            </Text>
          </View>

          {/* Governing Law */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              8. Governing Law
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              These Terms shall be governed and construed in accordance with the
              laws of Puerto Rico, without regard to its conflict of law
              provisions.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              9. Changes to Terms
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. By continuing to access or use our
              Service after those revisions become effective, you agree to be
              bound by the revised terms.
            </Text>
          </View>

          {/* Contact Information */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              10. Contact Information
            </Text>
            <Text variant="bodyMedium" style={styles.sectionText}>
              If you have any questions about these Terms, please contact us at:
              {"\n\n"}
              <Text style={styles.bold}>Email:</Text> legal@communityreports.com
              {"\n"}
              <Text style={styles.bold}>Website:</Text> www.communityreports.com
              {"\n"}
              <Text style={styles.bold}>Address:</Text> San Juan, Puerto Rico
            </Text>
          </View>

          {/* Acknowledgment Box */}
          <View style={styles.acknowledgmentBox}>
            <Text variant="bodyMedium" style={styles.acknowledgmentText}>
              <Text style={styles.bold}>Acknowledgment:</Text> By using
              Community Reports, you acknowledge that you have read, understood,
              and agree to be bound by these Terms and Conditions.
            </Text>
          </View>

          <Text variant="bodySmall" style={styles.fullTermsText}>
            This is a summary of our full Terms and Conditions. For complete
            details, please review the full document.
          </Text>

          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={handleViewFullTerms}
              style={styles.actionButton}
              icon="file-document"
              textColor={colors.primary}
            >
              View Full Terms
            </Button>
            <Button
              mode="outlined"
              onPress={handleContactLegal}
              style={styles.actionButton}
              icon="email"
              textColor={colors.primary}
            >
              Contact Legal Team
            </Button>
          </View>
        </ScrollView>

        {/* <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.back()}
            style={styles.backButton}
            icon="arrow-left"
            textColor={colors.button.text}
          >
            Back to Settings
          </Button>
        </View> */}
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
      gap: 20,
      paddingBottom: 20,
    },
    title: {
      textAlign: "center",
      marginBottom: 4,
      fontWeight: "bold",
      color: colors.text,
    },
    effectiveDate: {
      textAlign: "center",
      color: colors.textMuted,
      marginBottom: 16,
      fontStyle: "italic",
    },
    introText: {
      textAlign: "center",
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    section: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      boxShadow: `0px 1px 2px ${colors.shadow || "#0000001a"}`,
    },
    sectionTitle: {
      marginBottom: 12,
      fontWeight: "600",
      color: colors.primary,
    },
    sectionText: {
      lineHeight: 20,
      color: colors.text,
    },
    bold: {
      fontWeight: "600",
      color: colors.text,
    },
    acknowledgmentBox: {
      backgroundColor: colors.successContainer,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.success,
    },
    acknowledgmentText: {
      lineHeight: 20,
      color: colors.onSuccessContainer,
      textAlign: "center",
    },
    fullTermsText: {
      textAlign: "center",
      color: colors.textMuted,
      fontStyle: "italic",
      marginBottom: 16,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    actionButton: {
      flex: 1,
      borderColor: colors.primary,
    },
    buttonContainer: {
      padding: 20,
      paddingBottom: 30,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      backgroundColor: colors.surface,
    },
    backButton: {
      borderRadius: 8,
      backgroundColor: colors.button?.primary,
    },
  });
