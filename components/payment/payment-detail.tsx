import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { IProperty } from "~/types";
import { Separator } from "../ui/separator";
import { PaymentConfirmation } from "./payment-confirmation";
import { PaymentDetailsDialog } from "./payment-details-dialogue";

export default function PaymentDetails({ product }: { product: IProperty }) {
  return (
    <View className='my-6 flex-1'>
      <Pressable
        onPress={() => router.push(`/home/explore/${product.id}`)}
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
      <Text className='text-xl font-semibold'>Your Stay</Text>
      <Text className='text-sm text-muted-foreground'>
        Review the details of your booking to continue
      </Text>

      <PaymentDetailsDialog product={product} />

      <Separator className='my-8' />

      <PaymentConfirmation product={product} />
    </View>
  );
}
