import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from "../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

const home = ({ navigation }) => {
  return (
    <SafeAreaView>
    <View>
      <Text>home</Text>
      <CustomButton
              title="Continue"
              handlePress={() => navigation.toggleDrawer()}
              containerStyles="w-[110px] h-[62px] justify-center items-center"
            />
    </View>
    </SafeAreaView>
  )
}

export default home

const styles = StyleSheet.create({})