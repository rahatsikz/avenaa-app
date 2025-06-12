import { ScrollView, Text, View } from "react-native";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const items = [
  "For security purposes, CCTV cameras have been installed overlooking the outdoor spaces and kitchen for security purposes.",
  "Guests do not have access to the master bedroom on the second floor and the kitchen on the ground floor.",
  "As there is no lift in the villa, guests are requested to utilize the staircase.",
  "Guests can stay connected with complimentary Wi-Fi. Network is subject to availability at any given time.",
  "Mobile networks such as Jio, Airtel and Vi work fairly well here.",
  "Alcohol consumption is allowed. Please do not carry food/drinks in and around the pool.",
  "Smoking is allowed in the exterior areas of the villa only.",
  "Outside food is not allowed.",
  "Children should be supervised while they are in or around the pool.",
  "We urge you to wear swimming attire in the pool and kindly shower before entering.",
  "Guests are earnestly requested to treat the home with care.",
  "Please note that guests cannot hire or bring any outside vendor for any events at the property.",
];

export function HomeRulesModal({
  showHomeRules,
  setShowHomeRules,
}: {
  showHomeRules: boolean;
  setShowHomeRules: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={showHomeRules} onOpenChange={setShowHomeRules}>
      <DialogContent className='max-w-2xl w-[360px] p-0 '>
        <DialogHeader className='pt-5'>
          <View className='flex items-center justify-center'>
            <DialogTitle className='text-lg font-semibold text-foreground leading-none'>
              Home Rules and Policy
            </DialogTitle>
          </View>
        </DialogHeader>

        <View className='mt-0 pb-6'>
          <ScrollView
            className='h-96'
            showsVerticalScrollIndicator
            nestedScrollEnabled
          >
            <View className='px-6 gap-2'>
              {items.slice(0, 8).map((item, index) => (
                <View key={index} className='flex-row items-start'>
                  <Text className='text-sm mr-2 text-foreground/90'>
                    {index + 1}.
                  </Text>
                  <Text className='text-sm flex-1 text-foreground'>{item}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </DialogContent>
    </Dialog>
  );
}
