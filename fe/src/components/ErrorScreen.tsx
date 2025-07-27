import { ActivityIndicator, Modal, Text, View } from "react-native";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { X, XIcon } from "lucide-react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { router } from 'expo-router';
interface IAudioModalProps {
  open: boolean;
  onClose: () => void;
}
export function ErrorScreen({ onClose, open }: IAudioModalProps) {
  async function handleCloseModal() {
    onClose();
    router.back()
  }
  return (
    <Modal
      transparent
      statusBarTranslucent
      onRequestClose={handleCloseModal}
      visible={open}
      animationType="slide"
    >
      <View className="bg-support-red flex-1 ">
        <View className="flex-row  p-6 ">
          <Button size="icon" color="dark" onPress={handleCloseModal}>
            <XIcon size={30} color={colors.gray[500]} />
          </Button>
        </View>
        <View className="flex-1 items-center justify-center gap-3 ">
          <Text className="text-white font-sans-semibold text-2xl">
            Ocorreu uma falha.
          </Text>
          <Text className="text-white font-sans-light text-xs ">
            Tente novamente ou entre em contato conosco.
          </Text>
          <View className="mt-5">
            <X color={"#fff"} width={40} height={50} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
