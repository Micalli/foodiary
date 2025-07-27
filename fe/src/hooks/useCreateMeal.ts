import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mealsService } from "../services/meals";
import { router } from "expo-router";
type CreateMealParams = {
  fileType: "audio/m4a" | "image/jpeg" | "text";
  text?: string;
  onSuccess(mealId: string): void;
};

export function useCreateMeal({ fileType, onSuccess, text }: CreateMealParams) {
  const queryClient = useQueryClient();
  const { mutateAsync: createMeal, isPending } = useMutation({
    mutationFn: async (uri: string) => {
      if (fileType != "text") {
        console.log("🚀 ~ Entrou no IF", fileType);

        const responseUploadedAudio = await mealsService.post(fileType);
        const { uploadURL, mealId } = responseUploadedAudio;
        console.log("🚀 ~ useCreateMeal ~ responseUploadedAudio:", responseUploadedAudio)

        const response = await fetch(uri);
        const file = await response.blob();

        await fetch(uploadURL, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        return {uploadURL, mealId };
      }
      try {
        console.log("🚀 ~ useCreateMeal ~ uri:", uri);
        console.log("🚀 ~ useCreateMeal ~ text:", text);

        console.log("🚀 ~ useCreateMeal ~ text", fileType);

        const responseUploadedAudio = await mealsService.post(fileType, uri);
        console.log(
          "🚀 ~ useCreateMeal ~ responseUploadedAudio:",
          responseUploadedAudio
        );

        const { mealId } = responseUploadedAudio;

        return  { mealId };
      } catch (error) {
        console.log("🚀 ~ useCreateMeal ~ error:", error);
        return { mealId: "dasd" };
      }
    },
    onSuccess: ({ mealId }) => {
      onSuccess(mealId);
      queryClient.refetchQueries({ queryKey: ["meals"] });
    },
  });

  return {
    createMeal,
    isPending,
  };
}
