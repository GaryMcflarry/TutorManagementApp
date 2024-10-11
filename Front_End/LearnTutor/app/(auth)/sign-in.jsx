import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react';
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '../components/CustomButton';
const signIn = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
    <ScrollView contentContainerStyle={{ height: "100%" }}>
      <Text className="text-tertiary font-pregular text-2xl">SignIp</Text>
      <CustomButton title="Home" handlePress={() => router.push("/home")}
              containerStyles="w-[110px] h-[62px] justify-center items-center"/>
    </ScrollView>
    </SafeAreaView>
  )
}

export default signIn

const styles = StyleSheet.create({})