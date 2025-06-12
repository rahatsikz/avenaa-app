import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { useOTPResend, useVerifyOTP } from "~/api/auth.query";
import { LoginHeader } from "~/components/shared/login-header";
import { toast } from "~/components/shared/toast";
import { Button } from "~/components/ui/button";
import { OtpInput } from "~/components/ui/otp-input";
import { storeTokens } from "~/lib/axios";
import { useOTPStore } from "~/store/otp-store";
import { useUserStore } from "~/store/user-store";

const OtpForm = () => {
  const [showResend, setShowResend] = useState(false);
  const { mobile } = useOTPStore((state) => state);
  const { setUser } = useUserStore((state) => state);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setShowResend(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: { otp: "" },
  });

  const { mutate } = useVerifyOTP();
  const { mutate: otpResend } = useOTPResend();

  const onSubmit = (data: any) => {
    mutate(
      { mobile: mobile ?? "", otp: data.otp },
      {
        onSuccess: (successData: any) => {
          setUser(successData.user);

          storeTokens(
            successData.accessToken,
            successData.refreshToken,
            successData.accessTokenExp,
            successData.refreshTokenExp
          );

          if (successData.msg91Response.type === "error") {
            return toast.error(successData.msg91Response.message);
          }
          toast.success("Login successful");
          reset();
          queryClient
            .invalidateQueries({ queryKey: ["user"] })
            .catch(console.error);

          const needsProfileUpdate =
            !successData.user?.name?.trim() || !successData.user?.email?.trim();

          if (needsProfileUpdate) {
            router.push("/(auth)/update-form");
          } else {
            router.push("/home/explore");
          }
        },
        onError: () => {
          toast.error("Error verifying OTP.");
        },
      }
    );
  };

  const onResendOTP = () => {
    otpResend(
      {
        mobile: mobile ?? "",
      },
      {
        onSuccess: () => {
          toast.success("OTP resent successfully");
          setShowResend(false);
        },
        onError: (error: any) => {
          console.log(error);
          toast.error(error?.message || "OTP resend failed");
        },
      }
    );
  };

  return (
    <View className='flex-1 justify-center  bg-background px-4'>
      <LoginHeader />
      <View className='p-4 justify-center flex-1'>
        <Pressable
          onPress={() => router.back()}
          className='w-20 mb-10 bg-transparent'
          android_ripple={{ color: "transparent" }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "transparent" : "transparent",
            },
          ]}
        >
          <View className='flex flex-row items-center gap-1 '>
            <ChevronLeft size={12} color={"#6b7280"} />
            <Text className='text-gray-500 text-xs'> Go Back</Text>
          </View>
        </Pressable>

        {/* <Text className='text-sm mb-4 ml-1 font-medium'>Enter OTP</Text> */}

        <Controller
          control={control}
          name='otp'
          rules={{ required: true, minLength: 4, maxLength: 4 }}
          render={({ field: { value, onChange } }) => (
            <OtpInput value={value} onChange={onChange} />
          )}
        />

        {errors.otp && (
          <Text className='text-destructive text-xs'>
            Please enter a 4-digit OTP
          </Text>
        )}

        <Button className='mt-8' onPress={handleSubmit(onSubmit)}>
          <Text className='text-white text-sm text-center font-medium'>
            Continue
          </Text>
        </Button>
        {showResend && (
          <Button
            className='mt-3.5 bg-amber-500'
            onPress={() => {
              onResendOTP();
            }}
          >
            <Text className='text-white text-sm text-center font-medium'>
              Resend OTP
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default OtpForm;
