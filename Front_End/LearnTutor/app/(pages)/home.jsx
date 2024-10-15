import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import { StatusBar } from "expo-status-bar";
import StatusBarWrapper from '../components/statusBar';
import CustomButton from '../components/CustomButton';
import { Redirect, router } from "expo-router";





const home = () => {


  return (
    <View className="bg-white h-full w-full">
    <StatusBarWrapper title="Home">
      <Text>
        Home
      </Text>
      <CustomButton
          title="Time Table"
          handlePress={() => router.push("/timeTable")}
          containerStyles="w-[110px] h-[62px]"
        />
         <CustomButton
              title="Menu But"
              handlePress={() => navigation.toggleDrawer()}
              containerStyles="w-[110px] h-[62px] justify-center items-center"
            />
    </StatusBarWrapper>
    </View>
  )
}


const styles = StyleSheet.create({
  shadow: {
      elevation: 50,
  }
})

export default home


