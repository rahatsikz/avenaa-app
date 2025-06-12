import { Text, View } from "react-native";

export const LoginHeader = () => {
  return (
    <View className='relative'>
      <Text className='text-xl text-foreground font-medium absolute top-28 left-1/2 -translate-x-1/2 text-center'>
        Login or Sign up
      </Text>
      <Text className='text-2xl absolute text-foreground top-32 mt-4 left-1/2 -translate-x-1/2 text-center'>
        Welcome to
        <Text className='font-bold text-primary'> Avenaa</Text>
      </Text>
    </View>
  );
};
