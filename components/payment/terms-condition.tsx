import { Link } from "expo-router";
import { Text, View } from "react-native";

export function TermsAndCondition() {
  return (
    <View className="mt-6">
      <Text className="text-pretty text-sm text-foreground/70">
        By clicking the button below, I confirm that I&apos;ve read and agree to the{" "}
        <Link href={"/"} className="text-primary hover:underline">
          Host&apos;s House Rules
        </Link>{" "}
        ,{" "}
        <Link href={"/"} className="text-primary hover:underline">
          Guest Guidelines
        </Link>{" "}
        , Avenaa&apos;s{" "}
        <Link href={"/"} className="text-primary hover:underline">
          Rebooking and Refund Policy
        </Link>{" "}
        , and understand that Avenaa may charge my payment method for any damages I&apos;m responsible for.
      </Text>
      <Text className="mt-2 text-pretty text-sm text-foreground/70">
        I also accept the latest{" "}
        <Link href={"/"} className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href={"/"} className="text-primary hover:underline">
          Payment Terms
        </Link>
        , and acknowledge the{" "}
        <Link href={"/"} className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </Text>
    </View>
  );
}
