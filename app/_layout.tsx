import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="splash/index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="OTP/index" />
    </Stack>
  );
}
