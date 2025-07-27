import { ActivityIndicator, View } from "react-native";
import { Logo } from "./Logo";

export function LoadingScreen() {
  return (
    <View className="bg-lime-700 flex-1 justify-center items-center gap-12">
      <Logo height={60} width={187} />
      <ActivityIndicator color="#fff" size={'large'} />
    </View>
  );
}
