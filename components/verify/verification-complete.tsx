"use client";

import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { useVerifyFlowStore } from "~/store/verify-flow-store";

export default function VerificationComplete() {
  const { setStep } = useVerifyFlowStore((state) => state);
  const handleGotIt = () => {
    setTimeout(() => {
      setStep("choose-id-type");
    }, 500);
    router.push("/home/account-settings/personal-info");
  };

  return (
    <View className='mx-auto max-w-lg gap-4 mt-4 text-center flex-1'>
      <Text className='text-pretty text-2xl text-foreground font-semibold'>
        We&apos;ll let you know as soon as you&apos;re verified
      </Text>
      <Text className='text-muted-foreground max-lg:text-sm'>
        We&apos;ll email you within one hour to let you know if you&apos;ve been
        successfully verified or if we need any more info from you.
      </Text>
      <View className='pt-4'>
        <Button onPress={handleGotIt} className='w-full'>
          <Text className='font-semibold text-background'>Got it</Text>
        </Button>
      </View>
    </View>
  );
}
