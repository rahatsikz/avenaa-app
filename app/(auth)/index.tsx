import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, Text, View } from "react-native";
import { z } from "zod";
import { useSendOTP } from "~/api/auth.query";
import { LoginHeader } from "~/components/shared/login-header";
import { toast } from "~/components/shared/toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import axiosInstance, { storeTokens } from "~/lib/axios";
import { useOTPStore } from "~/store/otp-store";
import { useUserStore } from "~/store/user-store";

const phoneSchema = z.object({
  phone: z.string().regex(/^(?:\+91[\-\s]?)?[6-9]\d{9}$/, {
    message: "Enter a valid Indian mobile number",
  }),
});

export default function Index() {
  const { user } = useUserStore((state) => state);

  useEffect(() => {
    if (user?.id && user?.name) {
      setTimeout(() => {
        router.replace("/home/explore");
      }, 0);
    }
  }, [user]);

  return (
    <SafeAreaView className='bg-background flex-1 px-4'>
      <View className=' justify-center flex-1'>
        <SignInForm />
      </View>
    </SafeAreaView>
  );
}

const SignInForm = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ??
        "1028380320301-duiop4m58e7pl723gcksu3cm821mhm4p.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    });
  }, []);

  const [countryCode, setCountryCode] = useState({
    value: "+91",
    label: "+91",
  });

  const { mutate } = useSendOTP();
  const { setMobile } = useOTPStore((state) => state);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(phoneSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { phone: "" },
  });

  const onSubmit = (data: any) => {
    // router.push("/(auth)/otp-verification");

    mutate(
      { mobile: countryCode.value + data.phone },
      {
        onSuccess: () => {
          toast.success("OTP sent successfully.");
          router.push("/(auth)/otp-verification");
          setMobile(countryCode.value + data.phone);
        },
        onError: () => {
          toast.error("Error sending OTP.");
        },
      }
    );

    // setIsNumberSubmitted(true);
    // trigger OTP logic here
  };

  WebBrowser.maybeCompleteAuthSession();

  const { setUser } = useUserStore((state) => state);
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const { data } = await GoogleSignin.signIn();
      if (!data) {
        toast.error("Google sign-in did not return any data. Try again?");
        return;
      }

      const tokens = await GoogleSignin.getTokens();

      if (!tokens.idToken || !tokens.accessToken) {
        toast.error("Could not retrieve idToken or accessToken from Google.");
        return;
      }

      const response = await axiosInstance.post(
        `/auth/google/token`,
        {
          idToken: tokens.idToken,
          accessToken: tokens.accessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-App-Type": "mobile",
          },
        }
      );

      const json = response.data;

      if (json.success) {
        // Backend gave us user + tokens
        storeTokens(
          json.accessToken,
          json.refreshToken,
          json.accessTokenExp,
          json.refreshTokenExp
        );
        setUser(json.user);
        toast.success("Login successful");
        router.push("/home" as any);
      } else {
        // If your backend returns { success: false, message: "…" }
        toast.error(json.message || "Login failed for unknown reasons.");
      }
    } catch (error: any) {
      // If axios got an HTTP error from your backend:
      if (isAxiosError(error) && error.response) {
        console.warn("Backend error:", error.response.data);
        const backendMsg =
          error.response.data?.message || "Backend authentication failed.";
        toast.error(backendMsg);
        return;
      }

      // If it’s an error coming from GoogleSignin (statusCodes)
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log("Sign-in already in progress—please wait.");
            toast.error("Sign-in already in progress.");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play Services not available or outdated.");
            toast.error("Google Play Services not available.");
            break;
          default:
            console.log("Google signin error:", error);
            toast.error("Google sign-in failed. Try again?");
        }
        return;
      }

      // Anything else (network, unexpected, etc.)
      console.error("An unexpected error occurred:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView className='flex-1  bg-background '>
      <LoginHeader />
      <View className='p-4 justify-center flex-1'>
        {/* <Text className='text-base font-semibold mb-4'>Login / Sign Up</Text> */}

        <Controller
          control={control}
          name='phone'
          rules={{ required: true, minLength: 7, maxLength: 10 }}
          render={({ field: { onChange, value } }) => (
            <View className='flex-row items-center  w-full gap-3'>
              <Select
                value={countryCode}
                onValueChange={setCountryCode as any}
                defaultValue={{ value: "+91", label: "+91" }}
              >
                <SelectTrigger className='w-20 native:h-12'>
                  <SelectValue
                    className='text-foreground text-sm '
                    placeholder='Select'
                  />
                </SelectTrigger>
                <SelectContent className='' sideOffset={7}>
                  <SelectGroup>
                    <SelectItem label='+91' value='+91'>
                      +91
                    </SelectItem>
                    <SelectItem label='+88' value='+88'>
                      +88
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                className='native:h-12 placeholder:text-xs flex-1 placeholder:text-foreground/80'
                placeholder='Enter mobile number'
                keyboardType='number-pad'
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />

        {errors.phone ? (
          <Text className='text-red-500 text-xs mt-2'>
            Enter a valid Indian mobile number
          </Text>
        ) : null}

        <Button onPress={handleSubmit(onSubmit)} className='mt-4'>
          <Text className='text-white text-center text-sm font-medium'>
            Get OTP
          </Text>
        </Button>

        <Text className='text-xs text-center text-gray-500 mt-5'>
          By proceeding, you agree to Avenaa&apos;s{" "}
          <Text className='text-blue-500'>Privacy Policy</Text> ,{" "}
          <Text className='text-blue-500'>User Agreement</Text> and{" "}
          <Text className='text-blue-500'>Terms of Service</Text>
        </Text>

        <Separator className='my-5' />

        <Button
          variant={"outline"}
          className='border-red-400'
          // disabled={!request} onPress={() => promptAsync()}clear
          onPress={handleGoogleSignIn}
        >
          <Text className='text-red-400 text-center text-sm font-medium'>
            Login with Google
          </Text>
        </Button>

        <Button
          onPress={() => router.push("/(auth)/email-login")}
          className='mt-4'
        >
          <Text className='text-white text-sm text-center font-medium'>
            Login with Email
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
