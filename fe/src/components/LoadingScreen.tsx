import { ActivityIndicator, Text, View } from "react-native";
import { Logo } from "./Logo";

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
}

export function LoadingScreen({ message, showLogo = true }: LoadingScreenProps) {
  return (
    <View className="bg-lime-700 flex-1 justify-center items-center gap-12">
      {showLogo && <Logo height={60} width={187} />}
      <ActivityIndicator color="#fff" size={'large'} />
      {message && (
        <Text className="text-white font-sans-medium text-base text-center px-8">
          {message}
        </Text>
      )}
    </View>
  );
}
