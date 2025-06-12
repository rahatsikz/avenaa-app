import { useQueryClient } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import { useRouter } from "expo-router";
import { ChevronLeft, Loader2 } from "lucide-react-native";
// import PayUBizSdk from "payu-non-seam-less-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { useCreateBooking } from "~/api/booking.query";
import { cn } from "~/lib/utils";
import { useSearchStore } from "~/store/search-store";
import { IProperty, User } from "~/types";
import { toast } from "../shared/toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PaymentSelection } from "./payment-selection";
import { TermsAndCondition } from "./terms-condition";

export function PaymentForm({
  product,
  userData,
}: {
  product: IProperty;
  userData: User;
}) {
  const { adults, children, range } = useSearchStore((state) => state);

  const queryClient = useQueryClient();
  const router = useRouter();

  const daysStaying =
    range.end && range.start
      ? differenceInDays(new Date(range.end), new Date(range.start))
      : 0;

  const tax = product?.tax ?? 0;

  const priceWithDiscount = product?.priceWithDiscount ?? 0;
  const totalPriceWithDiscount = priceWithDiscount * daysStaying;

  const taxAmount = priceWithDiscount * (tax / 100);
  const totalTaxAmount = taxAmount * daysStaying;

  const totalPrice = totalPriceWithDiscount + totalTaxAmount;

  const { mutate, isPending } = useCreateBooking();
  // const [txnId] = useState<string | null>(new Date().getTime().toString());

  const handleBooking = async (values: any) => {
    if (values.paymentMode === "PAYMENT_ONLINE") {
      // 1. Get hash from backend
      // const hashResponse = await axiosInstance.post("/payu/hash", {
      //   txnid: txnId,
      //   amount: totalPrice.toString(),
      //   productinfo: product.title,
      //   firstname: values.bookerFirstName,
      //   email: values.bookerEmail,
      //   phone: values.bookerContact,
      // });
      // const hash = hashResponse.data.hash;
      // 2. Build params and start payment
      // const payUPaymentParams = {
      //   key: process.env.EXPO_PUBLIC_PAYU_MERCHANT_KEY,
      //   transactionId: txnId,
      //   amount: totalPrice.toString(),
      //   productInfo: product.title,
      //   firstName: values.bookerFirstName,
      //   email: values.bookerEmail,
      //   phone: values.bookerContact,
      //   android_surl: "https://cbjs.payu.in/sdk/success",
      //   android_furl: "https://cbjs.payu.in/sdk/failure",
      //   environment: "1",
      //   userCredential: `${process.env.EXPO_PUBLIC_PAYU_MERCHANT_KEY}:${values.bookerEmail}`,
      //   hash,
      // };
      // console.log("payu", payUPaymentParams);
      // const paymentObject = {
      //   payUPaymentParams,
      //   payUCheckoutProConfig: {},
      // };
      // PayUBizSdk.openCheckoutScreen(paymentObject);
    } else {
      const bookingData = {
        propertyId: product.id,
        checkInDate: range.start ? new Date(range.start) : null,
        checkOutDate: range.end ? new Date(range.end) : null,
        bookerName: userData?.name ?? "",
        bookerEmail: userData?.email ?? "",
        bookerContact: userData?.phone ?? "",
        amount: totalPrice,
        noOfGuests: Number(adults) + Number(children),
        days: daysStaying,
      };

      mutate(
        {
          ...bookingData,
          bookerContact: values.bookerContact,
          bookerEmail: values.bookerEmail,
          bookerFirstName: values.bookerFirstName,
          bookerLastName: values.bookerLastName,
          paymentMode: values.paymentMode,
        },
        {
          onSuccess: (data: any) => {
            queryClient
              .invalidateQueries({ queryKey: ["bookings"] })
              .catch(console.error);
            queryClient
              .invalidateQueries({ queryKey: ["property"] })
              .catch(console.error);
            toast.success("Booking created successfully");
            setPaymentStep(false);
            setTimeout(() => {
              router.push(`/home/trips`);
            }, 2000);
          },
          onError: (error: any) => {
            toast.error(error.message || "Something went wrong");
          },
        }
      );
    }
  };
  const [paymentStep, setPaymentStep] = useState(false);
  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      bookerContact: String(
        userData?.phone?.startsWith("+91")
          ? userData?.phone?.slice(3)
          : userData?.phone ?? ""
      ),
      bookerEmail: String(userData?.email ?? ""),
      bookerFirstName: String(
        userData?.name
          ? userData.name.split(" ").length > 1
            ? userData.name.split(" ").slice(0, -1).join(" ")
            : userData.name
          : ""
      ),
      bookerLastName: String(
        userData?.name
          ? userData.name.split(" ").length > 1
            ? userData.name.split(" ").slice(-1)[0]
            : ""
          : ""
      ),
      paymentMode:
        userData && (userData as any).paymentMode === "PAYMENT_ONLINE"
          ? "PAYMENT_ONLINE"
          : "PAYMENT_ON_ARRIVAL",
    },
  });

  const userDetailFields = [
    "bookerFirstName",
    "bookerLastName",
    "bookerEmail",
    "bookerContact",
  ];
  const handleNext = async () => {
    const valid = await form.trigger(userDetailFields as any);
    if (valid && range.start && range.end) {
      setPaymentStep(true);
    }
  };

  const formConfig = [
    {
      label: "First name",
      name: "bookerFirstName",
      type: "text",
    },
    {
      label: "Last name",
      name: "bookerLastName",
      type: "text",
    },
    {
      label: "Email",
      name: "bookerEmail",
      type: "email",
    },
    {
      label: "Mobile number",
      name: "bookerContact",
      type: "number",
    },
  ];

  // useEffect(() => {
  //   const eventEmitter = new NativeEventEmitter(PayUBizSdk);

  //   const paymentSuccess = eventEmitter.addListener("onPaymentSuccess", (e) => {
  //     console.log("Payment Success", e);
  //   });
  //   const paymentFailure = eventEmitter.addListener("onPaymentFailure", (e) => {
  //     console.log("Payment Failure", e);
  //   });
  //   const paymentCancel = eventEmitter.addListener("onPaymentCancel", (e) => {
  //     console.log("Payment Cancel", e);
  //   });
  //   const error = eventEmitter.addListener("onError", (e) => {
  //     console.log("Error", e);
  //   });
  //   const generateHash = eventEmitter.addListener("generateHash", async (e) => {
  //     // Send e.hashString to your backend, get hash, then:\
  //     try {
  //       const result = await axiosInstance.post("/payu/hash", {
  //         txnid: txnId,
  //         amount: totalPrice.toString(),
  //         productinfo: product.title,
  //         firstname: form.getValues("bookerFirstName"),
  //         email: form.getValues("bookerEmail"),
  //         phone: form.getValues("bookerContact"),
  //       });
  //       const hashValue = result.data.hash;
  //       PayUBizSdk.hashGenerated({ hashName: "hash", hashValue: hashValue });
  //     } catch (error) {
  //       console.log("Error", error);
  //     }
  //   });

  //   return () => {
  //     console.log("Removing event listeners");
  //     paymentSuccess.remove();
  //     paymentFailure.remove();
  //     paymentCancel.remove();
  //     error.remove();
  //     generateHash.remove();
  //   };
  // }, []);

  return (
    <View>
      <Pressable
        onPress={() => setPaymentStep(false)}
        className={cn(
          "w-20 mb-5 mt-3 bg-transparent",
          !paymentStep && "hidden"
        )}
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
      {paymentStep ? (
        <Controller
          control={form.control}
          name={"paymentMode"}
          render={({ field: { onChange, onBlur, value } }) => (
            <PaymentSelection onChange={onChange} value={value} />
          )}
        />
      ) : (
        <View className='gap-2'>
          {formConfig.map((field) => (
            <RenderBookingForm
              key={field.name}
              form={form}
              label={field.label}
              name={field.name}
              type={field.type}
            />
          ))}
        </View>
      )}

      <TermsAndCondition />
      {!paymentStep && (
        <Button
          className='mt-8 min-w-60'
          onPress={handleNext}
          disabled={!range.start || !range.end}
        >
          <Text className='text-white text-sm font-medium'>
            Continue to Payment
          </Text>
        </Button>
      )}

      {paymentStep && (
        <View className='mt-8 flex flex-row-reverse justify-end gap-3 max-md:flex-col'>
          <Button
            className='min-w-60'
            onPress={form.handleSubmit(handleBooking)}
          >
            {isPending ? (
              <Text className='flex flex-row items-center gap-2'>
                <Loader2
                  color={"#fff"}
                  size={14}
                  className='size-4 animate-spin'
                />
                <Text>Submitting</Text>
              </Text>
            ) : (
              <Text className='text-white text-sm font-medium'>
                Submit Booking Request
              </Text>
            )}
          </Button>
          <Button
            className='min-w-48'
            variant={"destructive"}
            onPress={() => setPaymentStep(false)}
          >
            <Text className='text-white text-sm font-medium'>Go back</Text>
          </Button>
        </View>
      )}

      {/* {triggerPayU && (
          <PayUCheckout
            payUPaymentParams={payUPaymentParams}
            payUCheckoutProConfig={payUCheckoutProConfig}
            onSuccess={(data: unknown) => {
              setTriggerPayU(false);
            }}
            onFailure={(data: unknown) => {
              setTriggerPayU(false);
            }}
            onCancel={(data: unknown) => {
              setTriggerPayU(false);
            }}
            onError={(data: unknown) => {
              setTriggerPayU(false);
            }}
            onGenerateHash={(e: any, callback: (hash: string) => void) => {
              const merchantSalt = "YOUR_MERCHANT_SALT"; // <-- Replace with your actual salt
              const hash = sha512(e.hashString + merchantSalt);
              callback(hash);
            }}
            triggerPayment={triggerPayU}
          />
        )} */}
    </View>
  );
}

function RenderBookingForm({
  label,
  name,
  type,
  form,
}: {
  label: string;
  name: string;
  type: string;
  form: any;
}) {
  return (
    <View>
      <Text className='my-2 text-sm font-medium text-foreground'>{label}</Text>
      <Controller
        control={form.control}
        name={name}
        rules={
          type === "email"
            ? { required: true, pattern: /^\S+@\S+\.\S+$/ }
            : { required: true, minLength: 1 }
        }
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            className='w-full placeholder:text-xs'
            placeholder={`Enter your ${label}`}
            keyboardType={type === "email" ? "email-address" : "default"}
            autoCapitalize='none'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {form.formState.errors[name] && (
        <Text className='text-xs text-red-500 font-medium mt-2 pl-1'>
          {form.formState.errors[name]?.message}
        </Text>
      )}
    </View>
  );
}
