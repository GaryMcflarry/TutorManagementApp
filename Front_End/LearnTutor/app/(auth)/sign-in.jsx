import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
const signIn = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
    <ScrollView contentContainerStyle={{ height: "100%" }}>
      <Text className="text-tertiary font-pregular text-2xl">SignUp</Text>
    </ScrollView>
    </SafeAreaView>
  )
}

export default signIn

const styles = StyleSheet.create({})