import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Heart, LucideIcon, MapPin, Search, User } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "~/lib/utils";

type TabMeta = {
  icon: LucideIcon;
  label: string;
};

type TabMap = Record<string, TabMeta>;

const tabConfig: TabMap = {
  "explore/index": { icon: Search, label: "Explore" },
  wishlists: { icon: Heart, label: "Wishlists" },
  "trips/index": { icon: MapPin, label: "Trips" },
  profile: { icon: User, label: "Profile" },
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} className='bg-background'>
      <View className='mx-6 mt-3 mb-2 p-2 rounded-full border border-border flex-row justify-between bg-background'>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabMeta = tabConfig[route.name];

          if (!tabMeta) return null;

          const Icon = tabMeta.icon;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className={cn(
                "flex-1 py-1.5  items-center"
                // isFocused && "bg-primary rounded-full text-white"
              )}
            >
              <Icon
                size={13}
                color={isFocused ? "#30b55d" : "#a3a3a3"}
                strokeWidth={2}
              />
              <Text
                className={`text-[9px]  px-2 mt-1 ${
                  isFocused
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {tabMeta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
