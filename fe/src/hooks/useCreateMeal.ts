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
    onSuccess: async ({ mealId }) => {
      try {
        // Aguardar que a refeição esteja processada antes de redirecionar
        await waitForMealProcessing(mealId);
        onSuccess(mealId);
        queryClient.refetchQueries({ queryKey: ["meals"] });
      } catch (error) {
        console.error("🚀 ~ useCreateMeal ~ error:", error);
        // Em caso de erro, ainda redireciona para a página de detalhes
        // onde o usuário verá a tela de erro se necessário
        onSuccess(mealId);
        queryClient.refetchQueries({ queryKey: ["meals"] });
      }
    },
  });

  return {
    createMeal,
    isPending
  };
}

// Função para aguardar o processamento da refeição
async function waitForMealProcessing(mealId: string): Promise<void> {
  const maxAttempts = 30; // 30 tentativas = 60 segundos
  const interval = 2000; // 2 segundos entre tentativas
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await mealsService.getById(mealId);
      const status = response.meal.status;
      
      console.log(`🚀 ~ waitForMealProcessing ~ attempt ${attempt + 1}, status:`, status);
      
      if (status === "success") {
        console.log("🚀 ~ waitForMealProcessing ~ refeição processada com sucesso");
        return;
      }
      
      if (status === "failed") {
        console.log("🚀 ~ waitForMealProcessing ~ refeição falhou no processamento");
        throw new Error("Falha no processamento da refeição");
      }
      
      // Aguardar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, interval));
      
    } catch (error) {
      console.log("🚀 ~ waitForMealProcessing ~ error:", error);
      if (attempt === maxAttempts - 1) {
        throw new Error("Timeout aguardando processamento da refeição");
      }
    }
  }
  
  throw new Error("Timeout aguardando processamento da refeição");
}
