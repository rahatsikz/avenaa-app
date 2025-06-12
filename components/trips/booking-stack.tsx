import { format } from "date-fns";
import { Pressable, Text, View } from "react-native";
import { cn } from "~/lib/utils";
import { Booking } from "~/types";

export function BookingStack({ booking }: { booking: Booking }) {
  return (
    <View className='gap-5 rounded-lg border border-input p-4'>
      <View className='flex items-start justify-between'>
        <View className='flex-row items-center gap-3'>
          <View className='flex h-12 w-12 flex-col items-center text-center'>
            <Text className='w-full rounded-t text-center bg-destructive py-0.5 text-xs font-medium text-white'>
              {format(new Date(booking.checkInDate), "MMM")}
            </Text>
            <Text className='w-full rounded-b border border-input border-t-0 py-1.5 text-center text-base font-semibold leading-none text-muted-foreground'>
              {format(new Date(booking.checkInDate), "dd")}
            </Text>
          </View>
          <View>
            <Text className='font-medium text-foreground/90'>
              {booking.property.title}
            </Text>
            <Text className='text-sm capitalize text-muted-foreground'>
              {booking.property.city}, {booking.property.state}
            </Text>
          </View>
        </View>
      </View>

      <View className='flex flex-col items-end'>
        <View className='flex flex-row w-full items-center justify-between'>
          <Text
            className={`inline-block rounded-md bg-secondary px-3 py-1 text-sm text-foreground/80 font-semibold`}
          >
            {booking?.status?.slice(0, 1).toUpperCase() +
              booking?.status?.slice(1).toLowerCase()}
          </Text>
          <Text className='text-sm text-muted-foreground'>
            {format(new Date(booking.checkInDate), "dd MMM yyyy")} -{" "}
            {format(new Date(booking.checkOutDate), "dd MMM yyyy")}
          </Text>
        </View>

        <Pressable className={``}>
          {/* {booking.status === "APPROVED" && "Write a review"} */}
          <Text
            className={cn(
              "text-sm font-medium",
              booking.status === "CANCELLED" ? "text-red-500" : "text-green-500"
            )}
          >
            {booking.status === "APPROVED" &&
              (booking.review ? "Review Given" : "Write a review")}
            {booking.status === "PENDING" && "Booking Processing"}
            {booking.status === "CANCELLED" && "Refund Processing"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
