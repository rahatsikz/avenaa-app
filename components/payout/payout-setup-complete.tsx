"use client";

import { Sprout } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { usePayoutFlowStore } from "~/store/payout-flow-store";

export default function PayoutSetupComplete() {
  const { setStep } = usePayoutFlowStore((state) => state);
  return (
    <View className='mx-auto flex max-w-md flex-col items-center justify-center py-12 '>
      <View className='relative mb-6 overflow-hidden rounded-full'>
        {/* Custom illustration instead of exact copy */}
        <View className=' h-48 w-48 items-center justify-center rounded-full bg-primary p-6'>
          <Sprout size={60} color={"#fff"} className='rounded-full' />
        </View>
        <View className='absolute -bottom-4 -right-4'>
          <View className='flex gap-1'>
            {Array.from({ length: 3 }).map((_, i) => (
              <View
                key={i}
                className='h-5 w-5 rounded-full border border-muted bg-muted'
              />
            ))}
          </View>
        </View>
      </View>

      <Text className='mb-1 mt-3 text-center text-2xl font-semibold text-foreground'>
        We&apos;re setting up your payouts
      </Text>

      <Text className='mb-6 text-center text-muted-foreground'>
        All your info is now saved in your account.
      </Text>

      <Button
        className='rounded-lg mt-1 text-base min-w-full'
        onPress={() => setStep("payment-dashboard")}
      >
        <Text className='font-semibold text-background text-center w-full'>
          Done
        </Text>
      </Button>
    </View>
  );
}
