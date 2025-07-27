import { httpClient } from "../httpClient";
export type Meals = {
  name: string;
  id: string;
  icon: string;
  foods: {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  }[];
  createdAt: string;
};

export async function get(date: string) {
  const { data } = await httpClient.get<{ meals: Meals[] }>("/meals", {
    params: {
      date
    },
  });
  return data;
}
