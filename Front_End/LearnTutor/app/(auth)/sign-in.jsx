import {
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { getCurrentUser, createUser, login } from "../../lib/firebase";
import { useGlobalContext } from "../../context/GlobalProvider";
import FormField from "../components/FormField";

const signIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all the fields");
      return null;
    }

    setLoading(true);

    try {
      await login(email, password);

      const result = await getCurrentUser();
      // console.log(result.status);
      setUser(result); //lowkey my token method
      setIsLoggedIn(true);

      Alert.alert("Login Success");

      // console.log("Redirecting based on status:", result.status);

      if (result.status === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/home");
      }

      // console.log(response);
    } catch (error) {
      // console.log(error);
      Alert.alert("Login has failed: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full my-[17%] justify-center items-center">
          <Text className="text-7xl font-pregular text-white mt-[7%] text-center">
            learn.
          </Text>
        </View>
        <View className="justify-center items-center">
          <FormField
            value={email}
            placeholder="Enter Email"
            handleChangeText={(text) => setEmail(text)}
          />
          <FormField
            value={password}
            placeholder="Enter Password"
            handleChangeText={(text) => setPassword(text)}
          />

          <View className="w-[80%] md:w-[60%] justify-center items-center mt-14 h-[2%] bg-tertiary rounded-md"></View>
          <View className="w-[40%] md:w-[20%] justify-center items-center mt-10 h-[2%] bg-tertiary rounded-md"></View>
        </View>

        <View className="h-[100px] w-full justify-center items-center mt-5">
          {loading ? (
            <ActivityIndicator size="large" color="#4F7978" />
          ) : (
            <>
              <CustomButton
                title="Login"
                handlePress={() => signIn()}
                containerStyles="w-[40%] md:w-[30%] h-[65%] justify-center items-center border-none rounded-md"
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
