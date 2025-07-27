import { httpClient } from "../httpClient";
export type signInParams = {
  email: string;
  password: string;
};

export async function signIn(params: signInParams) {
  const { data } = await httpClient.post("/signin", params);
  return data;
}
