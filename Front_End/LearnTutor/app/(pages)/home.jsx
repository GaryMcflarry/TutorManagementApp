import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'


const home = () => {


  return (
    <SafeAreaView className="bg-white h-full">
    <ScrollView contentContainerStyle={{ height: "100%" }}>
      
      <View className="bg-primary h-20 justify-center items-center" style={styles.shadow}>
        <Text className="text-white font-pregular text-xs" style={styles.shadow}>14:43</Text>
        <Text className="text-white font-pregular text-2xl">Account</Text>
      </View>
      
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  shadow: {
      elevation: 50,
  }
})

export default home

