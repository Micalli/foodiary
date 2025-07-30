import { CameraIcon, MicIcon, SquarePen } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "./Button";
import { useState } from "react";
import { AudioModal } from "./AudioModal";
import { CameraModal } from "./CameraModal";
import { WriteMealModal } from "./WriteMealModal";

export function CreateMealBottonBar() {
  const { bottom } = useSafeAreaInsets();
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  function changeModalFunction() {
    setIsPictureModalOpen(false);
    setIsAudioModalOpen(false);

    setIsWriteModalOpen(true);
  }

  return (
    <View
      className="absolute bg-white z-10 w-full bottom-0 border-t border-gray-400"
      style={{ height: 80 + bottom }}
    >
      <View className="flex-row mx-auto gap-10 mt-4">
        <Button
          size="icon"
          color="default"
          onPress={() => setIsAudioModalOpen(true)}
        >
          <MicIcon />
        </Button>

        <Button
          size="icon"
          color="default"
          onPress={() => setIsPictureModalOpen(true)}
        >
          <CameraIcon />
        </Button>
        <Button
          size="icon"
          color="default"
          onPress={() => setIsWriteModalOpen(true)}
        >
          <SquarePen />
        </Button>
      </View>

      <AudioModal
        changeModalFunction={changeModalFunction}
        open={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />

      <CameraModal
        changeModalFunction={changeModalFunction}
        open={isPictureModalOpen}
        onClose={() => setIsPictureModalOpen(false)}
      />
      <WriteMealModal
        open={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      />
    </View>
  );
}
