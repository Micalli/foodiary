import { StatusBar } from "expo-status-bar";
import { XIcon, CheckIcon } from "lucide-react-native";
import { useState } from "react";
import { Alert, Modal, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { Input } from "./Input";
import { useCreateMeal } from "../hooks/useCreateMeal";
import { router } from "expo-router";
import { LoadingScreen } from "./LoadingScreen";

interface IAudioModalProps {
  open: boolean;
  onClose: () => void;
}

export function WriteMealModal({ onClose, open }: IAudioModalProps) {
  const [mealText, setMealText] = useState("");

  function handleCloseModal() {
    setMealText("");
    onClose();
  }

  const { createMeal, isPending } = useCreateMeal({
    fileType: "text",
    text: mealText,
    onSuccess: (mealId) => {
      router.push(`/meals/${mealId}`);
      handleCloseModal();
    },
  });

  return (
    <Modal
      transparent
      statusBarTranslucent
      onRequestClose={handleCloseModal}
      visible={open}
      animationType="slide"
    >
      <StatusBar style="light" />
      <View className="bg-black flex-1">
        <View className="flex-row p-5">
          <Button size="icon" color="dark" onPress={handleCloseModal}>
            <XIcon size={20} color={colors.gray[500]} />
          </Button>
        </View>

        <View className="flex-1  justify-center px-8 gap-5">
          <Text className="text-white text-base text-center items-center font-sans-regular mb-8  w-full px-5">
            Descreva sua refeição. Ex: 100g de Arroz, 2 Ovos e 100g de Salada
          </Text>

          <Input
            placeholder="Digite aqui..."
            value={mealText}
            onChangeText={setMealText}
            multiline
            numberOfLines={4}
            maxLength={75}
            className="bg-white/80 text-black-700 min-h-[100px] max-h-[140px]  text-start"
          />
        </View>

        <View className=" mt-20 items-center mb-20">
          {isPending ? (
            <LoadingScreen 
              message="Processando refeição..." 
              showLogo={false}
            />
          ) : (
            <View className="flex-row justify-center">
              <Button
                size="icon"
                onPress={() => createMeal(mealText)}
                loading={isPending}
                disabled={!mealText.trim() || isPending}
              >
                <CheckIcon size={20} color={colors.black[700]} />
              </Button>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
