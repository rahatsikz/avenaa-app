import { Text, View } from "react-native";

export function PropertyOverview({ content }: { content: string }) {
  return (
    <View className='my-5 flex flex-col gap-3.5 py-3 pl-1'>
      <Text className='text-xl font-semibold leading-none text-foreground/80'>
        About this place
      </Text>
      <Text className='w-full pl-[2px] text-sm text-muted-foreground'>
        {content}
      </Text>
    </View>
  );
}
