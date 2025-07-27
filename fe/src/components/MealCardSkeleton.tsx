import { View } from 'react-native';

export function MealCardSkeleton() {
  return (
    <View className="mt-2 mx-4 px-4 py-5 flex-row gap-3 items-center border border-gray-400 rounded-2xl animate-pulse">
      {/* Círculo do ícone */}
      <View className="size-12 bg-gray-300 rounded-full" />

      {/* Textos */}
      <View className="flex-1">
        <View className="h-4 w-32 bg-gray-300 rounded mb-2" />
        <View className="h-4 w-[220px] bg-gray-300 rounded" />
      </View>
    </View>
  );
}
