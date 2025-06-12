import { Text, View } from "react-native";
import { useGetProfile } from "~/api/user.query";
import { IProperty } from "~/types";
import { PaymentForm } from "./payment-form";

export function PaymentConfirmation({ product }: { product: IProperty }) {
  const {
    data: userData,
    isFetched,
    isFetching,
  } = useGetProfile({ enabled: true });
  if (!isFetched || isFetching) return null;
  return (
    <View>
      <View className='mb-4 gap-0.5'>
        <Text className='text-xl font-semibold text-foreground'>
          Your Booking Details
        </Text>
        <View className='gap-2.5'>
          <Text className='text-sm text-muted-foreground'>
            Review your personal details to continue your booking
          </Text>
          <View className='w-fit max-w-lg rounded bg-yellow-100 '>
            <Text className='px-3 py-1.5 text-xs font-medium text-gray-800'>
              The autofill data is coming from your avena account. You can
              change booker details here
            </Text>
          </View>
        </View>
      </View>
      <PaymentForm product={product} userData={userData!} />
    </View>
  );
}
