import { format } from "date-fns";
import { router } from "expo-router";
import { CircleAlert, MoreVertical } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { cn, currencyFormatter } from "~/lib/utils";
import { Booking } from "~/types";
import { BookingDetailsDialog } from "./booking-detail-modal";

export function MyBookingCard(data: Booking) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDropdownOpen(false);
    setTimeout(() => {
      setDialogOpen(true);
    }, 10);
  };

  const bookingStatus =
    data?.status?.slice(0, 1).toUpperCase() +
    data?.status?.slice(1).toLowerCase();

  const paymentStatus = data?.paymentStatus;

  return (
    <Card className='w-full overflow-hidden rounded-xl border border-secondary'>
      {/* <CardHeader className="flex flex-row items-center justify-end border-b p-4"></CardHeader> */}

      <CardContent className='p-0'>
        <View className='relative  w-full'>
          <Image
            source={{ uri: data.property.thumbnail.secureUrl }}
            alt='Resort interior'
            style={{ width: "100%", height: 200, resizeMode: "cover" }}
          />
          <Text
            className={cn(
              "absolute left-3 top-3.5 rounded-md bg-background px-3.5 py-1 text-xs font-medium text-primary",
              data.status === "CANCELLED" && "bg-destructive text-white"
            )}
          >
            Booking {bookingStatus}
          </Text>

          <DropdownMenu className='absolute right-4 top-4'>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='icon' className='h-8 w-7'>
                <MoreVertical size={16} color={"#a3a3a3"} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                asChild
                className={cn(data.status === "CANCELLED" && "hidden")}
              >
                <Pressable
                  onPress={() =>
                    router.push(
                      `/home/trips/${data.id}/cancel-trip
                  ` as any
                    )
                  }
                >
                  <Text className='text-foreground'>Cancel Booking</Text>
                </Pressable>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Text className='text-foreground'>
                  Contact Customer Service
                </Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Text className='text-foreground'>Update Dates</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={handleOpenDialog}>
                <Text className='text-foreground'>View Booking Details</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <BookingDetailsDialog
            booking={data}
            open={dialogOpen}
            setOpen={setDialogOpen}
          />
        </View>

        <View className='flex flex-col gap-2.5 pt-5'>
          <View className='flex-row items-center gap-3.5 px-6 '>
            <View className='flex h-12 w-12 flex-col items-center text-center'>
              <Text className='w-full text-center rounded-t text-white bg-destructive py-0.5 text-xs font-medium '>
                {format(new Date(data.checkInDate), "MMM")}
              </Text>
              <Text className='w-full rounded-b border border-border border-t-0 py-1.5 text-center text-base font-semibold leading-none text-muted-foreground'>
                {format(new Date(data.checkInDate), "dd")}
              </Text>
            </View>
            <View className='flex w-full flex-col gap-1.5 '>
              <View>
                <Text className='whitespace-nowrap text-lg font-semibold text-foreground leading-4'>
                  {data.property.title}
                </Text>
                <Text className='mt-1 text-sm text-muted-foreground'>
                  {format(new Date(data.checkInDate), "dd MMM yyyy")} -{" "}
                  {format(new Date(data.checkOutDate), "dd MMM yyyy")}
                </Text>
              </View>
              {/* <Button
                variant="ghost"
                className="h-fit w-fit p-0 leading-none text-blue-500 hover:bg-transparent"
              >
                Add to calendar
              </Button> */}
            </View>
          </View>
          <View className='px-4 '>
            <Separator className='my-3' />
          </View>
          <View className='gap-3 px-4 '>
            <View className='gap-2.5'>
              {/* add flex later (flex  items-center gap-1.5) */}
              <View className=''>
                <Text className='text-sm mb-1 whitespace-nowrap font-semibold leading-none text-foreground'>
                  Hosted by
                </Text>
                {/* remove block later */}
                <Text className=' truncate font-medium text-primary'>
                  {data?.property.patron.user.name}
                </Text>
              </View>

              <View className=''>
                <Text className='mb-1 text-foreground text-sm whitespace-nowrap font-semibold leading-none'>
                  Address
                </Text>
                <Text className='line-clamp-3 text-sm text-muted-foreground'>
                  {data?.property.address}
                </Text>
              </View>
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-fit p-0 text-muted-foreground hover:bg-transparent"
              >
                <MessageCircleMore className="h-4 w-4" />
                Message property owner
              </Button> */}
            </View>
          </View>

          <View className='flex-row  items-center justify-between bg-secondary px-6 py-5'>
            <View
              className={cn(
                data.status === "CANCELLED" && "hidden",
                "space-y-1"
              )}
            >
              <View className='flex-row items-center gap-2'>
                <Text className='text-lg font-medium text-foreground leading-none'>
                  {currencyFormatter(
                    isNaN(data?.amount)
                      ? (0).toString()
                      : data?.amount?.toString()
                  )}
                </Text>
                {paymentStatus === "DUE" && (
                  <View className='flex-row items-center gap-1.5'>
                    <Text className='text-sm text-muted-foreground'>
                      have to pay
                    </Text>
                    <CircleAlert color={"#f59e0b"} size={18} />
                  </View>
                )}
              </View>
            </View>
            <View className={cn(data.status === "CANCELLED" && "hidden")}>
              {paymentStatus === "PAID" ? (
                <Button
                  size={"sm"}
                  className='pointer-events-none bg-green-500 px-8 hover:bg-green-600'
                >
                  <Text className='text-white font-medium'>Paid</Text>
                </Button>
              ) : (
                <Button
                  size={"sm"}
                  className='bg-green-500 px-4  hover:bg-green-600'
                  onPress={() => {}}
                >
                  <Text className='text-white font-medium'>Pay Now</Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
