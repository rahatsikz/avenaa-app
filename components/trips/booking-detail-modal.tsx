import { format } from "date-fns";
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  User,
  Users,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Dialog, DialogClose, DialogContent } from "~/components/ui/dialog";
import { Booking } from "~/types";

export function BookingDetailsDialog({
  booking,
  setOpen,
  open,
}: {
  booking: Booking;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  open?: boolean;
}) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd");
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500 text-background hover:bg-yellow-500";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "DUE":
        return "bg-destructive/90 text-background hover:bg-destructive";
      case "PAID":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-[370px] rounded-lg p-0  lg:max-w-2xl [&>button]:hidden'>
        <ScrollView className=' h-fit bg-background rounded-t-3xl'>
          {/* Header */}
          <View className='pt-6 pb-2 px-5'>
            <View className='items-center mb-0 '>
              <View className='w-12 h-1 bg-gray-200 rounded-full mb-4' />
              <Text className='text-xl font-semibold text-foreground'>
                Booking Details
              </Text>
            </View>
          </View>

          <View className='px-5 pb-8'>
            {/* Property Information */}
            <View className='mb-5 mt-1.5 px-3 flex-row gap-2 items-center'>
              <View className='flex-row items-center justify-between'>
                <Text className='text-lg font-semibold text-foreground'>
                  {booking.property.title}
                </Text>
              </View>
              <View className='flex-row items-center '>
                <MapPin size={14} color='#a3a3a3' />
                <Text className='ml-1 text-sm text-muted-foreground'>
                  {booking.property.city}, {booking.property.state}
                </Text>
              </View>
            </View>

            {/* Booking Status Card */}
            <View className='bg-muted/50 rounded-xl px-6 py-5 mb-6'>
              <View className='flex-row justify-between w-10/12'>
                {/* Payment Information */}
                <View className='items-center'>
                  <CreditCard size={22} color='#a3a3a3' />
                  <View className='items-center mt-2'>
                    <Text className='text-xs text-muted-foreground'>
                      Total Amount
                    </Text>
                    <Text className='text-base font-semibold text-foreground'>
                      ₹{booking.amount.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>

                {/* Status Information */}
                <View className='flex-row gap-4 '>
                  <View className='items-center'>
                    <Text className='text-xs text-muted-foreground mb-2'>
                      Booking
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      <Text className='text-white text-xs font-medium capitalize'>
                        {booking.status.toLowerCase()}
                      </Text>
                    </View>
                  </View>

                  <View className='items-center'>
                    <Text className='text-xs text-muted-foreground mb-2'>
                      Payment
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full ${getStatusColor(
                        booking.paymentStatus
                      )}`}
                    >
                      <Text className='text-white text-xs font-medium capitalize'>
                        {booking.paymentStatus.toLowerCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Stay Details */}
            <View className='bg-muted/50 rounded-xl px-6 py-5 mb-6'>
              <Text className='text-sm font-semibold text-foreground mb-4'>
                Stay Information
              </Text>
              <View className='flex-row flex-wrap  justify-between'>
                <View className='w-[48%] mb-4 flex-row items-center'>
                  <Calendar size={18} color='#a3a3a3' />
                  <View className='ml-2'>
                    <Text className='text-xs text-muted-foreground'>
                      Check-in
                    </Text>
                    <Text className='text-sm font-medium text-foreground'>
                      {formatDate(booking.checkInDate)}
                    </Text>
                  </View>
                </View>

                <View className='w-[48%] mb-4 flex-row items-center'>
                  <Calendar size={18} color='#a3a3a3' />
                  <View className='ml-2'>
                    <Text className='text-xs text-muted-foreground'>
                      Check-out
                    </Text>
                    <Text className='text-sm font-medium text-foreground'>
                      {formatDate(booking.checkOutDate)}
                    </Text>
                  </View>
                </View>

                <View className='w-[48%] flex-row items-center'>
                  <Clock size={18} color='#a3a3a3' />
                  <View className='ml-2'>
                    <Text className='text-xs text-muted-foreground'>
                      Duration
                    </Text>
                    <Text className='text-sm font-medium text-foreground capitalize'>
                      {booking.days} {booking.days === 1 ? "night" : "nights"}
                    </Text>
                  </View>
                </View>

                <View className='w-[48%] flex-row items-center'>
                  <Users size={18} color='#a3a3a3' />
                  <View className='ml-2'>
                    <Text className='text-xs text-muted-foreground'>
                      Guests
                    </Text>
                    <Text className='text-sm font-medium text-foreground'>
                      {booking.noOfGuests}{" "}
                      {booking.noOfGuests === 1 ? "person" : "people"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Owner Information */}
            <View className='bg-muted/50 rounded-xl px-6 py-5'>
              <View className='flex-row items-center mb-3.5'>
                <User size={18} color='#4b5563' />
                <Text className='ml-1 text-sm font-semibold text-foreground'>
                  Owner Information
                </Text>
              </View>

              <View className='flex-row justify-between px-2'>
                <View>
                  <Text className='text-xs text-muted-foreground'>Name</Text>
                  <Text className='text-sm font-medium text-foreground'>
                    {booking.property.patron.user.name}
                  </Text>
                </View>

                <View>
                  <Text className='text-xs text-muted-foreground'>Phone</Text>
                  <Text className='text-sm font-medium text-foreground'>
                    {booking.property.patron.user.phone}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Button */}
            <DialogClose asChild>
              <TouchableOpacity className='mt-6 bg-primary py-3 rounded-xl items-center'>
                <Text className='text-white font-medium'>Close</Text>
              </TouchableOpacity>
            </DialogClose>
          </View>
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}
