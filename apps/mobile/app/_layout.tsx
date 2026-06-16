import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { colors } from "@b00ks/design-tokens";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.paper[50] },
          headerTintColor: colors.charcoal[900],
          contentStyle: { backgroundColor: colors.paper[50] },
        }}
      >
        <Stack.Screen name="index" options={{ title: "b00ks" }} />
      </Stack>
    </QueryClientProvider>
  );
}
