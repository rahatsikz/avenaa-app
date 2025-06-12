import { useIsFocused } from "@react-navigation/native";
import { format } from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetAllProperties } from "~/api/property.query";
import PropertyCard, {
  PropertyCardSkeleton,
} from "~/components/shared/property-card";
import PropertyFilter from "~/components/shared/property-filter";
import { useSearchStore } from "~/store/search-store";
import { useUserStore } from "~/store/user-store";
import { IProperty } from "~/types";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { user } = useUserStore((state) => state);

  const { adults, children, rooms, destination, range, searchEnable } =
    useSearchStore((state) => state);

  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [hasMore, setHasMore] = useState(true); // Track if more data is available
  const { data, isFetching, refetch, isFetched } = useGetAllProperties({
    adults: JSON.stringify(adults),
    children: JSON.stringify(children),
    rooms: JSON.stringify(rooms),
    destination: destination,
    from: range.start ? format(range.start, "yyyy-MM-dd") : "",
    to: range.end ? format(range.end, "yyyy-MM-dd") : "",
    isEnabled: searchEnable,
    page: page,
    limit: 5,
  });

  useEffect(() => {
    if (data?.data?.result) {
      if (page === 1) {
        setProperties(data.data.result);
      } else {
        // Append
        setProperties((prev) => [...prev, ...data.data.result]);
      }

      const totalResults = data.data.totalDocuments;
      const totalPages = Math.ceil(totalResults / 10);
      setHasMore(page < totalPages);
    }
  }, [data, page]);

  // Infinite scroll trigger
  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Refetch on focus only for fresh search
  useFocusEffect(
    useCallback(() => {
      if (searchEnable) {
        setPage(1);
        refetch();
      }
    }, [refetch, searchEnable])
  );

  const scrollRef = useRef<ScrollView>(null);
  const isFocused = useIsFocused();

  // Scroll to top on focus
  useEffect(() => {
    if (isFocused) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isFocused]);

  return (
    <SafeAreaView
      className='bg-background flex-1'
      style={{ paddingTop: insets.top + 8 }}
    >
      <PropertyFilter />
      <ScrollView
        ref={scrollRef}
        className='flex-1 px-4'
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isNearBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 100;

          if (isNearBottom) {
            handleLoadMore();
          }
        }}
        onMomentumScrollEnd={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isNearBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 100;
          if (isNearBottom) {
            handleLoadMore();
          }
        }}
        onScrollEndDrag={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isNearBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 100;
          if (isNearBottom) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={200}
      >
        <View className='gap-3.5 my-4'>
          {isFetching && page === 1 && !isFetched && <PropertyCardSkeleton />}
          {data?.data?.result.length === 0 && isFetched && !isFetching && (
            <Text className='text-sm text-foreground/70 text-center'>
              No properties found
            </Text>
          )}
          {properties.map((property, idx) => (
            <PropertyCard property={property} key={idx} />
          ))}
          {hasMore && data?.data?.result.length > 0 && <PropertyCardSkeleton />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
