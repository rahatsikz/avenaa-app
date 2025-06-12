"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { AvenaSelect } from "~/components/shared/avena-select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import indianStatesAndUTs from "~/constants/state";
import { useBankDetailsStore } from "~/store/bank-detail-store";
import { usePayoutFlowStore } from "~/store/payout-flow-store";

export default function AddressForm() {
  const { bankDetails, updateBankDetails } = useBankDetailsStore(
    (state) => state
  );

  const { setStep } = usePayoutFlowStore((state) => state);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      street: bankDetails?.userStreetAddress ?? "",
      apt: bankDetails?.userFlat ?? "",
      city: bankDetails?.userCity ?? "",
      state: bankDetails?.userState ?? "",
      postcode: bankDetails?.userPostcode ?? "",
      country: "India",
    },
  });

  const onSubmit = (data: any) => {
    // setState({ step: "review-info" });
    setStep("review-info");
    updateBankDetails({
      userStreetAddress: data.street,
      userFlat: data.apt,
      userCity: data.city,
      userState: data.state,
      userPostcode: data.postcode,
      userCountry: data.country,
    });
  };

  useEffect(() => {
    reset({
      street: bankDetails?.userStreetAddress ?? "",
      apt: bankDetails?.userFlat ?? "",
      city: bankDetails?.userCity ?? "",
      state: bankDetails?.userState ?? "",
      postcode: bankDetails?.userPostcode ?? "",
      country: bankDetails?.userCountry ?? "India",
    });
  }, [bankDetails]);

  const isDisabled =
    watch("street") === "" ||
    watch("city") === "" ||
    watch("state") === "" ||
    watch("postcode") === "" ||
    watch("country") === "";

  return (
    <View className='mx-auto max-w-2xl py-8 md:py-12 w-full'>
      <View className='mb-5 flex flex-col items-center'>
        <Text className='mb-1 max-w-[300px] text-foreground text-center text-2xl font-semibold '>
          Add the address associated with this account
        </Text>
        <Text className='max-w-[280px]  text-center text-muted-foreground text-sm'>
          This is the address that the bank or financial institution has on file
          for this account. It should match recent bank statements.
        </Text>
      </View>

      <View className='gap-4'>
        <Controller
          control={control}
          name={"street"}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className='gap-2'>
              <Text className='text-sm text-foreground'>Street address</Text>
              <Input
                className='w-full placeholder:text-xs'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name={"apt"}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className='gap-2'>
              <Text className='text-sm text-foreground'>
                Flat, suite, building. (optional)
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

        <Controller
          control={control}
          name={"city"}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className='gap-2'>
              <Text className='text-sm text-foreground'>City</Text>
              <Input
                placeholder='Enter city'
                className='w-full placeholder:text-xs'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name={"state"}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className='gap-2'>
              <Text className='text-sm text-foreground'>State</Text>
              <AvenaSelect
                options={indianStatesAndUTs}
                placeholder='Select state'
                selectedValue={value}
                onValueChange={onChange}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name={"postcode"}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className='gap-2'>
              <Text className='text-sm text-foreground'>Postcode</Text>
              <Input
                placeholder='Enter postcode'
                className='w-full placeholder:text-xs'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={"number-pad"}
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name={"country"}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className='gap-2'>
              <Text className='text-sm text-foreground'>Country/Region</Text>
              <Input
                className='w-full placeholder:text-xs'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={false}
              />
            </View>
          )}
        />

        <View className='flex justify-between mt-1 gap-3.5'>
          <Button variant='outline' onPress={() => setStep("account-holder")}>
            <Text className='text-foreground font-medium'>Back</Text>
          </Button>
          <Button disabled={isDisabled} onPress={handleSubmit(onSubmit)}>
            <Text className='text-background font-medium'>Next</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
