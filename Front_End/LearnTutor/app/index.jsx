//Cover page of the application;
import { ScrollView, Text, View, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import CustomButton from "./components/CustomButton";


export default function App() {

  return (
    <SafeAreaView className="bg-primary h-full w-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="h-full w-full justify-center items-center">
            <Text className="text-tertiary font-pregular text-2xl">Index</Text>
            <CustomButton
              title="Continue"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-[110px] h-[62px] justify-center items-center"
            />
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}
