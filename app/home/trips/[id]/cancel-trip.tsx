import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetBooking } from "~/api/booking.query";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { Booking } from "~/types";

export default function StepperForm() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { data: bookingData, isFetched } = useGetBooking(id as string);

  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: { reason: "" },
  });

  const onSubmit = (values: { reason: string }) => {
    console.log("Reason submitted:", values.reason);
    setCurrentStep(1);
    reset();
    router.push("/home/trips");
  };

  const steps = [
    {
      id: 1,
      title: "Cancellation Detail",
      content: <FirstStepContent data={bookingData as any} />,
    },
    {
      id: 2,
      title: "Reason for cancellation",
      content: <SecondStepContent control={control} />,
    },
    { id: 3, title: "Confirm Cancel", content: <ThirdStepContent /> },
  ];

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top + 10 }}
      className='bg-background flex-1'
    >
      <ScrollView className='px-6 py-6 bg-background'>
        {/* Stepper */}
        <View className='flex-row px-4 justify-center items-center mb-6'>
          {steps.map((step, idx) => {
            const isActive = currentStep >= step.id;

            return (
              <React.Fragment key={step.id}>
                <TouchableOpacity
                  onPress={() =>
                    step.id < currentStep && setCurrentStep(step.id)
                  }
                >
                  <View
                    className={cn(
                      "w-10 h-10 rounded-full items-center justify-center border-2",
                      isActive
                        ? "bg-primary border-primary"
                        : "bg-gray-200 border-input"
                    )}
                  >
                    {step.id < currentStep ? (
                      <Check size={18} color='white' />
                    ) : (
                      <Text
                        className={isActive ? "text-white" : "text-gray-600"}
                      >
                        {step.id}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {idx < steps.length - 1 && (
                  <View
                    className={cn(
                      " flex-1 h-px mx-4",
                      step.id < currentStep ? "bg-primary" : "bg-gray-300"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* Step Content */}
        <View className='space-y-6'>
          {isFetched && steps[currentStep - 1].content}
        </View>

        {/* Action Buttons */}
        <View className='flex-row gap-4 mt-6 mx-4'>
          <Button
            disabled={watch("reason").length < 5 && currentStep === 2}
            className='bg-destructive min-w-[140px]'
            onPress={
              currentStep === 3
                ? handleSubmit(onSubmit)
                : () => setCurrentStep(currentStep + 1)
            }
          >
            <Text className='text-white'>
              {currentStep === 3 ? "Confirm Cancel" : "Next"}
            </Text>
          </Button>
          <Button
            variant='outline'
            className='min-w-[140px]'
            onPress={() =>
              currentStep === 1
                ? router.back()
                : setCurrentStep(currentStep - 1)
            }
          >
            <Text className='text-foreground'>
              {currentStep === 1 ? "Go Back" : "Back"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FirstStepContent({ data }: { data: Booking }) {
  return (
    <View className='bg-background p-4 rounded-lg shadow'>
      <Text className='text-lg text-foreground font-semibold mb-2'>
        Are you sure you want to cancel?
      </Text>
      <Text className='text-sm text-muted-foreground mb-4'>
        Please review the details below before confirming.
      </Text>
      <View className='bg-yellow-100 dark:bg-muted/50 p-3 gap-0.5 rounded-lg'>
        <Text className='font-semibold text-foreground'>
          {data.property?.title}
        </Text>
        <Text className='text-sm text-foreground'>
          {format(data.checkInDate, "dd MMM yyyy")} -{" "}
          {format(data.checkOutDate, "dd MMM yyyy")}
        </Text>
        <Text className='text-xs text-yellow-800 dark:text-amber-500 mt-2'>
          ⚠️ Note: 50% of the paid amount is non-refundable.
        </Text>
      </View>
      <Text className='text-sm text-muted-foreground mt-4'>
        The property manages all payments. Once canceled, it cannot be reversed.
      </Text>
    </View>
  );
}

function SecondStepContent({ control }: { control: any }) {
  return (
    <View className='bg-background p-4 rounded-lg shadow'>
      <Text className='text-lg text-foreground font-semibold mb-2'>
        Please write your reason
      </Text>
      <Text className='text-sm text-foreground mb-4'>
        Your feedback helps us grow and improve.
      </Text>
      <Controller
        control={control}
        name='reason'
        render={({ field: { onChange, value } }) => (
          <Textarea
            multiline
            className='border border-gray-300 rounded p-2 placeholder:text-xs '
            placeholder='Reason for cancellation'
            onChangeText={onChange}
            value={value}
          />
        )}
      />
    </View>
  );
}

function ThirdStepContent() {
  return (
    <View className='bg-background p-4 rounded-lg shadow'>
      <Text className='text-lg text-foreground font-semibold mb-2'>
        Proceed with cancellation
      </Text>
      <Text className='text-sm text-muted-foreground'>
        Once you confirm, your booking will be cancelled.
      </Text>
    </View>
  );
}
