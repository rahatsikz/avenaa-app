import { Text, View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const dummyFaqArr = [
  {
    question: "What types of accommodations does Avenaa offer?",
    answer:
      "Avenaa provides a wide range of lodging options including apartments, villas, resorts, and hotels, catering to various preferences and needs.",
  },
  {
    question: "How can I make a reservation with Avenaa?",
    answer:
      "Reserving your stay with Avenaa is easy! You can book directly through our website or contact our friendly customer service team for assistance.",
  },
  {
    question: "What amenities are included with accommodations?",
    answer:
      "Our accommodations come with a variety of amenities such as free Wi-Fi, parking, swimming pools, gyms, and more. Specific amenities vary depending on the property type.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Avenaa's cancellation policy varies by property and booking type. Please refer to the specific property's terms and conditions or contact us for detailed information.",
  },
];

export function FrequesntyAskedSection({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <View className='my-5 flex w-full flex-col items-start gap-8 pt-5 h-full'>
      <View className='w-full flex-1 pl-1'>
        <Text className=' text-xl font-semibold text-foreground/80'>
          Frequently Asked Questions
        </Text>
        <Accordion
          type='single'
          collapsible
          className='mt-4  w-full gap-3 rounded-lg border border-border py-4 px-3'
        >
          {dummyFaqArr.map((item, idx) => (
            <AccordionItem
              key={idx}
              className='border-0'
              value={`item-${idx + 1}`}
            >
              <AccordionTrigger
                className='rounded-lg bg-secondary py-4 px-3 '
                asChild
              >
                <Text className='text-xs text-foreground'>{item.question}</Text>
              </AccordionTrigger>

              <AccordionContent className='p-4'>
                <Text className='text-sm text-muted-foreground'>
                  {item.answer}
                </Text>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </View>
    </View>
  );
}
