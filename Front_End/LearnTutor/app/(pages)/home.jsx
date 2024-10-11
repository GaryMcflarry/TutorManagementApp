import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import { StatusBar } from "expo-status-bar";



const home = () => {


  return (
    <View className="bg-white h-full w-full">
    <ScrollView contentContainerStyle={{ height: "100%" }}>
      
      <View className="bg-primary h-20 justify-center items-center mt-5" style={styles.shadow}>
        {/* <Text className="text-white font-pregular text-xs" style={styles.shadow}>14:43</Text> */}
        <Text className="text-white font-pregular text-xl">Account</Text>
      </View>
      
    </ScrollView>
    <StatusBar backgroundColor="#FEA07D" style="light" />
    </View>
  )
}

const styles = StyleSheet.create({
  shadow: {
      elevation: 50,
  }
})

export default home

