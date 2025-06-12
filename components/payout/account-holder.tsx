"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useBankDetailsStore } from "~/store/bank-detail-store";
import { usePayoutFlowStore } from "~/store/payout-flow-store";

export default function AccountHolder() {
  const { bankDetails, updateBankDetails } = useBankDetailsStore(
    (state) => state
  );
  const { setStep } = usePayoutFlowStore((state) => state);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountHolderName: bankDetails?.accountHolder ?? "",
    },
  });

  const onSubmit = (data: any) => {
    // console.log(data);
    updateBankDetails({ accountHolder: data.accountHolderName });
    setStep("address-form");
  };

  useEffect(() => {
    reset({
      accountHolderName: bankDetails?.accountHolder ?? "",
    });
  }, [bankDetails]);

  return (
    <View className='flex-1 w-full py-8 '>
      <View className='mb-8 flex flex-col items-center'>
        <Text className='mb-2 text-center text-2xl font-semibold text-foreground'>
          Add the bank account holder
        </Text>
      </View>

      <Controller
        control={control}
        name={"accountHolderName"}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className='gap-2'>
            <Text className='text-sm text-foreground/80'>
              Whose bank account is it?
            </Text>
            <Input
              className='w-full placeholder:text-xs'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
      />

      <View className='mt-8 flex justify-between gap-3.5'>
        <Button variant='outline' onPress={() => setStep("bank-account")}>
          <Text className='text-foreground font-medium'>Back</Text>
        </Button>
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={!watch("accountHolderName")}
        >
          <Text className='text-white font-medium'>Next</Text>
        </Button>
      </View>
    </View>
  );
}
