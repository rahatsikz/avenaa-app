import { addDays, format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { Minus, Plus } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { cn, currencyFormatter } from "~/lib/utils";
import { useSearchStore } from "~/store/search-store";
import { IProperty } from "~/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import DateRangePicker, {
  Availability,
  findConsecutiveAvailablePairs,
  isDateNotAvailable,
} from "../ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

function hasUnavailableInRange(
  calendar: Availability[],
  startISO: string,
  endISO: string
): boolean {
  // we’ll compare “YYYY‑MM‑DD” strings lexically
  return calendar.some((entry) => {
    const day = entry.date.slice(0, 10);
    return (
      day > startISO && day < endISO && (!entry.available || entry.units === 0)
    );
  });
}

export default function BookNowCard({
  product,
  ...props
}: { product: IProperty } & React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

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

  const discount = product.discount;
  const tax = product.tax;
  const priceWithoutDiscount = product.price;
  const priceWithDiscount = product.priceWithDiscount;

  const taxAmount = priceWithDiscount * (tax / 100);

  const calendar = useMemo(
    () => product?.availabilityCalendar ?? [],
    [product?.availabilityCalendar]
  );
  const pair = useMemo(
    () => findConsecutiveAvailablePairs(calendar),
    [calendar]
  );

  const isFromUnavailable = Boolean(
    isDateNotAvailable(calendar, format(new Date(), "yyyy-MM-dd"))
  );
  const isToUnavailable = Boolean(
    isDateNotAvailable(calendar, format(addDays(new Date(), 3), "yyyy-MM-dd"))
  );

  // check for holes between them
  const hasGap = Boolean(
    hasUnavailableInRange(
      calendar,
      format(new Date(), "yyyy-MM-dd"),
      format(addDays(new Date(), 3), "yyyy-MM-dd")
    )
  );

  useEffect(() => {
    // if either endpoint is blocked, OR there’s ANY blocked day between them…
    if ((isFromUnavailable || isToUnavailable || hasGap) && pair) {
      const [availFrom, availTo] = pair;
      const newFrom = format(parseISO(availFrom.date), "yyyy-MM-dd");
      const newTo = format(parseISO(availTo.date), "yyyy-MM-dd");

      setRange({ start: new Date(newFrom), end: new Date(newTo) });
      return;
    }

    setRange({ start: new Date(), end: addDays(new Date(), 3) });
  }, [
    isFromUnavailable,
    isToUnavailable,
    hasGap, // ← add it to deps
    pair,
    setRange,
  ]);

  return (
    <View>
      <Card
        className={cn(
          "left-0 right-0 flex h-fit  items-start justify-between gap-4 p-0 px-4 py-4 shadow-sm  ",
          props.className
        )}
      >
        <CardContent className='flex-row w-full justify-between p-0'>
          <View>
            <Badge className='bg-primary/50 px-2 py-1'>
              <Text className='text-xs text-foreground/80 font-medium'>
                Pay now to get best deals
              </Text>
            </Badge>
            <View className='mt-4 flex-row items-center gap-1'>
              <Text className='font-medium text-foreground/90'>
                {currencyFormatter(priceWithDiscount.toString())}
              </Text>
              <Text>+</Text>
              <Text className='text-sm text-muted-foreground/90'>
                {currencyFormatter(taxAmount.toString(), {
                  minimumFractionDigits: 0,
                })}
              </Text>
              <View className='flex-row items-center'>
                <Text className='text-sm text-muted-foreground/90'>taxes</Text>
                <Text className='text-xs text-muted-foreground/90'>
                  {" "}
                  /night
                </Text>
              </View>
            </View>
            <View className='mt-1 flex-row items-end gap-1 pl-0.5'>
              <Text className='text-xs text-muted-foreground line-through'>
                {currencyFormatter(priceWithoutDiscount.toString(), {
                  minimumFractionDigits: 0,
                })}
              </Text>
              <Text className='text-xs font-medium text-primary'>
                {discount}% off
              </Text>
            </View>
          </View>
        </CardContent>

        <View className='w-full'>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                className='flex-row h-20 w-full items-center justify-between py-4'
              >
                <View className='flex flex-row items-center gap-1.5'>
                  <Text className='text-xs text-foreground/90'>Check In</Text>
                  <Text className='text-xs font-semibold text-foreground/80'>
                    {range.start ? format(range.start, "dd MMM ") : "Add Date"}
                  </Text>
                </View>
                <Separator
                  orientation='vertical'
                  className='dark:bg-foreground'
                />
                <View className='flex-row items-center gap-1.5'>
                  <Text className='text-xs text-foreground/90'>Check Out</Text>
                  <Text className='text-xs font-semibold text-foreground/80'>
                    {range.end ? format(range.end, "dd MMM ") : "Add Date"}
                  </Text>
                </View>
              </Button>
            </DialogTrigger>
            <DialogContent className='w-[360px] p-0'>
              <DialogHeader className='px-6 pt-6'>
                <DialogTitle className='text-lg font-semibold'>
                  Select Dates
                </DialogTitle>
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

        <View className='flex-row w-full items-center justify-between rounded-md border border-input py-4 px-6'>
          <View className='gap-1.5'>
            <Text className='font-medium text-foreground text-sm'>Guests</Text>
            <Text className='text-xs font-medium leading-none text-muted-foreground'>
              {adults + children === 0
                ? `0${adults + children}`
                : adults + children}{" "}
              {adults + children === 1 ? "Guest" : "Guests"}
            </Text>
          </View>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"link"} className='text-primary '>
                <Text className='text-primary text-sm'> Edit</Text>
              </Button>
            </DialogTrigger>
            <DialogContent className='pt-8'>
              <DialogHeader className='mb-1 max-w-md'>
                <DialogTitle>Guests and rooms</DialogTitle>
                <DialogDescription className='text-pretty'>
                  Select the number of guests and rooms you want to book for
                  your stay
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
        <CardFooter className='w-full p-0'>
          <Button
            size={"sm"}
            disabled={range.start === null || range.end === null}
            className='w-full bg-primary px-4 xl:px-8'
            onPress={() => router.push(`/home/explore/${product.id}/payment`)}
          >
            <Text className='text-sm font-semibold text-background'>
              {product.rooms && product.rooms.length > 0
                ? "Select Room"
                : "Book Now"}
            </Text>
          </Button>
        </CardFooter>
      </Card>
      <Separator className='mt-5 ' />
    </View>
  );
}
