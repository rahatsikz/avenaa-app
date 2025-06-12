import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { cn } from "~/lib/utils";
import { IProperty } from "~/types";
import { Separator } from "../ui/separator";

export function SpacesCarousel({ product }: { product: IProperty }) {
  const { width } = useWindowDimensions();
  const pagerRef = useRef<PagerView>(null);
  const [active, setActive] = useState(0);
  const slides = product.spaces || [];

  // auto-sync index if you ever need auto-advance:
  // useEffect(() => {
  //   const t = setInterval(() => {
  //     const next = active + 1 >= slides.length ? 0 : active + 1;
  //     pagerRef.current?.setPage(next);
  //     setActive(next);
  //   }, 4000);
  //   return () => clearInterval(t);
  // }, [active, slides.length]);

  const onPageSelected = (e: any) => {
    setActive(e.nativeEvent.position);
  };

  const goPrev = () => {
    const prev = active === 0 ? slides.length - 1 : active - 1;
    pagerRef.current?.setPage(prev);
    setActive(prev);
  };
  const goNext = () => {
    const next = active === slides.length - 1 ? 0 : active + 1;
    pagerRef.current?.setPage(next);
    setActive(next);
  };

  if (slides.length === 0) return null;

  return (
    <View className='w-full py-4 relative'>
      <Text className='pl-2 text-xl font-semibold text-foreground/80 mb-4'>
        Spaces
      </Text>

      <PagerView
        ref={pagerRef}
        style={{ width, height: 300 }}
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        {slides.map((item, i) => (
          <View
            key={item.id}
            className='rounded-xl overflow-hidden border border-border'
            style={{ width: width - 32, height: 300 }}
          >
            <View className=' bg-gray-200  shadow-sm'>
              <Image
                source={{ uri: item.image.secureUrl || undefined }}
                style={{ width: "100%", height: 200 }}
                resizeMode='cover'
              />
              <LinearGradient
                // bottom-to-top: opaque black → transparent
                colors={["rgba(0,0,0,0.9)", "transparent"]}
                start={[0, 1]}
                end={[0, 0]}
                className={cn("absolute bottom-0 left-0 right-0 p-4")}
              >
                <Text className={cn("text-xl font-bold text-white")}>
                  {item.title}
                </Text>
              </LinearGradient>
            </View>
            <View className='mt-3 space-y-1 px-3 pb-3.5'>
              {item.description.map((desc: string, i: number) => (
                <View key={i} className='flex-row items-start'>
                  <Text className='text-primary mr-2'>•</Text>
                  <Text className='flex-1 text-sm text-foreground'>{desc}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </PagerView>

      {/* Prev/Next Buttons */}
      <View className='absolute top-2 right-1 flex-row gap-3'>
        <Pressable
          onPress={goPrev}
          disabled={slides.length <= 1}
          className={cn(
            "p-2 rounded-full bg-secondary/80",
            slides.length <= 1 && "opacity-50"
          )}
        >
          <ChevronLeft size={20} color='#a3a3a3' />
        </Pressable>
        <Pressable
          onPress={goNext}
          disabled={slides.length <= 1}
          className={cn(
            "p-2 rounded-full bg-secondary/80",
            slides.length <= 1 && "opacity-50"
          )}
        >
          <ChevronRight size={20} color='#a3a3a3' />
        </Pressable>
      </View>

      <Separator className='mt-8' />
    </View>
  );
}
