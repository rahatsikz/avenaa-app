import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { CreditCard, Trash2 } from "lucide-react-native"; // Adjust if icons are different
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useUserDocsUpdate } from "~/api/user.query";
import { Button } from "~/components/ui/button";
import { useUserStore } from "~/store/user-store";
import { useVerifyFlowStore } from "~/store/verify-flow-store";

export default function UploadImages() {
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const { type, setStep } = useVerifyFlowStore((state) => state);
  const { user } = useUserStore((state) => state);

  const { mutate, isPending } = useUserDocsUpdate(user?.id ?? "");

  const pickImage = async (type: "front" | "back" | "profile") => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (type === "front") setFrontPreview(uri);
      else if (type === "back") setBackPreview(uri);
      else setProfilePreview(uri);
    }
  };

  const clearImage = (type: "front" | "back" | "profile") => {
    if (type === "front") setFrontPreview(null);
    else if (type === "back") setBackPreview(null);
    else setProfilePreview(null);
  };

  const queryClient = useQueryClient();

  const handleContinue = () => {
    if (!frontPreview || !backPreview || !profilePreview) return;

    const formData = new FormData();

    formData.append("typeOfId", type as string);

    formData.append("frontImage", {
      uri: frontPreview,
      name: "front.jpg",
      type: "image/jpeg",
    } as any);

    formData.append("backImage", {
      uri: backPreview,
      name: "back.jpg",
      type: "image/jpeg",
    } as any);

    formData.append("photoToVerify", {
      uri: profilePreview,
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

  const renderImageBox = (
    label: string,
    previewUri: string,
    type: "front" | "back" | "profile"
  ) => (
    <View className='border-2 border-primary rounded-xl p-2'>
      <Image
        source={{ uri: previewUri }}
        style={{ width: "100%", height: 200, borderRadius: 6 }}
        resizeMode='cover'
      />
      <View className='flex-row justify-between px-2 py-0.5 items-center mt-2.5'>
        <Text className='text-foreground'>{label}</Text>
        <TouchableOpacity
          onPress={() => clearImage(type)}
          className='flex-row items-center'
        >
          <Trash2 size={16} color='#ef4444' />
          <Text className='text-[#ef4444] ml-1'>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUploadButton = (
    label: string,
    type: "front" | "back" | "profile"
  ) => (
    <TouchableOpacity
      onPress={() => pickImage(type)}
      className='border-2 border-dashed border-gray-400 rounded-xl items-center p-5'
    >
      <CreditCard color={"#a3a3a3"} size={30} />
      <Text className='font-semibold mt-2 text-foreground'>{label}</Text>
      <Text className='text-xs text-[#888] mt-1'>JPEG or PNG only</Text>
    </TouchableOpacity>
  );

  return (
    <View className=' gap-5'>
      <Text className='text-xl text-foreground font-semibold'>
        Upload images of your ID
      </Text>

      {frontPreview
        ? renderImageBox("Front of ID", frontPreview, "front")
        : renderUploadButton("Upload Front", "front")}

      {backPreview
        ? renderImageBox("Back of ID", backPreview, "back")
        : renderUploadButton("Upload Back", "back")}

      {profilePreview
        ? renderImageBox("Your Photo", profilePreview, "profile")
        : renderUploadButton("Upload Your Photo", "profile")}

      <View className='gap-3 justify-between mt-5'>
        <Button
          onPress={() => setStep("choose-upload-method")}
          variant='outline'
        >
          <Text className='text-foreground font-medium'>Back</Text>
        </Button>
        <Button
          onPress={handleContinue}
          disabled={
            !frontPreview || !backPreview || !profilePreview || isPending
          }
        >
          <Text className='text-background font-medium'>Continue</Text>
        </Button>
      </View>
    </View>
  );
}
