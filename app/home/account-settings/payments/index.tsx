"use client";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AccountHolder from "~/components/payout/account-holder";
import AddPayoutMethod from "~/components/payout/add-payout-method";
import AddressForm from "~/components/payout/address-form";
import BankAccountForm from "~/components/payout/bank-account-form";
import { Breadcrumb } from "~/components/payout/payment-breadcrumb";
import PaymentsDashboard from "~/components/payout/payments-dashboard";
import PayoutSetupComplete from "~/components/payout/payout-setup-complete";
import ReviewInfo from "~/components/payout/review-info";
import { usePayoutFlowStore } from "~/store/payout-flow-store";

export default function PaymentPageContents() {
  const { step } = usePayoutFlowStore((state) => state);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top + 24 }}
      className='mx-auto  max-w-4xl w-full flex-1 bg-background'
    >
      {step === "payment-dashboard" && <Breadcrumb />}
      <ScrollView className='px-6  w-full'>{renderTabByStep(step)}</ScrollView>
    </View>
  );
}

function renderTabByStep(step: string) {
  switch (step) {
    case "payment-dashboard":
      return <PaymentsDashboard />;
    case "add-payout-method":
      return <AddPayoutMethod />;
    case "bank-account":
      return <BankAccountForm />;
    case "account-holder":
      return <AccountHolder />;
    case "address-form":
      return <AddressForm />;
    case "review-info":
      return <ReviewInfo />;
    case "complete":
      return <PayoutSetupComplete />;
    default:
      return <PaymentsDashboard />;
  }
}
