import { httpClient } from "../httpClient";
export type User = {
    email: string;
    name: string;
    id: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
};

export async function me() {
  const { data } = await httpClient.get<{ user: User }>("/me");
  return data;
}
