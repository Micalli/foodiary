import { Text, View } from "react-native";

import "../../styles/global.css";
import { HomeHeader } from "../../components/HomeHeader";
import { MealsList } from "../../components/MealsList";
import { CreateMealBottonBar } from "../../components/CreateMealBottonBar";
import { useAuth } from "../../hooks/useAuth";
import { LoadingScreen } from "../../components/LoadingScreen";
export default function Page() {
  const { user } = useAuth();

  return (
    <>
        <View className="flex-1 bg-white">
          <HomeHeader />
          <MealsList />
          <CreateMealBottonBar />
        </View>
      
    </>
  );
}
