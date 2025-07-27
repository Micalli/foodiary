import { httpClient } from "../httpClient";

export async function post(
  fileType: "audio/m4a" | "image/jpeg" | "text",
  text?: string
) {
  console.log("🚀 ~ post ~ text:", text);
  console.log("🚀 ~ post ~ fileType:", fileType);
  try {
    const { data } = await httpClient.post<{
      mealId: string;
      uploadURL: string;
    }>("/meals", {
      fileType,
      text,
    });

    return data;
  } catch (error) {
    console.log("🚀 ~ post ~ error:", error);
    const data = {
      mealId: "asdasdasd",
      uploadURL: "asdasda",
    };
    return data;
  }
}
