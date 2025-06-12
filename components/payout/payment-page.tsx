"use client";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePayoutFlowStore } from "~/store/payout-flow-store";
import AccountHolder from "./account-holder";
import AddPayoutMethod from "./add-payout-method";
import AddressForm from "./address-form";
import BankAccountForm from "./bank-account-form";
import { Breadcrumb } from "./payment-breadcrumb";
import PaymentsDashboard from "./payments-dashboard";
import PayoutSetupComplete from "./payout-setup-complete";
import ReviewInfo from "./review-info";
// import AccountVerificationModal from "./account-verification-modal";

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
