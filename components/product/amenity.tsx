import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { cn } from "~/lib/utils";
import { AmenityGroup } from "~/types";
import { Separator } from "../ui/separator";

export function Amenities({
  amenityList,
  ...props
}: { amenityList: AmenityGroup[] } & React.HTMLAttributes<HTMLDivElement>) {
  const getAmenitiesByTitle = (title: string) => {
    const aminities = amenityList?.find((item) => item.title === title);
    if (aminities) return aminities.amenities;
    return [];
  };

  return (
    <View>
      <Separator className='mb-8 mt-0 w-full' />
      <View>
        <Text className='pl-1 text-xl font-semibold capitalize leading-none text-foreground/80'>
          What this place offers
        </Text>

        <View className='rounded-lg mx-1.5 overflow-hidden mt-5 mb-5'>
          <LinearGradient
            // bottom-to-top: opaque black → transparent
            colors={["#0F401C", "#22943F"]}
            start={[0, 1]}
            end={[0, 0]}
            className={cn("px-4 py-3")}
          >
            <Text className={cn("text-sm text-center font-medium text-white")}>
              Top Amenities
            </Text>
          </LinearGradient>
        </View>
        <View className='flex-row flex-wrap items-center gap-3 pl-1'>
          {getAmenitiesByTitle("Top Amenities")
            ?.slice(0, 5)
            ?.map((amenity, idx) => {
              return (
                <View
                  key={amenity.id}
                  className='flex-row items-center gap-2.5 text-foreground/60'
                >
                  <Text className='text-sm font-medium leading-none  text-foreground/80'>
                    {amenity.label}
                  </Text>
                  {idx < 4 ? (
                    <Separator
                      orientation='vertical'
                      className='h-2 w-2 rounded-full bg-foreground/60'
                    />
                  ) : null}
                </View>
              );
            })}
        </View>
        <Separator className='mb-9 mt-7' />
        <View className='flex-row flex-wrap items-start  gap-y-3.5 pl-1'>
          {amenityList
            ?.filter((group) => group.title !== "Top Amenities")
            ?.map((group) => {
              const amenities = getAmenitiesByTitle(group.title);
              return (
                <View key={group.id} className='w-1/2'>
                  <Text className='whitespace-nowrap text-base font-semibold text-foreground/80'>
                    {group.title}
                  </Text>
                  <View className='mt-2 gap-1.5'>
                    {amenities?.map((amenity) => (
                      <Text
                        key={amenity.id}
                        className='text-sm font-medium text-muted-foreground/90'
                      >
                        {amenity.label}
                      </Text>
                    ))}
                  </View>
                </View>
              );
            })}
        </View>
      </View>

      <Separator className='mb-3 mt-8 w-full' />
    </View>
  );
}
