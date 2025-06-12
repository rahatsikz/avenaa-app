"use client";

import { useRouter } from "expo-router";
import { Camera, Upload } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { useVerifyFlowStore } from "~/store/verify-flow-store";

export default function ChooseUploadMethod() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("upload-images");
  const { setStep, type } = useVerifyFlowStore((state) => state);
  // const {
  //   state: { type },
  //   setState,
  // } = useUrlState(["type", "step"]);

  const handleContinue = () => {
    // setState({ step: selectedMethod, type });
    setStep(selectedMethod);
  };

  return (
    <View className='gap-6'>
      <View className='gap-2'>
        <Text className='text-pretty text-2xl font-semibold text-foreground'>
          How would you like to add your{" "}
          {type &&
            type?.split("-").join(" ").charAt(0).toUpperCase() +
              type?.split("-").join(" ").slice(1)}
          ?
        </Text>
      </View>

      <View className='gap-4'>
        <Pressable onPress={() => setSelectedMethod("upload-images")}>
          <Card
            className={cn(
              "border-2 p-4 ",
              selectedMethod === "upload-images" && "border-primary"
            )}
          >
            <View className='flex flex-col gap-1'>
              <View className='flex items-center gap-3 mb-4'>
                <Upload color={"#a3a3a3"} size={24} />
                <Text className='font-medium text-foreground/80'>
                  Upload an existing photo
                </Text>
              </View>
            </View>
          </Card>
        </Pressable>

        <Pressable onPress={() => setSelectedMethod("take-photo")}>
          <Card
            className={cn(
              "border-2 p-4 ",
              selectedMethod === "take-photo" && "border-primary"
            )}
          >
            <View className='flex items-center gap-2 '>
              <Camera color={"#a3a3a3"} size={24} />
              <Text className='font-medium text-foreground/80'>
                Take photo with camera
              </Text>
            </View>
            <Text className='text-center mt-1.5 text-sm text-muted-foreground'>
              Recommended
            </Text>
          </Card>
        </Pressable>
      </View>

      <View className='flex justify-between gap-3 mt-4'>
        <Button
          variant='outline'
          onPress={() => setStep("choose-id-type")}
          className='flex items-center '
        >
          <Text className='font-medium text-foreground'>Back</Text>
        </Button>
        <Button onPress={handleContinue}>
          <Text className='text-background font-medium'>Continue</Text>
        </Button>
      </View>
    </View>
  );
}
