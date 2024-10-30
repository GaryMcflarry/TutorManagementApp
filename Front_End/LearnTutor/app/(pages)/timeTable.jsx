import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StatusBarWrapper from '../components/statusBar';
import MenuButton from "../components/MenuButton";
import ResourceCard from '../components/ResourceCard';


const TimeTable = ({ navigation }) => {
  return (

    <View className="bg-white h-full w-full">
      <StatusBarWrapper title="TimeTable">

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

export default TimeTable

const styles = StyleSheet.create({})