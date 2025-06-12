"use client";

import { Controller, useForm } from "react-hook-form";

import { useEffect } from "react";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useBankDetailsStore } from "~/store/bank-detail-store";
import { usePayoutFlowStore } from "~/store/payout-flow-store";

const formConfig = [
  {
    label: "Account number",
    name: "accountNumber",
    desc: " Enter the account number. This can usually be found within the account details.",
  },
  {
    label: "Bank name",
    name: "bankName",
  },
  {
    label: "IFSC code",
    name: "ifscCode",
    desc: "Please enter your IFSC code.",
  },
  {
    label: "Permanent account number",
    name: "permanentAccountNumber",
    desc: " Add the PAN for the individual or corporation.",
  },
];

export default function BankAccountForm() {
  const { bankDetails, updateBankDetails } = useBankDetailsStore(
    (state) => state
  );

  const { setStep } = usePayoutFlowStore((state) => state);

  const defaultValues = {
    accountNumber: bankDetails?.accountNumber ?? "",
    bankName: bankDetails?.bankName ?? "",
    ifscCode: bankDetails?.ifscCode ?? "",
    permanentAccountNumber: bankDetails?.permanentaccountNumber ?? "",
    accountType: bankDetails?.accountType ?? "savings",
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    console.log(data);
    setStep("account-holder");

    updateBankDetails({
      // accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
      accountType: data.accountType,
      permanentaccountNumber: data.permanentAccountNumber,
      bankName: data.bankName,
    });
  };

  useEffect(() => {
    reset({
      accountNumber: bankDetails?.accountNumber ?? "",
      bankName: bankDetails?.bankName ?? "",
      ifscCode: bankDetails?.ifscCode ?? "",
      permanentAccountNumber: bankDetails?.permanentaccountNumber ?? "",
      accountType: bankDetails?.accountType ?? "savings",
    });
  }, [bankDetails]);

  return (
    <View className='mx-auto max-w-2xl py-8 '>
      <View className='mb-8 flex flex-col items-center'>
        <Text className='mb-2 text-center text-2xl font-semibold '>
          Add bank account info
        </Text>
      </View>

      <View>
        <Controller
          control={control}
          name='accountType'
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text className='text-foreground'>
                Is this a current or savings account?
              </Text>
              <RadioGroup
                onValueChange={onChange}
                value={value}
                className='flex flex-row gap-5 mt-3'
              >
                <View className='flex-row items-center gap-2'>
                  <RadioGroupItem value='current' />
                  <Text className='font-normal text-foreground text-sm'>
                    Current
                  </Text>
                </View>
                <View className='flex-row items-center gap-2'>
                  <RadioGroupItem value='savings' />
                  <Text className='font-normal text-foreground text-sm'>
                    Savings
                  </Text>
                </View>
              </RadioGroup>
            </View>
          )}
        />
      </View>
      <View className='mt-5 gap-4'>
        {formConfig.map((item) => (
          <Controller
            key={item.name}
            control={control}
            name={item.name as any}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className='gap-2'>
                <Text className='text-sm text-foreground/80'>{item.label}</Text>
                <Input
                  className='w-full placeholder:text-xs'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {item.desc && (
                  <Text className='text-xs text-gray-500'>{item.desc}</Text>
                )}
              </View>
            )}
          />
        ))}
      </View>
      <View className='mt-8 gap-3.5'>
        <Button variant='outline' onPress={() => setStep("add-payout-method")}>
          <Text className='text-foreground font-medium'> Back</Text>
        </Button>
        <Button disabled={!isValid} onPress={handleSubmit(onSubmit)}>
          <Text className='text-background font-medium'>Next</Text>
        </Button>
      </View>
    </View>
  );
}
