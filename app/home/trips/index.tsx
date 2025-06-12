import { Loader2 } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetBookings } from "~/api/booking.query";
import { Pagination } from "~/components/shared/pagination";
import { BookingStack } from "~/components/trips/booking-stack";
import { MyBookingCard } from "~/components/trips/bookings-card";
import { cn } from "~/lib/utils";
import { Booking } from "~/types";

export default function Trips() {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);

  const {
    data: userBookingData,
    isLoading,
    isFetching,
  } = useGetBookings({
    page,
    limit: 5,
  });

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
      style={{ paddingTop: insets.top }}
      className='bg-background flex-1'
    >
      <ScrollView className='px-4 flex-1'>
        <Text className={cn("text-xl font-semibold mt-4 pl-1 text-foreground")}>
          My Trips
        </Text>
        <View className='gap-5 my-4 flex-row items-center flex-wrap'>
          {userBookingData?.futureBookings?.map(
            (trip: Booking, idx: number) => (
              <MyBookingCard key={idx} {...(trip as any)} />
            )
          )}
        </View>
        <Text
          className={cn(
            "text-xl text-foreground font-semibold mt-8 pl-1",

            userBookingData.futureBookings.length === 0 && "mt-0"
          )}
        >
          Your Trip History
        </Text>
        <View className='gap-4 mt-4 mb-6'>
          {userBookingData?.allBookings?.result?.map(
            (trip: Booking, idx: number) => (
              <BookingStack key={idx} booking={trip as any} />
            )
          )}
          <Pagination
            currentPage={userBookingData.allBookings.currentPage}
            totalPages={userBookingData.allBookings.totalPages}
            goTo={(p) => setPage(p)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
