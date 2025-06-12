import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, View } from "react-native";
import PagerView from "react-native-pager-view";
import { cn } from "~/lib/utils";
import { ImageAsset } from "~/types";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const H_PADDING = 16 * 2;
// const CONTAINER_WIDTH = SCREEN_WIDTH - H_PADDING;
// const SLIDE_HEIGHT = CONTAINER_WIDTH * 0.6;

export function MobileGalleryCard({
  pictures,
  thumbnail,
}: {
  pictures: ImageAsset[];
  thumbnail: ImageAsset;
}) {
  const pagerRef = useRef<PagerView>(null);
  const [active, setActive] = useState(0);
  const slides = [thumbnail, ...pictures];

  // auto-advance
  useEffect(() => {
    const t = setInterval(() => {
      const next = active + 1 >= slides.length ? 0 : active + 1;
      pagerRef.current?.setPage(next);
      setActive(next);
    }, 3500);
    return () => clearInterval(t);
  }, [active, slides.length]);

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

  const [loading, setLoading] = useState(false);

  return (
    <View className='mt-4'>
      <PagerView
        ref={pagerRef}
        // style={{ width: CONTAINER_WIDTH, height: SLIDE_HEIGHT }}
        style={{ flex: 1, aspectRatio: 16 / 9 }}
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        {slides.map((img, i) => (
          <View
            key={i}
            // style={{ width: CONTAINER_WIDTH, height: SLIDE_HEIGHT }}
            className='overflow-hidden rounded-xl bg-gray-100'
          >
            <Image
              source={{ uri: img.secureUrl }}
              // style={{ width: "100%", height: "100%" }}
              className='flex-1'
              resizeMode='cover'
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
          </View>
        ))}
      </PagerView>

      {/* Prev/Next buttons */}
      <View className='absolute top-1/2 -translate-y-1/2 left-4 right-[14px] flex-row justify-between'>
        <Pressable
          onPress={goPrev}
          className='bg-background/30 p-2 rounded-full'
        >
          <ChevronLeft size={20} color='#fff' />
        </Pressable>
        <Pressable
          onPress={goNext}
          className='bg-background/30 p-2 rounded-full'
        >
          <ChevronRight size={20} color='#fff' />
        </Pressable>
      </View>

      {/* Dots */}
      <View className='absolute bottom-4 left-4 right-4 flex-row justify-center gap-2'>
        {slides.map((_, i) => (
          <View
            key={i}
            className={cn(
              "w-2 h-2 rounded-full",
              i === active ? "bg-white" : "bg-muted-foreground"
            )}
          />
        ))}
      </View>
    </View>
  );
}
