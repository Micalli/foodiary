import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { CameraIcon, CheckIcon, Trash2Icon, XIcon } from "lucide-react-native";
import { useRef, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { Button } from "./Button";
import { mealsService } from "../services/meals";
import { useMutation } from "@tanstack/react-query";
import { useCreateMeal } from "../hooks/useCreateMeal";
import { router } from "expo-router";
import { LoadingScreen } from "./LoadingScreen";

interface ICameraModalProps {
  open: boolean;
  onClose: () => void;
  changeModalFunction: () => void;
}

export function CameraModal({
  onClose,
  open,
  changeModalFunction,
}: ICameraModalProps) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const { createMeal, isPending } = useCreateMeal({
    fileType: "image/jpeg",
    onSuccess: (mealId) => {
      router.push(`/meals/${mealId}`);

      handleCloseModal();
    },
  });

  const cameraRef = useRef<CameraView>(null);

  function handleCloseModal() {
    onClose();
    setPhotoUri(null);
  }

  async function handleTakePicture() {
    if (!cameraRef.current) {
      return;
    }

    const { uri } = await cameraRef.current.takePictureAsync({
      imageType: "jpg",
    });

    setPhotoUri(uri);
  }

  function handleDeletePhoto() {
    setPhotoUri(null);
  }

  if (!permission) {
    return null;
  }

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
        {!permission.granted && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white text-center px-10 text-base font-sans-regular mb-4">
              Precisamos de permissão para acessar a câmera!
            </Text>
            <Button onPress={requestPermission}>Dar permissão</Button>
          </View>
        )}

        {permission.granted && (
          <SafeAreaProvider>
            <SafeAreaView className="flex-1">
              <View className="flex-row p-5">
                <Button size="icon" color="dark" onPress={handleCloseModal}>
                  <XIcon size={20} color={colors.gray[500]} />
                </Button>
              </View>

              {!photoUri && <CameraView ref={cameraRef} style={{ flex: 1 }} />}

              {photoUri && (
                <Image
                  source={{ uri: photoUri }}
                  className="flex-1"
                  resizeMode="contain"
                />
              )}

              {!photoUri && (
                <View className=" pt-6 items-center gap-2 pb-6">
                  <View className="flex-row">
                    <Button
                      size="icon"
                      color="dark-thin"
                      onPress={handleTakePicture}
                    >
                      <CameraIcon size={20} color={colors.lime[600]} />
                    </Button>
                  </View>

                  <Text className="text-gray-100 text-base font-sans-regular">
                    Tirar foto
                  </Text>
                </View>
              )}
              {!photoUri && (
                <TouchableOpacity className="" onPress={changeModalFunction}>
                  <View className="mb-10 flex-row justify-center text-center gap-2 ">
                    <Text className="text-white font-sans-light text-xs mt-  ">
                      Não pode falar agora ?
                    </Text>
                    <Text className="text-lime-500 font-sans-light text-xs mt- text-center underline ">
                      Escreva a refeição.
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {photoUri && (
                <View className="p-5 pt-6 items-center pb-12">
                  {isPending ? (
                    <LoadingScreen 
                      message="Processando refeição..." 
                      showLogo={false}
                    />
                  ) : (
                    <View className="flex-row justify-center gap-8">
                      <Button size="icon" color="dark" onPress={handleDeletePhoto}>
                        <Trash2Icon size={20} color={colors.gray[500]} />
                      </Button>
                      <Button
                        size="icon"
                        loading={isPending}
                        onPress={() => createMeal(photoUri)}
                      >
                        <CheckIcon size={20} color={colors.black[700]} />
                      </Button>
                    </View>
                  )}
                </View>
              )}
            </SafeAreaView>
          </SafeAreaProvider>
        )}
      </View>
    </Modal>
  );
}
