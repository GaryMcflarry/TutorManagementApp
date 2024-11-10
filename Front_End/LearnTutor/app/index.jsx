import { ScrollView, Text, View, Image } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import CustomButton from "./components/CustomButton";

export default function App() {
  // the global state of current logged-in user
  const { isLoading, isLoggedIn } = useGlobalContext();

  // if user is logged in already and the loading is done
  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <View className="w-full my-[20%] justify-center items-center">
        {/* Responsive text size using Tailwind responsive classes */}
        <Text className="text-5xl md:text-8xl font-pregular text-white mt-7 text-center">
          learn.
        </Text>
      </View>
      <View className="w-full h-[30%] justify-center items-center">
        <Image
          className="h-[100%] w-[80%] md:h-[100%] md:w-[60%]"
          source={images.EducationLogo}
        />
      </View>
      <View className="w-full mt-[10%] mb-[10%] justify-center items-center">
        <Text className="text-base md:text-2xl font-pregular font-bold text-white text-center">
          Management for Students and Tutors alike.
        </Text>
      </View>
      <View className="w-full h-[10%] justify-center items-center">
        <CustomButton
          title="Continue"
          handlePress={() => router.push("/sign-in")}
          containerStyles="w-[55%] h-[85%] justify-center items-center rounded-full"
        />
      </View>
    </SafeAreaView>
  );
}
