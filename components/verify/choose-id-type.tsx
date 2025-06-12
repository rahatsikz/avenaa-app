"use client";
import { router } from "expo-router";
import { CreditCard, Globe, IdCard } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useVerifyFlowStore } from "~/store/verify-flow-store";

const IDTypeData = [
  {
    value: "adhar-card",
    label: "Adhar card",
    icon: <CreditCard color={"#a3a3a3"} size={24} />,
  },
  {
    value: "pan-card",
    label: "Pan card",
    icon: <IdCard color={"#a3a3a3"} size={24} />,
  },
  {
    value: "passport",
    label: "Passport",
    icon: <Globe color={"#a3a3a3"} size={24} />,
  },
  {
    value: "driving-licence",
    label: "Driving licence",
    icon: <CreditCard color={"#a3a3a3"} size={24} />,
  },
];

export default function ChooseIdType() {
  const { setStep, setType } = useVerifyFlowStore((state) => state);
  const [country, setCountry] = useState({
    value: "India",
    label: "India",
  });
  const [selectedId, setSelectedId] = useState("adhar-card");

  const handleContinue = () => {
    setType(selectedId);
    setStep("choose-upload-method");
  };

  return (
    <View className='gap-5'>
      <Text className='text-center text-2xl text-foreground font-semibold lg:text-3xl'>
        Choose an ID type to add
      </Text>

      <View className='gap-4'>
        <View className='gap-2'>
          <Text className='text-sm text-muted-foreground'>
            Issuing country / region
          </Text>
          <Select value={country} onValueChange={setCountry as any}>
            <SelectTrigger className='w-full'>
              <SelectValue
                placeholder='Select country'
                className='text-foreground/80'
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
        </View>
        {IDTypeData.map((data) => (
          <Pressable key={data.value} onPress={() => setSelectedId(data.value)}>
            <Card
              className={cn(
                "cursor-pointer border-2 p-4",
                selectedId === data.value && "border-primary"
              )}
            >
              <View className='flex items-center gap-2'>
                {data.icon}
                <Text className='font-medium text-foreground/80'>
                  {" "}
                  {data.label}{" "}
                </Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>

      <View className='gap-3 text-xs'>
        <Text className='text-muted-foreground'>
          To help protect your personal info, don&apos;t submit your Aadhaar or
          your Pan card or number. Instead, you can submit a driving licence or
          passport. <Text className='font-medium'>Learn more</Text>
        </Text>

        <Text className='text-muted-foreground'>
          Your ID will be handled according to our
          <Text className='font-medium'>Privacy Policy</Text> and will not be
          shared with your Host or guests.
        </Text>
      </View>

      <Separator />

      <View className='gap-3'>
        <Button
          variant='outline'
          onPress={() => router.push("/home/account-settings/personal-info")}
        >
          <Text className='text-foreground font-medium'>Back</Text>
        </Button>
        <Button onPress={handleContinue}>
          <Text className='font-medium text-background'>Continue</Text>
        </Button>
      </View>
    </View>
  );
}
