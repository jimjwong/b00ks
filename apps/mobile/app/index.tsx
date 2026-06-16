import { StyleSheet, Text, View } from "react-native";
import { colors } from "@b00ks/design-tokens";

// React Native needs literal point sizes, unlike the web's rem-based fontSizes token.
const fontSizes = { lg: 18, sm: 14, "3xl": 30 };

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>b00ks</Text>
      <Text style={styles.tagline}>Your books. Every device.</Text>
      <Text style={styles.body}>
        Sign-in and the library experience land in Phase 2 and Phase 7 of the build. This
        screen confirms the Expo app, design tokens, and shared packages are wired up.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper[50],
    padding: 24,
    gap: 12,
  },
  brand: {
    fontSize: fontSizes["3xl"],
    color: colors.charcoal[900],
    fontWeight: "600",
  },
  tagline: {
    fontSize: fontSizes.lg,
    color: colors.charcoal[500],
  },
  body: {
    fontSize: fontSizes.sm,
    color: colors.charcoal[300],
    textAlign: "center",
    maxWidth: 320,
  },
});
