"use client";

import { Separator } from "@rn-primitives/select";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { useCreateBankDetail } from "~/api/user.query";
import { toast } from "~/components/shared/toast";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { useBankDetailsStore } from "~/store/bank-detail-store";
import { usePayoutFlowStore } from "~/store/payout-flow-store";
import { useUserStore } from "~/store/user-store";

const formConfig = [
  { label: "Bank account type", name: "accountType" },
  { label: "Permanent Account Number", name: "permanentAccountNumber" },
  { label: "Account holder name", name: "accountHolderName" },
];

interface InfoItemProps {
  label: string;
  name: string;
  form: any;
}

function InfoItem({ label, name, form }: InfoItemProps) {
  const { updateBankDetails } = useBankDetailsStore((state) => state);

  const onValueChange = (name: string, value: string) => {
    switch (name) {
      case "accountType":
        updateBankDetails({ accountType: value });
        break;
      case "permanentAccountNumber":
        updateBankDetails({ permanentaccountNumber: value });
        break;
      case "accountHolderName":
        updateBankDetails({ accountHolder: value });
        break;
    }
  };

  return (
    <View className='pb-2 pt-4'>
      <View className='flex flex-row justify-between'>
        <View>
          <Text className='text-sm font-medium text-foreground/80'>
            {label}
          </Text>
          <Text className='text-sm capitalize text-muted-foreground'>
            {form.getValues(name)}
          </Text>
        </View>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant='link' className='h-auto justify-start px-0 '>
              <Text className='text-primary text-sm'>Edit</Text>
            </Button>
          </DialogTrigger>
          <DialogContent className='w-96'>
            <DialogHeader>
              <DialogTitle className='capitalize native:text-lg'>
                Edit {label.toLowerCase()}
              </DialogTitle>
            </DialogHeader>

            <Controller
              control={form.control}
              name={name}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className='gap-2'>
                  <Text className='text-sm text-foreground'>{label}</Text>
                  <Input
                    className='w-full placeholder:text-xs'
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      onChange(value);
                      onValueChange(name, value);
                    }}
                    value={value}
                  />
                </View>
              )}
            />
            <View className='flex justify-end'>
              <DialogClose asChild>
                <Button>
                  <Text className='text-background font-medium'>Save</Text>
                </Button>
              </DialogClose>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    </View>
  );
}

export default function ReviewInfo() {
  const { setStep } = usePayoutFlowStore((state) => state);

  const { bankDetails, updateBankDetails, deleteBankDetails } =
    useBankDetailsStore((state) => state);

  const { user } = useUserStore((state) => state);
  const queryClient = useQueryClient();

  const { mutate } = useCreateBankDetail();

  const form = useForm({
    defaultValues: {
      accountType: bankDetails?.accountType ?? "",
      permanentAccountNumber: bankDetails?.permanentaccountNumber ?? "",
      accountHolderName: bankDetails?.accountHolder ?? "",
    },
  });

  const onSubmit = (data: any) => {
    // console.log(data);
    // setState({ verify: "true" });

    updateBankDetails({
      accountType: data.accountType,
      permanentaccountNumber: data.permanentAccountNumber,
      accountHolder: data.accountHolderName,
    });

    mutate(
      {
        accountHolder: bankDetails?.accountHolder,
        accountNumber: bankDetails?.accountNumber,
        ifscCode: bankDetails?.ifscCode,
        permanentaccountNumber: bankDetails?.permanentaccountNumber,
        accountType: bankDetails?.accountType,
        bankName: bankDetails?.bankName,
        userCity: bankDetails?.userCity,
        userCountry: bankDetails?.userCountry,
        userFlat: bankDetails?.userFlat,
        userPostcode: bankDetails?.userPostcode,
        userState: bankDetails?.userState,
        userStreetAddress: bankDetails?.userStreetAddress,
        userId: user?.id ?? "",
      },
      {
        onSuccess: () => {
          queryClient
            .invalidateQueries({ queryKey: ["user"] })
            .catch(console.error);
          setStep("complete");
          toast.success("Bank Details Update Request Sent Successfully");
          deleteBankDetails();
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  useEffect(() => {
    form.reset({
      accountType: bankDetails?.accountType ?? "",
      permanentAccountNumber: bankDetails?.permanentaccountNumber ?? "",
      accountHolderName: bankDetails?.accountHolder ?? "",
    });
  }, [bankDetails]);

  return (
    <View className='mx-auto max-w-2xl py-8 md:py-12'>
      <View className='mb-8 flex flex-col items-center'>
        <Text className='mb-2 text-center text-2xl font-semibold text-foreground'>
          Let&apos;s review your info
        </Text>
        <Text className='max-w-md text-center text-foreground/60'>
          Almost done! Just double-check that everything looks good before you
          submit.
        </Text>
      </View>

      <View className='space-y-1'>
        <View className='w-full'>
          {formConfig.map((item) => (
            <View key={item.label}>
              <InfoItem label={item.label} name={item.name} form={form} />
              <Separator />
            </View>
          ))}
          <View className='mt-8 flex gap-3.5 justify-between'>
            <Button variant='outline' onPress={() => setStep("address-form")}>
              <Text className='text-foreground font-medium'>Back</Text>
            </Button>
            <Button onPress={form.handleSubmit(onSubmit)}>
              <Text className='text-background font-medium'>Submit</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
