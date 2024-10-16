import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import {EmailField, PasswordField} from '../components/FormField';
import { Image } from '@rneui/themed';
import CustomButton from '../components/CustomButton';

const signIn = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
    <ScrollView contentContainerStyle={{ height: "100%" }}>
    <View className="h-full w-full justify-center items-center">
      
      <Image source={require('./../../assets/images/learnTutorLogo.png')} />
      
      <Text className="text-tertiary font-pregular text-2xl">SignIn</Text>

      <EmailField/>
      <PasswordField/>

      <CustomButton
          title="Continue"
          handlePress={() => router.push("/sign-in")}
          containerStyles="w-[110px] h-[62px]"
          // style={styles.signInBut}
      />
      
      <Text className="text-white">Forgot your password?</Text>


    </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default signIn

const styles = StyleSheet.create({
  signInBut: {
    marginTop: 100,
  }
})