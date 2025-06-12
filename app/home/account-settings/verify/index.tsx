"use client";
import { ScrollView, View } from "react-native";
import ChooseIdType from "~/components/verify/choose-id-type";
import ChooseUploadMethod from "~/components/verify/choose-upload-method";
import UploadImages from "~/components/verify/upload-images";
import VerificationComplete from "~/components/verify/verification-complete";
import WebcamCaptureNative from "~/components/verify/webcam-capture";
import { useVerifyFlowStore } from "~/store/verify-flow-store";

export default function VerifyPage() {
  const { step } = useVerifyFlowStore((state) => state);

  return (
    <View className='flex flex-col flex-1 bg-background'>
      <View className='flex flex-1 flex-col items-center py-10 '>
        <ScrollView className='mx-auto w-full max-w-2xl px-6 pb-6 mt-9'>
          {renderTabByStep(step ?? "choose-id-type")}
        </ScrollView>
      </View>
    </View>
  );
}

function renderTabByStep(step: string) {
  switch (step) {
    case "choose-id-type":
      return <ChooseIdType />;
    case "choose-upload-method":
      return <ChooseUploadMethod />;
    case "upload-images":
      return <UploadImages />;
    case "take-photo":
      return <WebcamCaptureNative />;
    case "verification-complete":
      return <VerificationComplete />;
    default:
      return <ChooseIdType />;
  }
}
