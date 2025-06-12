import { format } from "date-fns";
import { Minus, Plus } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSearchStore } from "~/store/search-store";
import { IProperty } from "~/types";
import { Button } from "../ui/button";
import DateRangePicker from "../ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function PaymentDetailsDialog({ product }: { product: IProperty }) {
  const {
    adults,
    children,
    rooms,
    range,
    setRange,
    setAdults,
    setChildren,
    setRooms,
  } = useSearchStore((state) => state);

  const [dateOpen, setDateOpen] = useState(false);
  const guestCount = Number(adults) + Number(children);

  const handleClose = (open: boolean) => {
    if (!open && range.start && range.end) {
      setDateOpen(false);
    }
  };

  return (
    <View className='mt-4 flex w-full items-center gap-4 max-lg:flex-col lg:gap-6'>
      <View className='flex-row w-full items-center justify-between rounded-md border p-6 border-border'>
        <View className='gap-1'>
          <Text className='font-semibold text-foreground/80'>Dates</Text>
          <Text className='text-sm font-medium leading-none text-muted-foreground'>
            {range.start && format(range.start, "dd MMM")} -{" "}
            {range.end && format(range.end, "dd MMM")}
          </Text>
        </View>
        <Dialog open={dateOpen} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button variant={"link"} onPress={() => setDateOpen(true)}>
              <Text className='text-sm font-medium text-primary'>Edit</Text>
            </Button>
          </DialogTrigger>
          <DialogContent className='w-[360px] p-0'>
            <DialogHeader className='px-6 pt-6'>
              <DialogTitle>Check in and check out dates</DialogTitle>
              <DialogDescription className='text-pretty'>
                Select your check in and check out dates for your stay in this
                property
              </DialogDescription>
            </DialogHeader>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator
              className='h-[481px] px-6 mb-6'
            >
              <View>
                <DateRangePicker
                  className='m-0 w-full p-0 py-0'
                  availabilityCalendar={product?.availabilityCalendar}
                  range={range}
                  setRange={setRange}
                />
              </View>
            </ScrollView>
          </DialogContent>
        </Dialog>
      </View>
      <View className='flex-row w-full items-center justify-between rounded-md border-border border p-6'>
        <View className='gap-1'>
          <Text className='font-semibold text-foreground/80'>Guests</Text>
          <Text className='text-sm font-medium leading-none text-muted-foreground'>
            {guestCount === 0 ? `0${guestCount}` : guestCount}{" "}
            {guestCount === 1 ? "Guest" : "Guests"}
          </Text>
        </View>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"link"}>
              <Text className='text-sm font-medium text-primary'>Edit</Text>
            </Button>
          </DialogTrigger>
          <DialogContent className='pt-8'>
            <DialogHeader className='mb-1 max-w-md'>
              <DialogTitle>Guests and rooms</DialogTitle>
              <DialogDescription className='text-pretty'>
                Select the number of guests and rooms you want to book for your
                stay
              </DialogDescription>
            </DialogHeader>
            <View
              className='gap-6 overflow-y-auto rounded-lg border
                border-input px-6 pb-6 pt-4 '
            >
              <View className='gap-6'>
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center gap-1'>
                    <Text className='font-medium text-foreground/90'>
                      Rooms
                    </Text>
                    <Text className='text-xs text-muted-foreground'>
                      (max 8)
                    </Text>
                  </View>
                  <View
                    className='flex-row w-24 items-center justify-between rounded-xl border
                      border-input bg-background p-2'
                  >
                    <Button
                      variant='ghost'
                      size='icon'
                      onPress={() => setRooms(Math.max(1, rooms - 1))}
                      className='h-6 w-6 rounded-full'
                      disabled={Number(rooms) <= 0}
                    >
                      <Minus size={12} color={"#30b55d"} />
                    </Button>
                    <Text className='text-center text-sm text-foreground'>
                      {rooms}
                    </Text>
                    <Button
                      variant='ghost'
                      size='icon'
                      onPress={() => setRooms(Math.min(8, rooms + 1))}
                      className='h-6 w-6 rounded-full'
                      disabled={Number(rooms) >= 8}
                    >
                      <Plus size={12} color={"#30b55d"} />
                    </Button>
                  </View>
                </View>

                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center gap-1'>
                    <Text className='font-medium text-foreground/90'>
                      Adults
                    </Text>
                    <Text className='text-xs text-muted-foreground'>
                      (12+ yr)
                    </Text>
                  </View>
                  <View
                    className='flex-row w-24 items-center justify-between rounded-xl border
                      border-input bg-background p-2'
                  >
                    <Button
                      variant='ghost'
                      size='icon'
                      onPress={() => setAdults(Math.max(1, adults - 1))}
                      className='h-6 w-6 rounded-full'
                      disabled={Number(adults) <= 0}
                    >
                      <Minus size={12} color={"#30b55d"} />
                    </Button>
                    <Text className='text-center text-sm text-foreground'>
                      {adults}
                    </Text>
                    <Button
                      variant='ghost'
                      size='icon'
                      onPress={() => setAdults(adults + 1)}
                      className='h-6 w-6 rounded-full'
                    >
                      <Plus size={12} color={"#30b55d"} />
                    </Button>
                  </View>
                </View>
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center gap-1'>
                    <Text className='font-medium text-foreground/90'>
                      Children
                    </Text>
                    <Text className='text-xs text-muted-foreground'>
                      (0-12 yr)
                    </Text>
                  </View>
                  <View className='flex-row w-24 items-center justify-between rounded-xl border border-input bg-background p-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onPress={() => setChildren(Math.max(0, children - 1))}
                      className='h-6 w-6 rounded-full'
                      disabled={Number(children) <= 0}
                    >
                      <Minus size={12} color={"#30b55d"} />
                    </Button>
                    <Text className='text-center text-sm text-foreground'>
                      {children}
                    </Text>
                    <Button
                      variant='ghost'
                      size='icon'
                      onPress={() => setChildren(children + 1)}
                      className='h-6 w-6 rounded-full'
                    >
                      <Plus size={12} color={"#30b55d"} />
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    </View>
  );
}
