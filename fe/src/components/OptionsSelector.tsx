import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { cn } from "../utils/cn";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IOptionSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  options: {
    value: string;
    icon: string;
    title: string;
    description?: string;
  }[];
}

export function OptionsSelector({
  options,
  onChange,
  value,
}: IOptionSelectorProps) {
  const { bottom } = useSafeAreaInsets();

  const Separator = () => <View className="h-4" />;

  const renderItem = ({ item: option }: { item: any }) => (
    <TouchableOpacity
      key={option.value}
      className={cn(
        "border border-gray-500 rounded-2xl py-3 px-4 flex-row gap-4 items-center mx-5 ",
        value === option.value && "bg-lime-700/10 border-lime-700"
      )}
      onPress={() => onChange?.(option.value)}
    >
      <View
        className={cn(
          "size-12 bg-gray-400 items-center justify-center rounded-xl",
          value === option.value && "bg-white/40"
        )}
      >
        <Text>{option.icon}</Text>
      </View>

      <View className="">
        <Text className="text-black-700 text-base font-sans-semibold">
          {option.title}
        </Text>

        {option.description && (
          <Text className="text-sm font-sans-regular px-2 text-gray-700  w-[200px]">
            {option.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={options}
      keyExtractor={(item) => item.value.toString()}
      contentContainerStyle={{
        paddingBottom: 80 + bottom + 16,
      }}
      className='mt-6'
      ItemSeparatorComponent={Separator}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text className="text-center mt-10 text-gray-500">
          Nenhuma opção disponível...
        </Text>
      }
    />
  );
}
