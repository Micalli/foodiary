import { ImageBackground, Text, View } from "react-native";
import { Logo } from "../../components/Logo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { Link } from "expo-router";

export default function Greeting() {
  return (
    <ImageBackground
      source={require("../../assets/onboarding-bg/onboarding-bg.png")}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-between">
          <View className="mx-auto mt-4">
            <Logo width={150} height={41} />
          </View>

          <View className="w-full items-center">
            <Text className="font-sans-semibold text-[32px] text-white text-center w-[311px] ">
              Controle sua dieta de forma simples
            </Text>

            <View className="p-5 w-full mt-4">
              <Link href="/signup" asChild>
                <Button className="w-full">Criar conta</Button>
              </Link>
            </View>
            <View className="mt=[30px] flex-row items-center gap-2 justify-center">
              <Text className="text-white font-sans-regular text-base">
                Já tem conta?{" "}
              </Text>
              <Link href="/signin" >
                <Text className="text-lime-500 font-sans-medium text-base">
                  Acesse agora!
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
