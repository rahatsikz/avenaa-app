import { useLocalSearchParams } from "expo-router";
import { Loader2 } from "lucide-react-native";
import { SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetProperty } from "~/api/property.query";
import { Amenities } from "~/components/product/amenity";
import AvailableDates from "~/components/product/available-dates";
import BookNowCard from "~/components/product/book-now-card";
import { FrequesntyAskedSection } from "~/components/product/faq";
import HostDetail from "~/components/product/host-detail";
import { MobileGalleryCard } from "~/components/product/mobile-gallery-card";
import PropertyDetail from "~/components/product/property-detail";
import { PropertyOverview } from "~/components/product/property-overview";
import { RatingCard } from "~/components/product/rating-card";
import { RulesRefundPolicy } from "~/components/product/rules-refund-policy";
import { SpacesCarousel } from "~/components/product/space-carousel";
import { AmenityGroup, ImageAsset, IProperty, Patron } from "~/types";
export default function Prodcut() {
  const inset = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { data: product, isLoading, isFetching } = useGetProperty(id as string);

  if (isLoading || isFetching)
    return (
      <SafeAreaView
        style={{ paddingTop: inset.top + 6 }}
        className='pt-8 flex items-center bg-background flex-1 justify-center'
      >
        <Loader2 color={"#a3a3a3"} className='size-4 animate-spin' />
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      className='bg-background flex-1'
      style={{ paddingTop: inset.top + 6 }}
    >
      <ScrollView className='px-[17px] flex-1 '>
        <MobileGalleryCard
          pictures={product?.images as ImageAsset[]}
          thumbnail={product?.thumbnail as ImageAsset}
        />
        <PropertyDetail product={product as IProperty} />
        <HostDetail user={product?.patron as Patron} />
        <BookNowCard product={product as IProperty} />
        <PropertyOverview content={product?.description as string} />
        <Amenities amenityList={product?.amenityGroup as AmenityGroup[]} />
        <SpacesCarousel product={product as IProperty} />
        <AvailableDates product={product as IProperty} />
        <RulesRefundPolicy />
        <RatingCard product={product as IProperty} />
        <FrequesntyAskedSection />
      </ScrollView>
    </SafeAreaView>
  );
}
