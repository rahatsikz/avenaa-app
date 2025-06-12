import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Heart, StarIcon } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";
import { useAddToWishlist } from "~/api/property.query";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/store/user-store";
import { AmenityGroup, IProperty } from "~/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "./toast";
export default function PropertyCard({
  property,
  wishlistData,
}: {
  property: IProperty;
  wishlistData?: IProperty[];
}) {
  const discount = property?.discount;
  const tax = property?.tax;
  const priceWithoutDiscount = property.price;
  const priceWithDiscount = property.priceWithDiscount;

  const taxAmount = priceWithDiscount * (tax / 100);

  const getTopAmenities = (amenityGroups: AmenityGroup[]) => {
    const topAmenitiesGroup = amenityGroups.find(
      (group) => group.title === "Top Amenities"
    );
    return topAmenitiesGroup?.amenities ?? [];
  };

  const { user } = useUserStore((state) => state);

  const isFavourite = wishlistData?.find(
    (item: IProperty) => item.id === property.id
  );

  const queryClient = useQueryClient();
  const { mutate } = useAddToWishlist();

  const handleWishlist = () => {
    mutate(
      {
        userId: user?.id as string,
        propertyId: property.id,
        isFavourite: true, // Toggle the isFavourite value
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["property"] });
          queryClient.invalidateQueries({ queryKey: ["wishlist"] });
          toast.success("Property added to wishlist");
        },
        onError: () => {
          toast.error("Failed to add property to wishlist");
        },
      }
    );
  };
  return (
    <Pressable
      onPress={() => router.push(`/home/explore/${property.id}` as any)}
    >
      <Card className='min-w-full overflow-hidden rounded-2xl border-border bg-muted/50'>
        <View className=''>
          <View className='relative '>
            <Image
              source={{
                uri: property.thumbnail.secureUrl,
              }}
              alt='Property interior'
              // height={261}
              // width={372}
              className='h-[200px] rounded-t-md object-cover w-full '
            />
            <Button
              size='icon'
              variant='ghost'
              className='absolute native:text-xs right-4 top-4 h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm'
              onPress={(e: any) => {
                e.stopPropagation(); // Stop the event from bubbling up
                e.preventDefault(); // Prevent the default link behavior
                handleWishlist();
              }}
            >
              <Heart
                size={12}
                strokeWidth={isFavourite ? 0 : 1.5}
                className={` ${isFavourite ? "text-destructive" : ""}`}
                fill={isFavourite ? "red" : "none"}
              />
            </Button>
            <View className='absolute flex-row gap-1 bottom-2 left-1/2 flex -translate-x-1/2 '>
              <View className='h-1.5 w-1.5 rounded-full bg-white'></View>
              <View className='h-1.5 w-1.5 rounded-full bg-white/50'></View>
              <View className='h-1.5 w-1.5 rounded-full bg-white/50'></View>
            </View>
          </View>

          <View className='flex flex-col gap-1 px-4 pt-5 pb-6'>
            <View className='flex-row justify-between'>
              <View className=' items-start gap-1.5'>
                <Text className='text-sm font-medium leading-none text-foreground'>
                  {property.title.length > 30
                    ? `${property.title.slice(0, 30)}...`
                    : property.title}
                </Text>
                <View className='flex-row'>
                  <Text className='text-xs capitalize leading-none text-muted-foreground'>
                    {property.city}
                  </Text>
                  <Text className='text-xs capitalize leading-none text-muted-foreground'>
                    , {property.state}
                  </Text>
                </View>
              </View>

              <View className=' items-start gap-0.5 pl-[0.5px]'>
                <View className='flex flex-row items-center gap-1 rounded-sm px-[2px] '>
                  <StarIcon
                    size={10}
                    className='h-3 w-3 '
                    strokeWidth={0}
                    fill='#30b55d'
                  />

                  <Text className='font-medium  text-sm text-primary'>5.0</Text>
                </View>
                <Text className='text-xs text-muted-foreground'>
                  250+ Rating
                </Text>
              </View>
            </View>
            <View
              className={cn(
                "mt-2.5 flex flex-row items-center gap-2.5",

                getTopAmenities(property.amenityGroup ?? []).length > 0
                  ? ""
                  : "hidden"
              )}
            >
              <View className='flex flex-row items-start gap-2 '>
                {getTopAmenities(property.amenityGroup ?? [])
                  .slice(0, 2)
                  .map((amenity) => {
                    return (
                      <Badge
                        key={amenity.id}
                        className='px-2.5 border-border bg-transparent py-0.5'
                      >
                        <Text className='text-xs text-muted-foreground'>
                          {amenity.label}
                        </Text>
                      </Badge>
                    );
                  })}
              </View>
              <View className=' whitespace-nowrap '>
                <Text
                  className='text-muted-foreground'
                  style={{ fontSize: 10 }}
                >
                  +{" "}
                  {getTopAmenities(property.amenityGroup ?? []) &&
                    getTopAmenities(property.amenityGroup ?? []).length -
                      2}{" "}
                  Amenities
                </Text>
              </View>
            </View>
            <View className='mt-4 flex items-center flex-row gap-1 pl-1'>
              <Text className='text-xs font-medium text-foreground'>
                ₹ {priceWithDiscount}
              </Text>

              <Text className='text-xs text-foreground'>
                + ₹{taxAmount.toFixed(0)} taxes & fees
              </Text>

              <Text className='text-xs text-muted-foreground'>/night </Text>
            </View>
            <View className='mt-px gap-1.5 items-center pl-1 flex-row'>
              <Text className='text-xs font-medium text-gray-400 line-through'>
                ₹ {priceWithoutDiscount}
              </Text>
              <Text className='text-xs font-medium text-[#22943F]'>
                {discount}% off
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export function PropertyCardSkeleton() {
  return (
    <Card className='min-w-full overflow-hidden rounded-2xl border-border bg-muted/50 animate-pulse'>
      {/* Image placeholder */}
      <View className='relative'>
        <View className='h-[200px] w-full bg-gray-300 dark:bg-gray-800' />
        {/* Wishlist Icon Placeholder */}
        <View className='absolute right-4 top-4 h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700' />
        {/* Pagination dots placeholder */}
        <View className='absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-row '>
          <View className='h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700' />
          <View className='h-1.5 w-1.5 rounded-full bg-gray-200/50 dark:bg-gray-700/50' />
          <View className='h-1.5 w-1.5 rounded-full bg-gray-200/50 dark:bg-gray-700/50' />
        </View>
      </View>

      {/* Text & data placeholders */}
      <View className='flex flex-col gap-1 px-4 pt-5 pb-6'>
        {/* Title placeholder */}
        <View className='h-5 w-3/4 bg-gray-300 dark:bg-gray-800 rounded' />

        {/* Location placeholders */}
        <View className='mt-2 flex flex-row '>
          <View className='h-4 w-1/3 bg-gray-300 dark:bg-gray-800 rounded' />
          <View className='h-4 w-1/4 bg-gray-300 dark:bg-gray-800 rounded' />
        </View>

        {/* Rating placeholder */}
        <View className='mt-2 flex flex-row items-center gap-1'>
          <View className='h-4 w-4 bg-gray-300 dark:bg-gray-800 rounded-full' />
          <View className='h-4 w-10 bg-gray-300 dark:bg-gray-800 rounded' />
        </View>
        <View className='h-3 w-1/4 bg-gray-300 dark:bg-gray-800 rounded' />

        {/* Amenities badges placeholder (2 badges + “+X” text) */}
        <View className='mt-2 flex flex-row items-center gap-2'>
          <View className='h-6 w-16 bg-gray-300 dark:bg-gray-800 rounded' />
          <View className='h-6 w-16 bg-gray-300 dark:bg-gray-800 rounded' />
          <View className='h-4 w-10 bg-gray-300 dark:bg-gray-800 rounded' />
        </View>

        {/* Price placeholder */}
        <View className='mt-4 flex flex-row items-center '>
          <View className='h-5 w-20 bg-gray-300 dark:bg-gray-800 rounded' />
          <View className='h-5 w-28 bg-gray-300 dark:bg-gray-800 rounded' />
        </View>

        {/* Discount placeholder */}
        <View className='mt-1 flex flex-row items-center '>
          <View className='h-4 w-16 bg-gray-300 dark:bg-gray-800 rounded' />
          <View className='h-4 w-12 bg-gray-300 dark:bg-gray-800 rounded' />
        </View>
      </View>
    </Card>
  );
}
