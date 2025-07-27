import { Text, View, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TriangleAlert } from "lucide-react-native";
import { MealCard } from "./MealCard";
import { colors } from "../styles/colors";
import { useGetMeals } from "../hooks/useGetMeal";
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { MealCardSkeleton } from "./MealCardSkeleton";
import { MealsListHeader } from "./MealsListHeader";

function Separator() {
  return <View className="h-8" />;
}

export function MealsList() {
  const { bottom } = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateStr = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, [currentDate]);

  const { meals, refetch, isLoading } = useGetMeals(dateStr);

  function handlePreviousDate() {
    setCurrentDate((prevState) => {
      const newDate = new Date(prevState);
      newDate.setDate(newDate.getDate() - 1);

      return newDate;
    });
  }

  function handleNextDate() {
    setCurrentDate((prevState) => {
      const newDate = new Date(prevState);
      newDate.setDate(newDate.getDate() + 1);

      return newDate;
    });
  }

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <>
      <FlatList
        data={meals}
        contentContainerStyle={{ paddingBottom: 80 + bottom + 16 }}
        keyExtractor={(meal) => meal.id}
        ListHeaderComponent={
          <MealsListHeader
            isLoading={isLoading}
            meals={meals ?? []}
            currentDate={currentDate}
            onNextDate={handleNextDate}
            onPreviousDate={handlePreviousDate}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <MealCardSkeleton />
          ) : (
            <View className="mt-2 text-center  items-center gap-3">
              <Text className="text-gray-600 text-center mx-4">
                Cadastre sua primeira refeição através de uma das opções abaixo.
              </Text>
              <Text className="text-gray-600">
                <TriangleAlert size={30} color={colors.gray[700]} />
              </Text>
            </View>
          )
        }
        ItemSeparatorComponent={Separator}
        renderItem={({ item: meal }) => (
          <View className="mx-5">
            <MealCard
              id={meal.id}
              name={meal.name}
              createdAt={new Date(meal.createdAt)}
              foods={meal.foods}
              icon={meal.icon}
            />
          </View>
        )}
      />
    </>
  );
}
