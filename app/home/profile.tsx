import { router } from "expo-router";
import { Banknote, IdCard, ShieldBan } from "lucide-react-native";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetProfile } from "~/api/user.query";
import { toast } from "~/components/shared/toast";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { deleteTokens } from "~/lib/axios";
import { useUserStore } from "~/store/user-store";

const settingsCardData = [
  {
    icon: <IdCard size={40} />,
    title: "Personal Information",
    route: "/home/account-settings/personal-info",
    description:
      "Provide personal details and how you want to be contacted by us",
  },
  {
    icon: <ShieldBan size={40} />,
    title: "Login & Security",
    route: "/home/account-settings/login-security",
    description:
      "Update your password and secure your account to protect against unauthorized access",
  },
  {
    icon: <Banknote size={40} />,
    title: "Payments & Payouts",
    route: "/home/account-settings/payments",
    description: "Review and manage your payment methods and payouts settings",
  },
];
export default function Profile() {
  const insets = useSafeAreaInsets();

  const { user: userData, setUser } = useUserStore((state) => state);

  const { data: user } = useGetProfile({
    enabled: userData?.id ? true : false,
  });

  const visibleCards = settingsCardData.filter((card) => {
    if (
      card.title === "Payments & Payouts" &&
      !user?.roles.includes("PATRON")
    ) {
      return false;
    }
    return true;
  });
  return (
    <SafeAreaView
      style={{ paddingTop: insets.top + 2 }}
      className='bg-background flex-1 '
    >
      <ScrollView className='px-4'>
        <View className='pl-1'>
          <Text className='text-2xl font-semibold mt-6 text-foreground'>
            Account
          </Text>
          <Text className='text-sm text-foreground/70'>
            Hey <Text>{user?.name?.split(" ")[0]}</Text>, Manage your account
            settings
          </Text>
        </View>
        <View className='w-full gap-4 my-4'>
          {visibleCards.map((card, index) => (
            <AccounSettingCard key={index} {...card} />
          ))}
        </View>
        <Button
          className='mb-2 mt-6 mx-2 rounded-lg'
          variant={"destructive"}
          onPress={() => {
            deleteTokens();
            setUser(null);
            setTimeout(() => {
              router.replace("/(auth)");
            });
            toast.success("Logged out successfully");
          }}
        >
          <Text className='text-white text-sm font-medium'>Log Out</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function AccounSettingCard({
  title,
  description,
  icon,
  route,
}: {
  title: string;
  description: string;
  icon: React.ReactNode | React.ReactElement;
  route: string;
}) {
  return (
    <Pressable className='w-full' onPress={() => router.push(route as any)}>
      <Card className='w-full pt-4 px-4 border-border'>
        <CardContent className='relative h-40 overflow-hidden '>
          <View className='absolute  flex flex-col gap-1.5'>
            <Text className='text-lg font-semibold text-foreground'>
              {title}
            </Text>
            <Text className='max-w-68 ml-auto text-pretty pr-4 text-sm text-foreground/70'>
              {description}
            </Text>
          </View>
          <View className='absolute -bottom-4 right-2 z-0 rotate-45 opacity-50'>
            <View className='rounded-full bg-primary p-2 text-primary-foreground '>
              {icon}
            </View>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
