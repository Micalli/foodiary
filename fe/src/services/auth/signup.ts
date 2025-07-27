import { httpClient } from "../httpClient";
export type signUpParams = {
  goal: string;
  gender: string;
  birthDate: string;
  activityLevel: number;
  height: number;
  weight: number;
  account: {
    name: string;
    email: string;
    password: string;
  };
};

export async function signUp(params: signUpParams) {
  const { data } = await httpClient.post("/signup", params);
  return data;
}
