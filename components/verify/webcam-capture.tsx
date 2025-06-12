import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera as CameraIcon, Check, RotateCw } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserDocsUpdate } from "~/api/user.query";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useUserStore } from "~/store/user-store";
import { useVerifyFlowStore } from "~/store/verify-flow-store";

type CaptureMode = "front" | "back" | "profile";

export default function WebcamCaptureNative() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { type, setStep } = useVerifyFlowStore((state) => state);

  const [frontUri, setFrontUri] = useState<string | null>(null);
  const [backUri, setBackUri] = useState<string | null>(null);
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<Blob | null>(null);
  const [backFile, setBackFile] = useState<Blob | null>(null);
  const [profileFile, setProfileFile] = useState<Blob | null>(null);
  const [loading, setLoading] = useState<Record<CaptureMode, boolean>>({
    front: false,
    back: false,
    profile: false,
  });

  // request camera permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permissions are required!");
      }
    })();
  }, []);

  const pickPhoto = async (mode: CaptureMode) => {
    setLoading((prev) => ({ ...prev, [mode]: true }));
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // will change later
      quality: 0.8,
    });
    setLoading((prev) => ({ ...prev, [mode]: false }));

    if (!result.canceled) {
      const { assets } = result;
      const resp = await fetch(assets[0].uri);
      const blob = await resp.blob();

      if (mode === "front") {
        setFrontUri(assets[0].uri);
        setFrontFile(blob);
      } else if (mode === "back") {
        setBackUri(assets[0].uri);
        setBackFile(blob);
      } else {
        setProfileUri(assets[0].uri);
        setProfileFile(blob);
      }
    }
  };

  const handleRetake = (mode: CaptureMode) => {
    if (mode === "front") setFrontUri(null);
    if (mode === "back") setBackUri(null);
    if (mode === "profile") setProfileUri(null);
    pickPhoto(mode);
  };

  const { user } = useUserStore((state) => state);

  const { mutate, isPending } = useUserDocsUpdate(user?.id ?? "");

  const queryClient = useQueryClient();

  const handleContinue = () => {
    if (!frontFile || !backFile || !profileFile) return;

    const formData = new FormData();

    formData.append("typeOfId", type as string);

    formData.append("frontImage", {
      uri: frontUri,
      name: "front.jpg",
      type: "image/jpeg",
    } as any);

    formData.append("backImage", {
      uri: backUri,
      name: "back.jpg",
      type: "image/jpeg",
    } as any);

    formData.append("photoToVerify", {
      uri: profileUri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);

    mutate(formData, {
      onSuccess: () => {
        queryClient
          .invalidateQueries({ queryKey: ["user"] })
          .catch(console.error);
        setStep("verification-complete");
      },
      onError: (error: any) => {
        Alert.alert("Upload failed", error.message);
      },
    });
  };

  const renderCard = (uri: string | null, label: string, mode: CaptureMode) => (
    <View className='w-full p-1 flex-1 '>
      {uri ? (
        <View className='border-2 border-green-500 rounded-lg overflow-hidden'>
          <Image source={{ uri }} className='w-full h-32' />
          <View className='absolute top-2 right-2 bg-green-500 p-1 rounded-full'>
            <Check size={18} color='#fff' />
          </View>
          <View className='flex-row justify-between items-center p-2'>
            <Text className='font-medium text-foreground'>{label}</Text>
            <Pressable onPress={() => handleRetake(mode)}>
              <View className='flex-row items-center gap-1.5'>
                <RotateCw size={14} color='#a3a3a3' />
                <Text className='text-foreground'>Retake</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => pickPhoto(mode)}>
          <Card className='border-2 border-dashed border-input rounded-lg p-4 items-center justify-center'>
            {loading[mode] ? (
              <ActivityIndicator />
            ) : (
              <>
                <CameraIcon size={32} color='#a3a3a3' />
                <Text className='font-medium mt-2 text-foreground'>
                  Capture {label.toLowerCase()}
                </Text>
                <Text className='text-sm text-gray-400'>
                  Position in frame and snap
                </Text>
              </>
            )}
          </Card>
        </Pressable>
      )}
    </View>
  );

  return (
    <View className='flex-1 bg-background '>
      <View className='mb-6'>
        <Text className='text-2xl font-semibold text-foreground'>
          Take photos of your{" "}
          {type?.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
        </Text>
        <Text className='text-sm text-gray-500 mt-1'>
          Ensure your photos are not blurry and the front clearly shows your
          face.
        </Text>
      </View>

      <View className=' flex-1 gap-2'>
        {renderCard(frontUri, "Front of ID", "front")}
        {renderCard(backUri, "Back of ID", "back")}
        {renderCard(profileUri, "Your Photo", "profile")}
      </View>

      <Separator className='my-4' />

      <View className='gap-3 mb-6'>
        <Button
          variant='outline'
          onPress={() => setStep("choose-upload-method")}
        >
          <Text className='text-foreground font-medium'>Back</Text>
        </Button>
        <Button
          onPress={handleContinue}
          disabled={!frontUri || !backUri || !profileUri || isPending}
        >
          <Text className='text-background font-medium'>Continue</Text>
        </Button>
      </View>
    </View>
  );
}
