import { useLocalSearchParams } from "expo-router";
import { Loader2 } from "lucide-react-native";
import { SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetProperty } from "~/api/property.query";
import PaymentDetails from "~/components/payment/payment-detail";
import { IProperty } from "~/types";

export default function Payment() {
  const inset = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { data: product, isLoading, isFetching } = useGetProperty(id as string);

  if (isLoading || isFetching)
    return (
      <SafeAreaView
        style={{ paddingTop: inset.top + 6 }}
        className='pt-8 flex items-center bg-background flex-1 justify-center'
      >
        <Loader2 color={"#a3a3a3"} className='size-4 animate-spin' />
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      className='bg-background flex-1'
      style={{ paddingTop: inset.top + 6 }}
    >
      <ScrollView className='px-5 flex-1 '>
        <PaymentDetails product={product as IProperty} />
      </ScrollView>
    </SafeAreaView>
  );
}
