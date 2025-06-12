import { useRef } from "react";
import { TextInput as RNTextInput, TextInput, View } from "react-native";

type OtpInputProps = {
  value: string;
  onChange: (code: string) => void;
};

export function OtpInput({ value, onChange }: OtpInputProps) {
  const inputsRef = useRef<RNTextInput[]>([]);

  const digits = value.split("").concat(["", "", "", ""]).slice(0, 4);

  const handleChar = (char: string, idx: number) => {
    const newDigits = [...digits];

    if (char === "") {
      newDigits[idx] = "";
      const newCode = newDigits.join("");
      onChange(newCode);

      return;
    }

    //if it's not a single digit
    if (!/^\d$/.test(char)) {
      return;
    }

    //vald case
    newDigits[idx] = char;
    const newCode = newDigits.join("");
    onChange(newCode);

    //focus next or blur if at the end
    if (idx < 3) {
      inputsRef.current[idx + 1]?.focus();
    } else {
      inputsRef.current[idx]?.blur();
    }
  };

  return (
    <View className='flex-row justify-center'>
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(r) => {
            if (r) inputsRef.current[i] = r;
          }}
          value={d}
          onChangeText={(text) => handleChar(text, i)}
          keyboardType='number-pad'
          maxLength={1}
          className='h-11 w-11 mx-1 border border-input rounded-lg text-center text-sm text-foreground'
        />
      ))}
    </View>
  );
}
