import { SafeAreaView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function Call() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className='bg-white flex-1 px-4'>
      <View style={{ paddingTop: insets.top + 6 }}>
        <Text numberOfLines={2}>Call Lorem, ipsum dolor.</Text>
      </View>
    </SafeAreaView>
  );
}
