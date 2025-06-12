import { Loader2 } from "lucide-react-native";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetWishlist } from "~/api/property.query";
import PropertyCard from "~/components/shared/property-card";
import { useUserStore } from "~/store/user-store";
import { IProperty } from "~/types";
export default function Wishlists() {
  const insets = useSafeAreaInsets();

  const { user } = useUserStore((state) => state);

  const { data, isLoading, isFetching } = useGetWishlist(user?.id as string);

  if (isLoading || isFetching)
    return (
      <SafeAreaView
        style={{ paddingTop: insets.top + 6 }}
        className='pt-8 flex items-center bg-background flex-1 justify-center'
      >
        <Loader2 color={"#a3a3a3"} className='size-4 animate-spin' />
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top + 6 }}
      className='bg-background flex-1 '
    >
      <ScrollView className='px-4 flex-1'>
        <Text className='text-xl font-semibold mt-4 pl-1 text-foreground'>
          My Wishlists
        </Text>
        <View className='flex-1 mt-2.5 gap-3.5'>
          {data?.length === 0 && (
            <View className='flex-1 px-1.5'>
              <Text className='text-sm font-medium text-foreground'>
                No wishlists found
              </Text>
            </View>
          )}
          {data.map((item: IProperty) => (
            <PropertyCard key={item.id} property={item} wishlistData={data} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
