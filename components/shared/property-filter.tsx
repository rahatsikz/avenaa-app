import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Minus, Plus, Search } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { useSearchStore } from "~/store/search-store";
import { Button } from "../ui/button";
import DateRangePicker, { Range } from "../ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SearchPopover } from "./search-popover";

type FilterMode = "destination" | "date" | "guest";

export default function PropertyFilter() {
  const { width } = useWindowDimensions();

  // GLOBAL store setters
  const {
    setAdults: commitAdults,
    setChildren: commitChildren,
    setRooms: commitRooms,
    setRange: commitRange,
    setDestination: commitDestination,
    setSearchEnable: commitSearchEnable,
    range,
    adults,
    children,
    rooms,
  } = useSearchStore((state) => state);

  // LOCAL buffers
  const [openFilter, setOpenFilter] = useState<FilterMode>("destination");
  const [localAdults, setLocalAdults] = useState(adults);
  const [localChildren, setLocalChildren] = useState(children);
  const [localRooms, setLocalRooms] = useState(rooms);
  const [localRange, setLocalRange] = useState<Range>({
    start: range.start,
    end: range.end,
  });
  const form = useForm<{ destination: string }>({
    defaultValues: { destination: "" },
  });

  // Dialog open state
  const [open, setOpen] = useState(false);

  const onSearch = () => {
    // write buffered values back to the store
    commitDestination(form.getValues("destination"));
    commitRange(localRange);
    commitAdults(localAdults);
    commitChildren(localChildren);
    commitRooms(localRooms);

    commitSearchEnable(true);

    setOpen(false);
  };

  return (
    <Dialog className='p-0 pb-4' open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pressable className='mx-6 mt-2 rounded-full overflow-hidden shadow-lg active:scale-95'>
          <LinearGradient
            // Merge your Tailwind classes with gradient colors
            colors={["#30b55d", "#139162"]}
            start={[0, 0]}
            end={[1, 1]}
            className='px-6 py-3'
          >
            <View className='flex-row items-center justify-center gap-2 '>
              <Search size={20} color='#FFF' className='' />
              <Text className='text-white font-semibold text-lg'>
                Find Your Dream Property
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
      </DialogTrigger>
      <DialogContent
        className={cn("p-0 max-w-2xl h-[70vh]")}
        style={{ width: width - 32 }}
      >
        <DialogHeader className='mt-4 px-6'>
          <DialogTitle>Search Property</DialogTitle>
        </DialogHeader>

        <ScrollView>
          {/* destination */}
          <Button
            className={cn("mx-6 mt-4", openFilter === "destination" && "mb-4")}
            variant={"secondary"}
            onPress={() => setOpenFilter("destination")}
          >
            <Text className='text-foreground '>Select Desired Destination</Text>
          </Button>
          <View
            className={cn("px-6", openFilter !== "destination" && "hidden")}
          >
            <SearchPopover
              placeholder='Destination'
              name='destination'
              control={form.control}
            />
          </View>
          {/* date */}
          <Button
            className={cn("mx-6 mt-4", openFilter === "date" && "mb-4")}
            variant={"secondary"}
            onPress={() => setOpenFilter("date")}
          >
            <Text className='text-foreground '>
              Select Check in and Check out date
            </Text>
          </Button>
          <View className={cn("px-6", openFilter !== "date" && "hidden")}>
            <DateRangePicker
              className='p-0'
              range={localRange}
              setRange={setLocalRange}
            />
          </View>
          {/* guest */}
          <Button
            className={cn("mx-6 mt-4", openFilter === "guest" && "mb-4")}
            variant={"secondary"}
            onPress={() => setOpenFilter("guest")}
          >
            <Text className='text-foreground '>
              Select the number of guests and rooms
            </Text>
          </Button>
          <View
            className={cn(
              "gap-6 overflow-y-auto rounded-lg border border-input px-6 pb-6 pt-4 mx-6",
              openFilter !== "guest" && "hidden"
            )}
          >
            <View className='gap-6'>
              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center gap-1'>
                  <Text className='font-medium text-foreground/90'>Rooms</Text>
                  <Text className='text-xs text-muted-foreground'>(max 8)</Text>
                </View>
                <View
                  className='flex-row w-24 items-center justify-between rounded-xl border
                    border-input bg-background p-2'
                >
                  <Button
                    variant='ghost'
                    size='icon'
                    onPress={() => setLocalRooms(Math.max(1, localRooms - 1))}
                    className='h-6 w-6 rounded-full'
                    disabled={Number(localRooms) <= 0}
                  >
                    <Minus size={12} color={"#30b55d"} />
                  </Button>
                  <Text className='text-center text-sm text-foreground'>
                    {localRooms}
                  </Text>
                  <Button
                    variant='ghost'
                    size='icon'
                    onPress={() => setLocalRooms(Math.min(8, localRooms + 1))}
                    className='h-6 w-6 rounded-full'
                    disabled={Number(localRooms) >= 8}
                  >
                    <Plus size={12} color={"#30b55d"} />
                  </Button>
                </View>
              </View>

              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center gap-1'>
                  <Text className='font-medium text-foreground/90'>Adults</Text>
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
                    onPress={() => setLocalAdults(Math.max(1, localAdults - 1))}
                    className='h-6 w-6 rounded-full'
                    disabled={Number(localAdults) <= 0}
                  >
                    <Minus size={12} color={"#30b55d"} />
                  </Button>
                  <Text className='text-center text-sm text-foreground'>
                    {localAdults}
                  </Text>
                  <Button
                    variant='ghost'
                    size='icon'
                    onPress={() => setLocalAdults(localAdults + 1)}
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
                    onPress={() =>
                      setLocalChildren(Math.max(0, localChildren - 1))
                    }
                    className='h-6 w-6 rounded-full'
                    disabled={Number(localChildren) <= 0}
                  >
                    <Minus size={12} color={"#30b55d"} />
                  </Button>
                  <Text className='text-center text-sm text-foreground'>
                    {localChildren}
                  </Text>
                  <Button
                    variant='ghost'
                    size='icon'
                    onPress={() => setLocalChildren(localChildren + 1)}
                    className='h-6 w-6 rounded-full'
                  >
                    <Plus size={12} color={"#30b55d"} />
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <Button className='mx-5 my-4' onPress={onSearch}>
          <Text className='text-background font-medium'>Search</Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
