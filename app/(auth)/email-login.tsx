import { useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLogin } from "~/api/auth.query";
import { toast } from "~/components/shared/toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { storeTokens } from "~/lib/axios";
import { useUserStore } from "~/store/user-store";

const EmailLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { setUser, user } = useUserStore((state) => state);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        router.replace("/home/explore");
      }, 0);
    }
  }, [user, router]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "mailtorahat@proton.me",
      password: ".w%k|^$nH2V",
      // email: "rahilansari074@gmail.com",
      // password: "12345678",
    },
  });

  const { mutate: loginMutate } = useLogin();

  const onSubmit = (data: any) => {
    loginMutate(data as any, {
      onSuccess: (successData: any) => {
        storeTokens(
          successData.accessToken,
          successData.refreshToken,
          successData.accessTokenExp,
          successData.refreshTokenExp
        );
        setUser(successData.user);

        toast.success("Login successful");

        router.push("/home" as any);

        reset();
      },
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.message || "Login failed");
      },
    });
  };

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const loginHeader = () => (
    <View className='items-center'>
      <Text className='text-xl text-foreground font-medium  text-center'>
        Login or Sign up
      </Text>
      <Text className='text-2xl text-foreground  mt-0  text-center'>
        Welcome to
        <Text className='font-bold text-primary'> Avenaa</Text>
      </Text>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 justify-center bg-background '>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
        className='bg-background'
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "android" ? 60 : 20}
        keyboardOpeningTime={0}
      >
        <View className=''>
          {!keyboardVisible && loginHeader()}
          <View className=' gap-2 px-4 my-10  justify-center flex-1'>
            <Pressable
              onPress={() => router.back()}
              className='w-20 mb-4 bg-transparent'
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

            <Text className=' text-sm font-medium text-foreground'>Email</Text>

            <Controller
              control={control}
              name='email'
              rules={{
                required: true,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className='w-full placeholder:text-xs'
                  placeholder='Enter your email'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text className='text-red-500 text-xs my-2'>Invalid email</Text>
            )}

            <Text className='text-sm font-medium text-foreground mt-4'>
              Password
            </Text>

            <Controller
              control={control}
              name='password'
              rules={{ required: true, minLength: 6 }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className='flex-row items-center relative '>
                  <Input
                    className='w-full flex-1 placeholder:text-xs'
                    placeholder='Enter your password'
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <Button
                    className='absolute right-0 -top-1 h-full px-2'
                    onPress={() => setShowPassword(!showPassword)}
                    variant={"ghost"}
                  >
                    {showPassword ? (
                      <Eye size={10} color='#999' />
                    ) : (
                      <EyeOff size={10} color='#999' />
                    )}
                  </Button>
                </View>
              )}
            />
            {errors.password && (
              <Text className='text-red-500 text-xs my-2'>
                Password must be at least 6 characters
              </Text>
            )}

            <Button onPress={handleSubmit(onSubmit)} className='mt-5'>
              <Text className='text-center text-white text-sm font-medium'>
                Login
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EmailLoginForm;
