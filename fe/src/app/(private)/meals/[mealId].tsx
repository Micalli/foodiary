import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { Button } from "../../../components/Button";
import { Logo } from "../../../components/Logo";
import { mealsService } from "../../../services/meals";
import { LoadingScreen } from "../../../components/LoadingScreen";
import { colors } from "../../../styles/colors";
import { MacroBar } from "../../../components/MacroBar";
import { ArrowLeftIcon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  calcMacroPercentage,
  calcMicroPercentage,
} from "../../../utils/calcMacroPercentage";
import { formatNumber } from "../../../utils/formatNumber";
import { ErrorScreen } from "../../../components/ErrorScreen";

export default function MealDetails() {
  const { mealId } = useLocalSearchParams();

  const [pollingEnabled, setPollingEnabled] = useState(true);
  const [isErrorModalOpen, setIsAudioModalOpen] = useState(false);

  const startTimeRef = useRef(Date.now());

  const { data, isFetching } = useQuery({
    queryKey: ["meal", mealId],
    staleTime: Infinity,
    queryFn: async () => {
      const response = await mealsService.getById(mealId);
      return response;
    },
    refetchInterval: (query) => {
      if (!pollingEnabled) return false;
      if (query.state.data?.meal.status === "failed") {
        setIsAudioModalOpen(true);
        setPollingEnabled(false);

        return;
      }

      if (query.state.data?.meal.status === "success") return false;
      if (Date.now() - startTimeRef.current >= 15_000) {
        setPollingEnabled(false);
        router.back();
      }
      console.log("polling");
      return 2_000; // 2s
    },
  });

  const totals = useMemo(() => {
    let calories = 0;
    let proteins = 0;
    let carbohydrates = 0;
    let fats = 0;
    let totalGrams = 0;

    if (data?.meal.foods.length === 0 || !data?.meal.foods) {
      return;
    }
    for (const food of data?.meal.foods) {
      calories += food.calories;
      proteins += food.proteins;
      carbohydrates += food.carbohydrates;
      fats += food.fats;
      totalGrams += food.fats + food.carbohydrates + food.proteins;
    }

    const percentage = calcMicroPercentage({
      carbs: carbohydrates,
      fats,
      proteins,
    });

    return {
      calories: calories,
      proteins: proteins,
      carbohydrates: carbohydrates,
      fats: Number(fats.toFixed(1)),
      percentage,
      totalGrams: calories + proteins + carbohydrates,
    };
  }, [data]);

  if (isFetching || data?.meal.status === "processing") {
    return <LoadingScreen />;
  }

  return (
    <>
      <ErrorScreen
        open={isErrorModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />
      <View className="bg-lime-400 h-[110px] mb-5 justify-endend">
        <SafeAreaView className=" flex-row items-center justify-between mx-4   mt-5 z-20">
          <View className=" flex-row items-center  ">
            <Button
              size="icon"
              color="gray"
              className="bg-transparent"
              onPress={() => router.back()}
            >
              <ArrowLeftIcon color={colors.black[700]} />
            </Button>
            <Text className="font-sans-medium text-base">Macros totais</Text>
          </View>

          <Text className="font-sans-medium text-base ">
            Calorias {totals?.calories}kcal
          </Text>
        </SafeAreaView>
      </View>

      <View className=" px-">
        <View className="flex-row justify-between px-5 ">
          <View className="gap-2 items-end">
            <Text className="font-sans-regular text-gray-700 text-base">
              Carboidratos
            </Text>
            <Text className="text-support-yellow text-base font-sans-medium">
              {formatNumber(totals?.carbohydrates)}g
            </Text>
          </View>
          <View className="gap-2 items-end">
            <Text className="font-sans-regular text-gray-700 text-base">
              Proteínas
            </Text>
            <Text className="text-support-teal text-base font-sans-medium">
              {formatNumber(totals?.proteins)}g
            </Text>
          </View>
          <View className="gap-2 items-end">
            <Text className="font-sans-regular text-gray-700 text-base">
              Gorduras
            </Text>
            <Text className="text-support-orange text-base font-sans-medium">
              {formatNumber(totals?.fats)}g
            </Text>
          </View>
        </View>
        <View className="mt-6 items-center">
          <MacroBar
            width={300}
            height={8}
            segments={[
              {
                value: totals?.percentage.carbs ?? 0,
                color: colors.support.yellow,
              }, // Carboidratos
              {
                value: totals?.percentage.proteins ?? 0,
                color: colors.support.teal,
              }, // Proteínas
              {
                value: totals?.percentage.fats ?? 0,
                color: colors.support.orange,
              }, // Gorduras
            ]}
          />
        </View>
        <View className="border border-dashed border-gray-500  mt-5"></View>

        <View className="mt-10 px-5 ">
          <Text className="text-black-700 font-sans-semibold text-2xl">
            {data?.meal.name}
          </Text>

          <View className="mt-6">
            <Text className="font-sans-medium text-gray-700 text-base mb-4">
              Itens
            </Text>

            {data?.meal.foods.map((food) => (
              <View className="border-b border-gray-200 py-3" key={food.name}>
                <Text className="text-base text-black font-sans-regular">
                  {food.quantity} de {food.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}
