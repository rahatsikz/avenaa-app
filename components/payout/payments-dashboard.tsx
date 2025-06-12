"use client";

import { TriangleAlert, VerifiedIcon } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { useGetProfile } from "~/api/user.query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { usePayoutFlowStore } from "~/store/payout-flow-store";
import { useUserStore } from "~/store/user-store";
import BankDetailsPage from "./bank-details-page";

const accordionConfigs = [
  {
    value: "item-1",
    title: "When you'll get your payout",
    content: `We release payouts between the 7th and 10th of each month. The exact time the funds appear in your account depends on your payout method.`,
  },
  {
    value: "item-2",
    title: "How payouts work",
    content: `When a guest books your place, we typically release your
payout about 24 hours after their scheduled check-in time.
If they book more than 30 days in advance, we may hold
your payout until 30 days before check-in.`,
  },
  {
    value: "item-3",
    title: "Go to your transaction history",
    content: `You can view all your transactions, including payouts,
refunds, and adjustments in your transaction history. This
helps you track all financial activities related to your
listings.`,
  },
];

export default function PaymentsDashboard() {
  const { setStep } = usePayoutFlowStore((state) => state);
  const handleSetupPayouts = () => {
    setStep("add-payout-method");
  };

  const [tabState, setTabState] = useState("payouts");

  const { user: userData } = useUserStore((state) => state);

  const { data: user } = useGetProfile({
    enabled: userData?.id ? true : false,
  });

  return (
    <View className='mx-auto  pb-4 py-2'>
      <View className='mb-4'>
        <Text className=' text-xl text-foreground font-semibold capitalize md:text-3xl'>
          Payments & payouts
        </Text>
      </View>

      <Tabs value={tabState} onValueChange={setTabState} className='w-full  '>
        <TabsList className='mb-6 w-full flex-row justify-center rounded-full overflow-hidden  native:p-0'>
          <TabsTrigger
            value='payments'
            className={cn(
              "rounded-full border-b-[3px] border-transparent px-4 py-3 bg-muted w-1/2",
              tabState === "payments" && "bg-primary "
            )}
          >
            <Text
              className={
                tabState === "payments"
                  ? "text-white font-medium"
                  : "text-foreground"
              }
            >
              Payments
            </Text>
          </TabsTrigger>
          <TabsTrigger
            value='payouts'
            className={cn(
              "rounded-full border-b-[3px] border-transparent px-4 bg-muted py-3 w-1/2",
              tabState === "payouts" && "bg-primary "
            )}
          >
            <Text
              className={
                tabState === "payouts"
                  ? "text-white font-medium"
                  : "text-foreground"
              }
            >
              Payouts
            </Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='payouts' className='mt-0'>
          <View className='mb-8'>
            <Text className='mb-2 text-xl font-semibold text-foreground'>
              How you&apos;ll get paid
            </Text>
            <Text className='mb-7 text-foreground/60 '>
              Add at least one payout method so we know where to send your
              money.
            </Text>

            <View className='gap-3'>
              {!user?.BankDetail?.accountHolder && (
                <Button onPress={handleSetupPayouts}>
                  <Text className='text-background font-medium'>
                    Set up payouts
                  </Text>
                </Button>
              )}
              {user?.bankDetailVerified && (
                <View className='flex-row items-center gap-2 text-primary'>
                  <Text className='font-semibold text-foreground'>
                    Bank details verified
                  </Text>
                  <VerifiedIcon color={"#16a34a"} />
                </View>
              )}
              {!user?.bankDetailVerified && user?.BankDetail?.accountHolder && (
                <View className='flex-row items-center gap-2 text-amber-500'>
                  <Text className='font-semibold'>
                    Verification Under Review
                  </Text>
                  <TriangleAlert color={"#f59e0b"} />
                </View>
              )}
              {user?.BankDetail?.accountHolder && (
                <BankDetailsPage bankData={user?.BankDetail} />
              )}
            </View>
          </View>

          <Card className='mt-2 rounded-lg border shadow-sm'>
            <CardContent className='p-6'>
              <Text className='mb-0 text-lg font-medium text-foreground'>
                Need help?
              </Text>

              <DynamicAccordion />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='payments' className='mt-0'>
          <View className='py-8 text-center'>
            <Text className='text-gray-600'>No payment methods added yet</Text>
          </View>
        </TabsContent>
      </Tabs>
    </View>
  );
}

function DynamicAccordion() {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {accordionConfigs.map((item, index) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className={`${index > 0 ? "mt-0" : ""} ${
            index === accordionConfigs.length - 1 ? "border-0" : ""
          }`}
        >
          <AccordionTrigger className=''>
            <Text className='text-foreground text-sm'>{item.title}</Text>
          </AccordionTrigger>
          <AccordionContent className=''>
            <Text className='max-w-2xl text-muted-foreground text-sm'>
              {item.content}
            </Text>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
