"use client";
import { router } from "expo-router";
import { CaseSensitive, ChevronLeft, KeyRound } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const formConfig = [
  {
    label: "Current password",
    name: "currentPassword",
    type: "password",
  },
  {
    label: "New password",
    name: "newPassword",
    type: "password",
    description:
      "Make sure it's strong and secure and you do not share it with anyone",
  },
  {
    label: "Confirm password",
    name: "confirmPassword",
    type: "password",
  },
];

export default function LoginSecurity() {
  const [showPassword, setShowPassword] = useState<null | number[]>(null);

  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: any) => {
    // console.log(data);
    form.reset();
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top + 6 }}
      className='bg-background flex-1'
    >
      <ScrollView>
        <View className='flex-1 bg-background justify-center px-6 mt-4'>
          <TouchableOpacity
            className='w-[70px]'
            onPress={() => router.push("/home/profile")}
          >
            <View className='flex flex-row items-center gap-1 mb-3'>
              <ChevronLeft size={12} color={"#6b7280"} />
              <Text className='text-gray-500 text-xs'> Go Back</Text>
            </View>
          </TouchableOpacity>
          <Text className='mb-3 pl-1 text-2xl text-foreground font-bold max-lg:text-xl'>
            Protection settings
          </Text>
          <View className='mb-4 flex flex-col items-start rounded-lg border border-border px-6 pb-7 pt-5 '>
            <View className='max-w-xs '>
              <Text className='mb-2 text-lg font-semibold text-foreground'>
                Change your password
              </Text>
              <Text className='text-pretty text-sm text-muted-foreground'>
                You can change your password here and make sure it&apos;s
                secure.
              </Text>
            </View>
            <View className='mt-4 gap-8 w-full'>
              <View className='gap-3'>
                {formConfig.map((item, index) => (
                  <Controller
                    key={item.name}
                    control={form.control}
                    name={item.name as any}
                    render={({ field: { onChange, value } }) => {
                      // compute real input type
                      const isPassword = item.type === "password";
                      const inputType = isPassword
                        ? showPassword?.includes(index)
                          ? "text"
                          : "password"
                        : item.type;

                      return (
                        <View className='gap-2'>
                          <Text className='text-sm text-foreground/80'>
                            {item.label}
                          </Text>
                          <View className='relative'>
                            <Input
                              className='native:text-sm py-1'
                              value={value}
                              onChangeText={onChange}
                              autoComplete={
                                isPassword ? "current-password" : undefined
                              }
                              secureTextEntry={
                                inputType === "password" &&
                                !showPassword?.includes(index)
                              }
                            />
                            {isPassword && (
                              <Pressable
                                onPress={() =>
                                  setShowPassword((prev) => {
                                    if (prev?.includes(index)) {
                                      return prev.filter((i) => i !== index);
                                    }
                                    return [...(prev ?? []), index];
                                  })
                                }
                                aria-label={
                                  showPassword?.includes(index)
                                    ? "Hide password"
                                    : "Show password"
                                }
                                className='absolute right-2 top-1/2 -translate-y-1/2 transform p-1'
                              >
                                {!showPassword?.includes(index) ? (
                                  <CaseSensitive size={14} color={"#a3a3a3"} />
                                ) : (
                                  <KeyRound size={14} color={"#a3a3a3"} />
                                )}
                              </Pressable>
                            )}
                          </View>

                          {item.description && (
                            <Text className='text-pretty text-xs text-foreground/60'>
                              {item.description}
                            </Text>
                          )}
                        </View>
                      );
                    }}
                  />
                ))}
              </View>
              <Button size={"sm"} onPress={form.handleSubmit(onSubmit)}>
                <Text className='text-white'>Update password</Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
