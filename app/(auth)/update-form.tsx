import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { useUserInfoUpdate } from "~/api/user.query";
import { toast } from "~/components/shared/toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useUserStore } from "~/store/user-store";

function UpdateProfile() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: { name: "", email: "" },
  });

  const { user: userData, updateUser } = useUserStore((state) => state);

  const { mutate } = useUserInfoUpdate(userData?.id ?? "");
  const queryClient = useQueryClient();

  const onSubmit = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        queryClient
          .invalidateQueries({ queryKey: ["user"] })
          .catch(console.error);
        updateUser({ name: data.name, email: data.email });
        toast.success("Profile updated successfully");
        setTimeout(() => {
          router.push("/home/explore");
        }, 1000);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update profile");
      },
    });
  };

  return (
    <View className='relative z-50 bg-background px-8 flex-1 justify-center'>
      <View className='mb-6'>
        <Text className='text-lg  text-center font-semibold text-foreground mb-0.5'>
          Update Profile Info
        </Text>
        <Text className='text-sm  mb-4 text-gray-500 text-center'>
          Update your legal name and contact email to proceed
        </Text>
      </View>

      <Text className='text-sm font-medium mb-2.5 ml-1 text-foreground'>
        Legal Name
      </Text>
      <Controller
        control={control}
        name='name'
        rules={{ required: true, minLength: 3 }}
        render={({ field: { onChange, value } }) => (
          <Input
            className='placeholder:text-xs  '
            placeholder='Enter legal name'
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name && (
        <Text className='text-red-500 text-xs mt-2'>
          {errors.name.type === "required"
            ? "Legal name is required"
            : "Legal name must be at least 3 characters"}
        </Text>
      )}
      <Text className='text-sm font-medium mb-2.5 ml-1 mt-6 text-foreground'>
        Contact Email
      </Text>
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
        render={({ field: { onChange, value } }) => (
          <Input
            autoCapitalize='none'
            keyboardType='email-address'
            className='placeholder:text-xs  '
            placeholder='Enter legal name'
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && (
        <Text className='text-red-500 text-xs mt-2'>Invalid email</Text>
      )}

      <Button className='mt-6' onPress={handleSubmit(onSubmit)}>
        <Text className='text-white text-sm text-center font-medium'>
          Update
        </Text>
      </Button>
    </View>
  );
}

export default UpdateProfile;
