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
        <View className="w-full my-20 justify-center items-center">
          <Text className="text-7xl font-pregular text-white mt-7 text-center">
            learn.
          </Text>
        </View>
        <View className="w-full  justify-center items-center">
          <Image
            className="h-[130px] w-[170px]"
            source={images.EducationLogo}
          />
        </View>
        <View className="w-full mt-10 mb-20 justify-center items-center">
          <Text className="text-lg font-pregular font-bold text-white text-center">
            Managment Application for Student and Tutor needs.
          </Text>
        </View>
        <View className="w-full justify-center items-center">
        <CustomButton
          title="Continue"
          handlePress={() => router.push("/sign-in")}
          containerStyles="w-[200px] h-[60px] justify-center items-center rounded-full"
        />
        
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
