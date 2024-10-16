import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import { StatusBar } from "expo-status-bar";
import StatusBarWrapper from '../components/statusBar';
import CustomButton from '../components/CustomButton';
import { Redirect, router } from "expo-router";
import TimeTableCard from '../components/TimeTableCard';





const Home = () => {


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

      <TimeTableCard 
        time="14:00 - 15:00" 
        tutorName="Tutor Name" 
        sessionType="Online" 
        subject="Science" 
        online
      />

      <TimeTableCard 
        time="16:00 - 17:00" 
        tutorName="Tutor Name" 
        sessionType="Offline" 
        subject="Mathematics"
      />

      <TimeTableCard 
        time="18:00 - 19:00" 
        sessionType="No Session"
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

export default Home


