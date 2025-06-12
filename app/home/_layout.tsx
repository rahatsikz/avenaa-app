import { Tabs } from "expo-router";
import CustomTabBar from "~/components/shared/custom-tabbar";

export default function HomeTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name='explore/index' />
      <Tabs.Screen name='trips/index' />
      <Tabs.Screen name='wishlists' />
      <Tabs.Screen name='profile' />
    </Tabs>
  );
}
