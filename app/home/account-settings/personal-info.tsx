import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import Toast from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOTPResend, useSendOTP, useVerifyOTP } from "~/api/auth.query";
import { useGetProfile, useUserInfoUpdate } from "~/api/user.query";
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
import { OtpInput } from "~/components/ui/otp-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/store/user-store";
export default function PersonalInfo() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      className='bg-background flex-1 '
      style={{ paddingTop: insets.top + 20 }}
    >
      <PersonalInfoForm />
    </SafeAreaView>
  );
}

function PersonalInfoForm() {
  const router = useRouter();

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isNumberSubmitted, setIsNumberSubmitted] = useState(false);
  const [countryCode, setCountryCode] = useState({
    value: "+91",
    label: "+91",
  });

  const { mutate: sendOTP } = useSendOTP();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: { phone: "" },
  });

  const onSubmit = (data: any) => {
    sendOTP(
      { mobile: countryCode.value + data.phone },
      {
        onSuccess: () => {
          console.log("OTP sent successfully.");
          setIsNumberSubmitted(true);
        },
        onError: () => {
          console.log("Error sending OTP.");
        },
      }
    );
  };

  const { user: userData, updateUser } = useUserStore((state) => state);

  const { data: user } = useGetProfile({
    enabled: userData?.id ? true : false,
  });

  const { mutate } = useUserInfoUpdate(userData?.id ?? "");

  const verificationState = () => {
    switch (user?.isVerified) {
      case true:
        return "Verified";
      case false:
        if (user.frontImage && user.backImage) {
          return "Under Review";
        }
        return "Not verified";
    }
  };

  const fields = [
    {
      id: "legal-name",
      label: "Legal name",
      value: user?.name ?? null,
      action: "edit",
    },
    {
      id: "email",
      label: "Email address",
      value: user?.email ?? null,
      action: user?.email ? null : "edit",
    },
    {
      id: "phone",
      label: "Phone number",
      value: user?.phone ?? null,
      description:
        "Contact number (for confirmed guests and Avenaa to get in touch). You can add other numbers and choose how they're used.",
      action: user?.phoneVerified ? null : "verify",
    },
    {
      id: "identity",
      label: "Identity verification",
      value: verificationState() ?? null,
      action:
        verificationState() === "Verified" ||
        verificationState() === "Under Review"
          ? null
          : "start",
    },
    {
      id: "address",
      label: "Address",
      value: user?.address ?? null,
      action: "edit",
    },
  ];

  const handleEdit = (field: any) => {
    setEditingFieldId(field.id);
    setEditValue(field.value ?? "");
  };

  const handleSave = () => {
    if (editingFieldId) {
      // Update the Zustand store directly
      switch (editingFieldId) {
        case "legal-name":
          updateUser({ name: editValue });
          mutate({ name: editValue });
          break;

        case "email":
          updateUser({ email: editValue });
          mutate({ email: editValue });
          break;
        case "phone":
          updateUser({ phone: editValue });
          mutate({ phone: editValue });
          break;
        case "identity":
          updateUser({ isVerified: Boolean(editValue) });
          break;
        case "address":
          updateUser({ address: editValue });
          mutate({ address: editValue });
          break;
      }

      // Close the dialog
      setEditingFieldId(null);
    }
  };

  const getActionButton = (field: any) => {
    let buttonText;
    switch (field.action) {
      case "edit":
        buttonText = "Edit";
        break;
      case "add":
        buttonText = "Add";
        break;
      case "start":
        buttonText = "Start";
        break;
      case "verify":
        buttonText = "Verify";
        break;
      default:
        buttonText = "";
    }

    if (field.action === null) return null;

    if (field.action === "start")
      return (
        <Button
          size={"sm"}
          className={`px-0 font-medium ${
            field.action === "start" ? "px-5" : ""
          }`}
          onPress={() => router.push("/home/account-settings/verify" as any)}
        >
          <Text className='text-white text-sm'>{buttonText}</Text>
        </Button>
      );

    if (field.action === "verify") {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size={"sm"}
              className='px-4 font-medium'
              onPress={() => handleEdit(field)}
            >
              <Text className='text-white text-sm'>{buttonText}</Text>
            </Button>
          </DialogTrigger>
          <DialogContent className={"w-96 "}>
            <DialogHeader className='gap-0'>
              <DialogTitle className='capitalize'>
                Verify&nbsp;
                {field.label.toLowerCase()}
              </DialogTitle>
            </DialogHeader>
            <View>
              {isNumberSubmitted ? (
                <OtpForm
                  mobile={watch("phone") + countryCode.value}
                  setIsNumberSubmitted={setIsNumberSubmitted}
                />
              ) : (
                <View>
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
                          className='native:h-12 placeholder:text-xs flex-1 '
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
                      Enter a valid number
                    </Text>
                  ) : null}

                  <Button onPress={handleSubmit(onSubmit)} className='mt-4'>
                    <Text className='text-white text-center text-sm font-medium'>
                      Get OTP
                    </Text>
                  </Button>
                </View>
              )}
            </View>
            {/* <div className="flex justify-end">
              <Button onClick={handleSave}>Save</Button>
              <DialogClose ref={closeDialogRef} className="hidden" />
            </div> */}
          </DialogContent>
        </Dialog>
      );
    }

    return (
      field.action === "edit" && (
        <Dialog
          open={editingFieldId === field.id}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setEditingFieldId(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              size={"sm"}
              className='px-[22px] font-medium text-primary hover:text-primary'
              onPress={() => handleEdit(field)}
            >
              <Text className='text-white text-sm'>{buttonText}</Text>
            </Button>
          </DialogTrigger>
          <DialogContent className='w-96'>
            <DialogHeader>
              <DialogTitle>
                {field.action === "edit"
                  ? "Edit"
                  : field.action === "add"
                  ? "Add"
                  : "Start"}{" "}
                {field.label.toLowerCase()}
              </DialogTitle>
            </DialogHeader>
            <View className='grid gap-4 mt-3 mb-2'>
              <View className=' gap-3'>
                <Text className='text-sm text-foreground/80'>
                  {field.label}
                </Text>
                <Input
                  id={field.id}
                  value={editValue}
                  // onChange={(e: any) => setEditValue(e.target.value)}
                  onChangeText={setEditValue}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  className='native:h-12'
                />
              </View>
            </View>
            <View className='flex justify-end'>
              <Button variant='default' onPress={handleSave}>
                <Text className='text-white text-sm'>Save</Text>
              </Button>
            </View>
          </DialogContent>
        </Dialog>
      )
    );
  };

  return (
    <SafeAreaView>
      <ScrollView className='px-6 '>
        <TouchableOpacity
          className='w-[70px]'
          onPress={() => router.push("/home/profile")}
        >
          <View className='flex flex-row items-center gap-1 mb-5 '>
            <ChevronLeft size={12} color={"#6b7280"} />
            <Text className='text-gray-500 text-xs'> Go Back</Text>
          </View>
        </TouchableOpacity>
        <View className='flex-1 pb-4'>
          <Text className='mb-3 text-2xl text-foreground font-bold'>
            Personal info
          </Text>
          <View className='gap-6'>
            {fields.map((field, idx) => (
              <View key={field.id}>
                <View className='flex flex-col gap-1.5'>
                  <View className='flex flex-row items-center justify-between'>
                    <View>
                      <Text className='text-base text-foreground/80 font-medium'>
                        {field.label}
                      </Text>
                      <Text
                        className={cn(
                          "text-sm mt-0.5 text-muted-foreground",
                          field.id === "email" || field.id === "legal-name"
                            ? ""
                            : "max-w-[80%]"
                        )}
                      >
                        {field.value ? field.value : "Not provided"}
                      </Text>
                      {field.id === "phone"
                        ? user?.phoneVerified &&
                          user.phone && (
                            <Text className='mt-1 text-sm font-medium text-primary'>
                              Verified
                            </Text>
                          )
                        : null}
                      {field.id === "phone"
                        ? user?.phone &&
                          !user?.phoneVerified && (
                            <Text className='mt-1 text-sm font-medium text-amber-500'>
                              Not Verified
                            </Text>
                          )
                        : null}
                      {field.description && (
                        <Text className='mt-1 max-w-[80%] text-sm text-muted-foreground'>
                          {field.description}
                        </Text>
                      )}
                    </View>
                    <View className='ml-auto'>{getActionButton(field)}</View>
                  </View>
                </View>
                {idx !== fields.length - 1 && <Separator className='mt-6' />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OtpForm({
  mobile,
  setIsNumberSubmitted,
}: {
  mobile: string;
  setIsNumberSubmitted: (value: boolean) => void;
}) {
  const router = useRouter();
  const [showResend, setShowResend] = useState(false);
  const { mutate } = useVerifyOTP();
  const { mutate: otpResend } = useOTPResend();
  const queryClient = useQueryClient();

  const { setUser } = useUserStore((state) => state);

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

  const onSubmit = (data: any) => {
    mutate(
      { mobile: mobile ?? "", otp: data.otp },
      {
        onSuccess: (successData: any) => {
          if (successData.msg91Response.type === "error") {
            return toast.error(successData.msg91Response.message);
          }
          toast.success("Login successful");
          reset();
          setUser(successData.user);
          queryClient
            .invalidateQueries({ queryKey: ["user"] })
            .catch(console.error);

          const needsProfileUpdate =
            !successData.user?.name?.trim() || !successData.user?.email?.trim();

          if (needsProfileUpdate) {
            setTimeout(() => {
              router.push("/(auth)/update-form");
            }, 500);
          }
        },
        onError: () => {
          console.log("Error sending OTP.");
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
    <View className={cn(showResend ? "h-52" : "h-40")}>
      <TouchableOpacity onPress={() => setIsNumberSubmitted(false)}>
        <View className='flex flex-row items-center gap-1 mb-7 mt-2'>
          <ChevronLeft size={12} color={"#6b7280"} />
          <Text className='text-gray-500 text-sm '> Go Back</Text>
        </View>
      </TouchableOpacity>

      <View className='flex-1 '>
        <Controller
          control={control}
          name='otp'
          rules={{ required: true, minLength: 4, maxLength: 4 }}
          render={({ field: { value, onChange } }) => (
            <OtpInput value={value} onChange={onChange} />
          )}
        />

        {errors.otp ? (
          <Text className='text-red-500'>Please enter a valid OTP</Text>
        ) : null}

        <DialogClose asChild>
          <Button size={"sm"} className='mt-7' onPress={handleSubmit(onSubmit)}>
            <Text className='text-white text-sm text-center font-medium'>
              Verify
            </Text>
          </Button>
        </DialogClose>
        {showResend && (
          <Button
            size={"sm"}
            className='mt-3 bg-amber-500'
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
}
