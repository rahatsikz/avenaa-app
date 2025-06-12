import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { View } from "react-native";

export function Breadcrumb() {
  return (
    <View className='flex flex-row items-center pl-6  text-muted-foreground'>
      <Link
        href={"/home/profile"}
        className='transition-colors text-sm text-muted-foreground hover:text-foreground'
      >
        Account
      </Link>
      <ChevronRight size={14} color={"#a3a3a3"} />
      <View className='text-foreground'>
        <Link
          href='/home/account-settings/payments'
          className='text-sm text-foreground'
        >
          Payments
        </Link>
      </View>
    </View>
  );
}
