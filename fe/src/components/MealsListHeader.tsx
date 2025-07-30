import { ActivityIndicator, Text, View } from "react-native";
import { DailyStats } from "./DailyStats";
import { DateSwitcher } from "./DateSwitcher";
import { useAuth } from "../hooks/useAuth";
import { useMemo } from "react";
import { Meals } from "../services/meals/get";
import { colors } from "../styles/colors";

interface IMealsListHeaderProps {
  currentDate: Date;
  meals: Meals[];
  isLoading: boolean;
  onPreviousDate(): void;
  onNextDate(): void;
}

export function MealsListHeader({
  meals,
  currentDate,
  isLoading,
  onNextDate,
  onPreviousDate,
}: IMealsListHeaderProps) {
  const { user } = useAuth();

  const totals = useMemo(() => {
    let calories = 0;
    let proteins = 0;
    let carbohydrates = 0;
    let fats = 0;

    for (const meal of meals) {
      for (const food of meal.foods) {
        calories += food.calories;
        proteins += food.proteins;
        carbohydrates += food.carbohydrates;
        fats += food.fats;
      }
    }

    return {
      calories,
      proteins,
      carbohydrates,
      fats,
    };
  }, [meals]);

  return (
    <>
      <DateSwitcher
        currentDate={currentDate}
        onNextDate={onNextDate}
        onPreviousDate={onPreviousDate}
      />
      <View className="mt-2">
        <DailyStats
          isLoading={isLoading}
          calories={{
            current: totals.calories,
            goal: user?.calories || 0,
          }}
          carbohydrates={{
            current: totals.carbohydrates,
            goal: user?.carbohydrates || 0,
          }}
          fats={{
            current: totals.fats,
            goal: user?.fats || 0,
          }}
          proteins={{
            current: totals.proteins,
            goal: user?.proteins || 0,
          }}
        />
      </View>

      <View className="h-px bg-gray-200 mt-7"></View>
      <View className="flex-row">
        <Text className="m-5 text-black-700 text-base font-sans-medium tracking-[1.28px]">
          REFEIÇÕES
        </Text>
        {isLoading && <ActivityIndicator color={colors.black[700]} />}
      </View>
    </>
  );
}
