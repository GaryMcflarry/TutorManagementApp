import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import { StatusBar } from "expo-status-bar";
import StatusBarWrapper from '../components/statusBar';



const home = () => {


  return (
    <View className="bg-white h-full w-full">
    <StatusBarWrapper>
      <Text>
        Home
      </Text>
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

