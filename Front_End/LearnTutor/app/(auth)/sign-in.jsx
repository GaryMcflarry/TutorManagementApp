import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import {EmailField, PasswordField} from '../components/FormField';
import { Image } from '@rneui/themed';

const signIn = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
    <ScrollView contentContainerStyle={{ height: "100%" }}>
      
      <Image source={require('./../../assets/images/learnTutorLogo.png')} />
      
      <Text className="text-tertiary font-pregular text-2xl">SignIn</Text>

      <EmailField/>
      <PasswordField/>

    </ScrollView>
    </SafeAreaView>
  )
}

export default signIn

const styles = StyleSheet.create({})