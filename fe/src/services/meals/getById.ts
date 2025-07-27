import { httpClient } from "../httpClient";
type Meal = {
  id: string;
  createdAt: string;
  icon: string;
  name: string;
  status: "uploading" | "processing" | "success" | "failed";
  foods: {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  }[];
};

export async function getById(meaId: string | string[]) {
  const { data } = await httpClient.get<{ meal: Meal }>(`/meals/${meaId}`);
  return data;
}
