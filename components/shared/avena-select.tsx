import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { cn } from "~/lib/utils"; // Or just use className strings if not using cn()

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  selectedValue?: string;
  onValueChange: (value: string) => void;
}

export const AvenaSelect: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  selectedValue,
  onValueChange,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label ?? "";

  return (
    <View className='w-full'>
      <TouchableOpacity
        className='flex-row justify-between items-center h-10 border border-input rounded-md px-3 bg-background'
        onPress={() => setVisible(true)}
      >
        <Text
          className={cn(
            "text-sm text-foreground",
            !selectedLabel && "text-foreground"
          )}
        >
          {selectedLabel || placeholder}
        </Text>
        <ChevronDown size={16} className='text-muted-foreground' />
      </TouchableOpacity>

      <Modal visible={visible} animationType='slide' transparent>
        <Pressable
          className='flex-1 justify-end bg-black/30'
          onPress={() => setVisible(false)}
        >
          <View className='max-h-[38%] bg-muted rounded-t-2xl pt-6 pb-4'>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                  className='py-2.5 px-12'
                >
                  <Text className='text-base text-foreground'>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
