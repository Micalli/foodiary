import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View, Animated, Easing } from "react-native";
import { useRef, useState } from "react";
import { colors } from "../styles/colors";
import { formatDate } from "../utils/formatDate";

interface IDateSwitcherProps {
  currentDate: Date;
  onPreviousDate(): void;
  onNextDate(): void;
}

export function DateSwitcher({
  currentDate,
  onNextDate,
  onPreviousDate,
}: IDateSwitcherProps) {
  const [direction, setDirection] = useState<"left" | "right">("right");
  const slideAnim = useRef(new Animated.Value(0)).current; // posição X
  const opacityAnim = useRef(new Animated.Value(1)).current; // opacidade

  function animate(to: "left" | "right", callback: () => void) {
    setDirection(to);

    // Sai para o lado
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(slideAnim, {
        toValue: to === "left" ? 50 : -50,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start(() => {
      callback(); // muda a data

      // Volta do outro lado
      slideAnim.setValue(to === "left" ? -50 : 50);
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }
const isToday = currentDate.toDateString() === new Date().toDateString();
  return (
    <View className="px-2 mt-3 flex-row items-center justify-between">
      <TouchableOpacity
        className="size-12 items-center justify-center"
        onPress={() => animate("left", onPreviousDate)}
      >
        <ChevronLeftIcon size={20} color={colors.black[700]} />
      </TouchableOpacity>

      <Animated.Text
        className="text-base font-sans-medium text-gray-700 tracking-[1.28px]"
        style={{
          opacity: opacityAnim,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {formatDate(new Date(currentDate))}
      </Animated.Text>

      <TouchableOpacity
        className={`size-12 items-center justify-center ${isToday}`}
        onPress={() => animate("right", onNextDate)}
        disabled={isToday}
      >
        <ChevronRightIcon size={20} color={isToday ? colors.gray[500] : colors.black[700]} />
      </TouchableOpacity>
    </View>
  );
}
