import { Award, MapPin } from "lucide-react-native";
import { Image, Text, View } from "react-native";
import { Patron } from "~/types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";

const HostDetail = ({ user }: { user: Patron }) => {
  return (
    <View className='mt-5'>
      <View className=' justify-between gap-6 py-0.5 pl-1.5'>
        <View className='flex-row flex-1 items-center gap-4'>
          <View className='h-11 w-11 overflow-hidden rounded-full'>
            {user?.user?.image ? (
              <Image
                source={{ uri: user?.user?.image?.secureUrl }}
                alt='hero'
                width={500}
                height={500}
                className='h-full w-full object-cover'
              />
            ) : (
              <Avatar alt='host image'>
                <AvatarFallback className='text-xs font-medium capitalize tracking-wider'>
                  <Text className='text-foreground'>
                    {user.user.name.slice(0, 1)}
                  </Text>
                </AvatarFallback>
              </Avatar>
            )}
          </View>

          <View className='flex flex-col gap-1'>
            <View className='gap-1 leading-none text-foreground/80'>
              <Text className='text-sm font-medium leading-none text-muted-foreground/80'>
                Property Owned by
              </Text>
              <Text className='block text-base font-semibold text-foreground/80 capitalize leading-none'>
                {user?.user?.name}
              </Text>
            </View>
          </View>
        </View>
        <View className='flex justify-between gap-4  ' style={{ flex: 2.5 }}>
          <View className='flex-row items-center'>
            <Award size={20} color={"#30b55d"} />
            <View className='ml-1.5'>
              <Text className='font-medium text-foreground/80'>
                Experienced host
              </Text>
              <Text className='text-sm text-muted-foreground'>
                {user?.user?.name.split(" ")[0]} has 120+ reviews for other
                places.
              </Text>
            </View>
          </View>

          <View className='flex-row items-center'>
            <MapPin size={20} color={"#30b55d"} />
            <View className='ml-1.5'>
              <Text className='font-medium text-foreground/80'>
                Great location
              </Text>
              <Text className='text-sm text-muted-foreground'>
                95% of guests gave a 5-star rating.
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Separator className='mb-6 mt-9 ' />
    </View>
  );
};

export default HostDetail;
