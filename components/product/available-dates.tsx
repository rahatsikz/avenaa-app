import { useState } from "react";
import { Text, View } from "react-native";
import { IProperty } from "~/types";
import { AvenaCalendar } from "../ui/avena-calendar";
import { Range } from "../ui/date-range-picker";
import { Separator } from "../ui/separator";

export default function AvailableDates({
  product,
  ...props
}: { product: IProperty } & React.HTMLAttributes<HTMLDivElement>) {
  const [range, setRange] = useState<Range>({ start: null, end: null });

  const handleRangeChange = (r: Range) => {
    setRange(r);
  };
  return (
    <View className='mt-3.5'>
      <Text className='mb-5 pl-1.5 text-xl font-semibold leading-none text-foreground/80'>
        Available Dates
      </Text>
      <View className='mx-1'>
        <AvenaCalendar
          range={range}
          onRangeChange={handleRangeChange}
          monthOffset={0}
          availability={product.availabilityCalendar ?? []}
          notClickable={true}
        />
      </View>

      <Separator className='mt-7' />
    </View>
  );
}
