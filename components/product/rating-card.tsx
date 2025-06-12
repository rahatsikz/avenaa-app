import { ChevronLeft, ChevronRight, Star } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { cn } from "~/lib/utils";
import { IProperty } from "~/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type RatingBarProps = {
  star: number;
  rating: number;
  totalRating: number;
};

const dummyReviews = [
  {
    review:
      "Very Good ambience, Excellent and cooperative staff. I liked the following services Evening Dance room. Games room- table tennis (complementary) Live and hot food serving. Breakfast buffet. Thanks. It's nearby to Mall road (1.5) Night Club (2 km)",
    rating: 4,
    name: "Vikram Rathod",
    location: "Bangalore, India",
  },
  {
    review:
      "Amazing experience, friendly staff, and top-notch facilities. Enjoyed the pool and spa services. The complimentary drinks and snacks were a great touch. Rooms were clean and comfortable. Conveniently close to Central Park (2 km) and Shopping Mall (1 km).",
    rating: 5,
    name: "Lalan Kumar",
    location: "Mumbai, India",
  },
];

export function RatingCard({
  product,
  ...props
}: { product: IProperty } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <View className='mt-5 pt-5 relative'>
      <Text className='pl-1 text-xl font-semibold leading-none text-foreground/80'>
        {product?.title}&apos;s Reviews
      </Text>
      <View className={cn("mt-5 flex flex-col gap-4 ")}>
        <ReviewSlider />
      </View>
    </View>
  );
}

export const ReviewSlider = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const handleNext = () => {
    if (currentIndex < dummyReviews.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const { width } = useWindowDimensions();

  return (
    <View className=' w-full rounded-lg border border-amber-400 '>
      <FlatList
        ref={flatListRef}
        data={dummyReviews}
        horizontal
        pagingEnabled
        scrollEnabled={false} // disable swipe, control manually
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className='h-[346px] ' style={{ width }}>
            <ReviewCard data={item} />
          </View>
        )}
      />

      <View className='absolute -top-12 right-2 flex-row items-center gap-3 '>
        {/* Prev Button */}
        <TouchableOpacity
          onPress={handlePrev}
          className={cn(
            "p-2 h-8 w-8 rounded-full bg-secondary flex items-center justify-center z-10",
            currentIndex === 0 ? "opacity-50" : "opacity-100"
          )}
          disabled={currentIndex === 0}
        >
          <Text className='text-[#FF7A00]'>
            <ChevronLeft size={24} color='#FF7A00' />
          </Text>
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className={cn(
            "h-8 w-8 p-2 rounded-full bg-secondary flex justify-center items-center z-10",
            currentIndex === dummyReviews.length - 1
              ? "opacity-50"
              : "opacity-100"
          )}
          disabled={currentIndex === dummyReviews.length - 1}
        >
          <Text className='text-[#FF7A00]'>
            <ChevronRight size={24} color='#FF7A00' />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ReviewCard = ({ data }: { data: any }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{ width: width - 30 }}
      className='flex h-full   flex-col items-center justify-center gap-5 rounded-xl py-6 '
    >
      <View className='flex-row items-center gap-1 '>
        {Array.from({ length: data.rating }).map((_, idx) => (
          <Star
            fill={"#f59e0b"}
            color={"#f59e0b"}
            height={30}
            width={30}
            key={idx}
          />
        ))}
      </View>
      <Text
        style={{ width: width - 30 }}
        className=' px-6 mr-auto text-sm font-medium leading-6 text-foreground/80'
      >
        {data.review}
      </Text>
      <View className='flex-row items-center gap-2.5 '>
        <Avatar alt='user image'>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback className='bg-amber-500'>
            <Text className='text-white'>
              {" "}
              {data.name.slice(0, 2).toUpperCase()}{" "}
            </Text>
          </AvatarFallback>
        </Avatar>
        <View className='gap-1 items-center'>
          <Text className='font-semibold leading-none text-foreground/80'>
            {data.name}
          </Text>
          <Text className='pl-0.5 text-xs leading-none text-foreground/70'>
            {data.location}
          </Text>
        </View>
      </View>
    </View>
  );
};
