import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../global.css";

import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";

import { ToastContainer } from "../components/shared/toast";
import { cn } from "../lib/utils";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const hide = async () => {
      // fake wait to simulate loading
      await new Promise((res) => setTimeout(res, 1000));
      await SplashScreen.hideAsync();
    };
    hide();
  }, []);
  // src/queryClient.ts

  const queryClient = new QueryClient();
  const scheme = useColorScheme();

  return (
    <View className={cn(scheme === "dark" ? "dark" : "", "flex-1")}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
        <PortalHost />
        <ToastContainer />
      </QueryClientProvider>
    </View>
  );
}
