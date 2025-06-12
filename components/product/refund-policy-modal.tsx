import { AlertCircle, Calendar, CreditCard } from "lucide-react-native";
import { Text, View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export function RefundPolicyModal({
  showRefundPolicy,
  setShowRefundPolicy,
}: {
  showRefundPolicy: boolean;
  setShowRefundPolicy: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={showRefundPolicy} onOpenChange={setShowRefundPolicy}>
      <DialogContent className='max-w-2xl w-[360px]'>
        <DialogHeader>
          <View className='flex items-center justify-between'>
            <DialogTitle className='text-xl font-semibold'>
              Refund Policy
            </DialogTitle>
          </View>
        </DialogHeader>

        <View className='mt-0'>
          <Accordion type='single' collapsible defaultValue='refunds'>
            <PolicyAccordion
              value='refunds'
              Icon={<CreditCard size={16} color={"#a3a3a3"} />}
              title='Refunds & Processing'
            >
              <View className='mb-2   gap-2 text-sm'>
                <View className='flex-row items-start'>
                  <Text className='text-sm mr-2 text-muted-foreground'>•</Text>
                  <Text className='text-sm flex-1 text-muted-foreground'>
                    Refunds will be processed within 10 working days from the
                    cancellation date, after deducting a 5% processing fee.
                  </Text>
                </View>
                <View className='flex-row items-start'>
                  <Text className='text-sm mr-2 text-muted-foreground'>•</Text>
                  <Text className='text-sm flex-1 text-muted-foreground'>
                    Bookings made via third-party platforms (MakeMyTrip,
                    Booking.com, Airbnb, etc.) are subject to their respective
                    cancellation and refund policies.
                  </Text>
                </View>
              </View>
            </PolicyAccordion>
            <PolicyAccordion
              value='voucher'
              Icon={<AlertCircle size={16} color={"#a3a3a3"} />}
              title='What is a Future Stay Voucher?'
            >
              <Text className='text-sm pl-1 text-muted-foreground'>
                A Future Stay Voucher is a credit that can be used for a future
                booking at Mehta Mansion. The voucher is valid for 12 months
                from the date of issue and can be used for any available dates
                within that period. The voucher is non-transferable and cannot
                be exchanged for cash.
              </Text>
            </PolicyAccordion>
            <PolicyAccordion
              value='rescheduling'
              Icon={<Calendar size={16} color={"#a3a3a3"} />}
              title='Rescheduling Policy'
            >
              <Text className='text-sm pl-1 text-muted-foreground'>
                Guests can reschedule their stay up to 12 days before check-in
                without any penalty. Rescheduling requests made between 6-12
                days before check-in will incur a 25% rescheduling fee.
                Rescheduling is not allowed less than 6 days before check-in.
              </Text>
            </PolicyAccordion>
          </Accordion>
        </View>
      </DialogContent>
    </Dialog>
  );
}

function PolicyAccordion({
  value,
  children,
  Icon,
  title,
}: {
  value: string;
  children: React.ReactNode;
  Icon: React.ReactNode;
  title: string;
}) {
  return (
    <AccordionItem value={value} className='last:border-b-0'>
      <AccordionTrigger className='rounded-sm  hover:text-foreground/70 hover:no-underline'>
        <View className='flex-row items-center gap-5 text-base font-medium'>
          {Icon}
          <Text className='text-foreground font-medium'>{title}</Text>
        </View>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}
