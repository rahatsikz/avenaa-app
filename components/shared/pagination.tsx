import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { cn } from "~/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  goTo,
}: {
  currentPage: number;
  totalPages: number;
  goTo: (page: number) => void;
}) {
  return (
    <View className='flex-row justify-center items-center gap-4 mt-4'>
      {/* Previous Button */}
      <Pressable
        onPress={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2  bg-gray-200 rounded-full",
          currentPage === 1 ? "opacity-50" : "bg-primary"
        )}
      >
        <ChevronLeft size={16} color={currentPage === 1 ? "#9CA3AF" : "#fff"} />
      </Pressable>

      {/* Page Numbers */}
      <View className='flex-row gap-2'>
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const isVisible =
            p === 1 ||
            p === totalPages ||
            (p >= currentPage - 1 && p <= currentPage + 1);
          const isEllipsis = p === 2 || p === totalPages - 1;

          return (
            <View key={p}>
              {isVisible ? (
                <Pressable
                  onPress={() => goTo(p)}
                  className={cn(
                    "px-3.5 py-2 rounded-full",
                    p === currentPage ? "bg-primary" : "bg-muted"
                  )}
                >
                  <Text
                    className={cn(
                      "text-sm font-medium",
                      p === currentPage ? "text-white" : "text-foreground"
                    )}
                  >
                    {p}
                  </Text>
                </Pressable>
              ) : isEllipsis ? (
                <View className='px-2 py-1'>
                  <MoreHorizontal size={16} color='#6B7280' />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Next Button */}
      <Pressable
        onPress={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-full bg-gray-200",
          currentPage === totalPages ? "opacity-50" : "bg-primary"
        )}
      >
        <ChevronRight
          size={16}
          color={currentPage === totalPages ? "#9CA3AF" : "#fff"}
        />
      </Pressable>
    </View>
  );
}
