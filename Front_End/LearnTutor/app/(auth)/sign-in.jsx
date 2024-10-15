import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { getCurrentUser, createUser, login } from "../../lib/firebase";
import { useGlobalContext } from "../../context/GlobalProvider";

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
      setUser(result); //lowkey my token method
      setIsLoggedIn(true);

      Alert.alert('Login Success');
      router.replace("/home");

      // console.log(response);
    } catch (error) {
      // console.log(error);
      Alert.alert("Login has failed: ", error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Text className="text-tertiary font-pregular text-2xl">SignIp</Text>
        <KeyboardAvoidingView behavior="padding">
          <View className="h-[200px] w-full justify-center items-center bg-white">
            <TextInput
              className="bg-primary border-solid border-black w-[200px] h-[30px] my-6"
              value={email}
              placeholder="Email"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              className="bg-primary border-solid border-black w-[200px] h-[30px]"
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize="none"
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View className="h-[100px] w-full justify-center items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
              <CustomButton
                  title="Login"
                  handlePress={() => signIn()}
                  containerStyles="w-[110px] h-[62px] justify-center items-center" />
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;

const styles = StyleSheet.create({});
