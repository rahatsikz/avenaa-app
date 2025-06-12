import { X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Control, FieldValues, useController } from "react-hook-form";
import {
  Keyboard,
  LayoutRectangle,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSearchStore } from "~/store/search-store";

export type OptionProps = {
  id: string;
  value: string;
  label: string;
  state: string;
};

type SearchPopoverProps<TFieldValues extends FieldValues> = {
  name: string;
  control: Control<TFieldValues | any>;
  //   options: OptionProps[];
  placeholder?: string;
  disabled?: boolean;
};

const loadCities = async (inputValue: string) => {
  if (inputValue === "") return [];
  try {
    const response = await fetch(
      `${
        process.env.EXPO_PUBLIC_API_ENDPOINT ??
        "https://api.avenaa.co.in/api/v1"
      }/city?input="${encodeURIComponent(inputValue)}"`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }
    return data?.data?.result?.map((city: any) => ({
      id: city.id,
      label: city.label,
      value: city.value,
      state: city.state,
    }));
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export const SearchPopover = <TFieldValues extends FieldValues>({
  name,
  control,
  placeholder = "Search...",
  disabled = false,
}: SearchPopoverProps<TFieldValues>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const [input, setInput] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [inputLayout, setInputLayout] = useState<LayoutRectangle | null>(null);
  const containerRef = useRef<View>(null);
  const [options, setOptions] = useState<OptionProps[]>([]);

  const { destination, setDestination, setSearchEnable } = useSearchStore(
    (state) => state
  );

  useEffect(() => {
    if (!input) return;

    const fetchCities = async () => {
      const data = await loadCities(input.length > 0 ? input : "");
      setOptions(data);
    };

    fetchCities().catch(console.error);
  }, [input]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(input.toLowerCase())
  );

  const onFocus = () => {
    if (!disabled) setIsOpen(true);
  };

  const onChangeText = (text: string) => {
    setInput(text);
    onChange(text);
    setIsOpen(text.length > 0);
  };

  const handleSelect = (opt: OptionProps) => {
    setSearchEnable(false);

    setInput(opt.label);
    onChange(opt.value);
    setDestination(opt.value);
    setIsOpen(false);
    Keyboard.dismiss();
  };

  return (
    <View ref={containerRef} className='w-full relative'>
      {destination ? (
        <TouchableOpacity
          className='border p-2  rounded  flex-row items-center justify-between bg-background text-sm border-border'
          onPress={() => {
            setSearchEnable(false);
            setDestination("");
            setInput("");
          }}
        >
          <Text className='capitalize'> {destination} </Text>
          <X color={"#a3a3a3"} size={16} className='pr-4' />
        </TouchableOpacity>
      ) : (
        <TextInput
          className={`border p-2 rounded capitalize bg-background text-sm border-border ${
            disabled ? "opacity-50" : ""
          }`}
          placeholder={placeholder}
          value={input}
          onFocus={onFocus}
          onChangeText={onChangeText}
          editable={!disabled}
          onLayout={(e) => setInputLayout(e.nativeEvent.layout)}
        />
      )}

      {isOpen && inputLayout && filtered.length > 0 && (
        <View
          className='absolute bg-background border border-border rounded shadow'
          style={{
            top: inputLayout.height + 6,
            left: 0,
            right: 0,
            maxHeight: 160,
            zIndex: 1000,
          }}
        >
          <ScrollView keyboardShouldPersistTaps='handled'>
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  className='p-2 border-b last:border-b-0 border-border'
                  onPress={() => handleSelect(opt)}
                >
                  <Text>{opt.label}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className='p-2 text-center text-gray-400'>
                No results found
              </Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
