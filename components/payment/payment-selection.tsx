import { CreditCard, Home } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";

export function PaymentSelection({
  onChange,
  value,
}: {
  onChange: (val: string) => void;
  value: string;
}) {
  const paymentMethod = value;
  const handleSelect = (method: string) => {
    onChange(method);
  };

  return (
    <View>
      <Text className='mb-4 text-xl font-bold'>Choose Payment Option</Text>
      <View className='gap-4'>
        {/* Pay at Hotel */}
        <Pressable onPress={() => handleSelect("PAYMENT_ON_ARRIVAL")}>
          <Card
            className={cn(
              "cursor-pointer border-2 border-border",
              paymentMethod === "PAYMENT_ON_ARRIVAL" && "border-primary"
            )}
          >
            <CardHeader className='pb-4'>
              <View className='text-base flex-row items-center gap-1'>
                <Home size={24} color={"#a3a3a3"} />
                <Text className='font-semibold text-foreground/80'>
                  {" "}
                  Pay at Hotel
                </Text>
              </View>
            </CardHeader>
            <CardContent>
              {[
                "No advance payment needed",
                "Pay at check-in with cash or card",
                "Free cancellation before check-in time",
              ].map((text, index) => (
                <View key={index} className='flex-row items-start gap-2'>
                  <Text className='text-primary font-medium'>✓</Text>
                  <Text className='text-muted-foreground flex-1 text-sm'>
                    {text}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </Pressable>

        {/* Pay Now */}
        <Pressable onPress={() => handleSelect("PAYMENT_ONLINE")}>
          <Card
            className={cn(
              "cursor-pointer border-2 border-border",
              paymentMethod === "PAYMENT_ONLINE" && "border-primary"
            )}
          >
            <CardHeader className='pb-4 '>
              <View className='text-base flex-row items-center gap-2'>
                <CreditCard size={24} color={"#a3a3a3"} />
                <Text className='font-semibold text-foreground/80'>
                  Pay Now
                </Text>
              </View>
            </CardHeader>
            <CardContent>
              {[
                "Get instant confirmation",
                "Pay securely online",
                "Get 5% cashback on payment",
              ].map((text, index) => (
                <View key={index} className='flex-row items-start gap-2'>
                  <Text className='text-primary font-medium'>✓</Text>
                  <Text className='text-muted-foreground flex-1 text-sm'>
                    {text}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </Pressable>
      </View>
    </View>
  );
}
