import { useQuery } from "@tanstack/react-query";
import { mealsService } from "../services/meals";
type CreateMealParams = {
  fileType: "audio/m4a" | "image/jpeg";
  onSuccess(mealId: string): void;
};

export function useGetMeals(date: string) {
  const {
    data: meals,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["meals", date],
    staleTime: 5_000,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await mealsService.get(date);

      return response.meals;
    },
  });

  return {
    meals,
    isLoading: isFetching ,
    refetch,
  };
}
