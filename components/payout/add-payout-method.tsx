"use client";

import { Building2 } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { usePayoutFlowStore } from "~/store/payout-flow-store";

export default function AddPayoutMethod() {
  const [country, setCountry] = useState({
    value: "India",
    label: "India",
  });

  const [method, setMethod] = useState("bank");

  const { setStep } = usePayoutFlowStore((state) => state);

  return (
    <View className='mx-auto max-w-2xl py-8 '>
      <View className='mb-8 flex flex-col items-center'>
        <Text className='mb-2 text-center text-foreground text-2xl font-semibold md:text-3xl'>
          Let&apos;s add a payout method
        </Text>
        <Text className='max-w-md text-center text-gray-600'>
          To start, let us know where you&apos;d like us to send your money.
        </Text>
      </View>

      <View className='gap-8'>
        <View className='gap-3'>
          <Text className='text-sm text-foreground/80'>
            Billing country/region
          </Text>
          <Select value={country} onValueChange={setCountry as any}>
            <SelectTrigger className='w-full'>
              <SelectValue
                placeholder='Select country'
                className='text-foreground'
              />
            </SelectTrigger>
            <SelectContent className='w-[89%] ' sideOffset={5}>
              {[
                { label: "India", value: "India" },
                { label: "United States", value: "United States" },
                { label: "United Kingdom", value: "United Kingdom" },
              ].map((country) => (
                <SelectItem
                  key={country.value}
                  label={country.label}
                  value={country.value}
                >
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <View className='flex-row'>
            <Text className='text-xs text-foreground/80'>
              This is where you opened your financial account.
            </Text>
            <Pressable className='h-auto px-1 '>
              <Text className='text-xs text-primary font-semibold'>
                More info
              </Text>
            </Pressable>
          </View>
        </View>

        <View className='gap-3'>
          <View className='gap-1'>
            <Text className='text-sm text-foreground'>
              How you&apos;ll get paid
            </Text>
            <Text className='text-sm text-foreground/60'>
              Payouts will be sent in INR.
            </Text>
          </View>

          <RadioGroup value={method} onValueChange={setMethod} className='mt-2'>
            <View className='flex items-start flex-row gap-4 rounded-lg border border-input p-4'>
              <RadioGroupItem value='bank' id='bank' className='mt-1' />
              <View className='flex-1 '>
                <View className='flex items-start gap-1'>
                  <Building2 size={28} color={"#a3a3a3"} />
                  <Text className='cursor-pointer font-medium text-muted-foreground text-sm'>
                    Bank account
                  </Text>
                </View>
                <View className=' mt-2'>
                  <Text className='text-sm text-muted-foreground'>
                    3-5 business days
                  </Text>
                  <Text className='text-sm text-muted-foreground'>No fees</Text>
                </View>
              </View>
            </View>
          </RadioGroup>
        </View>

        <View className='mt-2 gap-3.5'>
          <Button
            variant='outline'
            onPress={() => setStep("payment-dashboard")}
          >
            <Text className='text-foreground font-medium'>Back</Text>
          </Button>
          <Button onPress={() => setStep("bank-account")}>
            <Text className='text-background font-medium'>Continue</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
