import { CheckCircle, Minus, XCircle } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { HomeRulesModal } from "./home-policy-modal";
import { RefundPolicyModal } from "./refund-policy-modal";

export function RulesRefundPolicy({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showHomeRules, setShowHomeRules] = useState(false);

  return (
    <View>
      <View className='mb-7 pl-1.5 pt-7'>
        <Text className='mb-8 text-xl font-semibold text-foreground/80'>
          Rules and Refund Policy
        </Text>

        <View className=''>
          {/* Timeline visualization */}
          <View className='relative mb-6 flex h-24 items-start justify-between'>
            {/* Timeline line */}
            <View className='absolute inset-x-12 top-4 h-0.5 bg-secondary '></View>

            {/* First point */}
            <View className='absolute -left-6 top-0 z-10 flex flex-col items-center '>
              <View className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600'>
                <CheckCircle color={"#16a34a"} className='h-6 w-6' />
              </View>
              <View className='mt-2 max-w-[120px] gap-0.5 '>
                <Text className='text-xs font-medium text-foreground text-center'>
                  100% Future Stay Voucher
                </Text>
                <Text className='text-xs text-muted-foreground text-center'>
                  Before 12 days
                </Text>
              </View>
            </View>

            {/* Second point */}
            <View className='absolute left-1/2 top-0 z-10 flex -translate-x-1/2 flex-col items-center'>
              <View className='flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
                <Minus className='h-6 w-6' color={"#d97706"} />
              </View>
              <View className='mt-2 max-w-[120px] gap-0.5 '>
                <Text className='text-xs font-medium text-foreground text-center'>
                  50% Future Stay Voucher{" "}
                </Text>
                <Text className='text-xs text-muted-foreground text-center'>
                  12 to 18 days
                </Text>
              </View>
            </View>

            {/* Third point */}
            <View className='absolute -right-0 top-0 z-10 flex flex-col items-center'>
              <View className='flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600'>
                <XCircle className='h-6 w-6' color={"#dc2626"} />
              </View>
              <View className='mt-2 max-w-[120px] gap-0.5 '>
                <Text className='text-xs font-medium text-foreground text-center'>
                  No Refund
                </Text>
                <Text className='text-xs text-muted-foreground text-center'>
                  Less than 6 days
                </Text>
              </View>
            </View>
          </View>

          {/* Policy buttons */}
          <View className='mb-5 flex-row flex-wrap items-center gap-3'>
            <Button
              variant='outline'
              size={"sm"}
              className='px-6'
              onPress={() => setShowRefundPolicy(true)}
            >
              <Text className='text-sm text-foreground'>Refund Policy</Text>
            </Button>
            <Button
              variant='outline'
              size={"sm"}
              className='px-6'
              onPress={() => setShowHomeRules(true)}
            >
              <Text className='text-sm text-foreground'>
                Home Rules and Policy
              </Text>
            </Button>
          </View>

          {/* Check-in/out times */}
          <View className='gap-2 '>
            <View className='flex-row items-center gap-4'>
              <View className='flex-row items-center'>
                <Text className='font-medium text-foreground/70 text-sm'>
                  Check-in time:
                </Text>

                <Text className='font-medium text-sm text-foreground'>
                  &nbsp;2 PM
                </Text>
              </View>
              <View className='flex-row items-center'>
                <Text className='font-medium text-foreground/70 text-sm'>
                  Check-out time:
                </Text>

                <Text className='font-medium text-sm text-foreground'>
                  &nbsp;11 AM
                </Text>
              </View>
            </View>
            <Text className='text-xs font-semibold text-muted-foreground'>
              Note: Early check-in and late check-out is subject to availability
              (at an additional fee)
            </Text>
          </View>
        </View>

        {/* Refund Policy Modal */}
        <RefundPolicyModal
          setShowRefundPolicy={setShowRefundPolicy}
          showRefundPolicy={showRefundPolicy}
        />

        <HomeRulesModal
          showHomeRules={showHomeRules}
          setShowHomeRules={setShowHomeRules}
        />
      </View>
      <Separator />
    </View>
  );
}
