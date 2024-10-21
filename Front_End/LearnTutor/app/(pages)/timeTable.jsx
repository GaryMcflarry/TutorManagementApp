import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StatusBarWrapper from '../components/statusBar';
import MenuButton from "../components/MenuButton";
import ResourceCard from '../components/ResourceCard';


const TimeTable = ({ navigation }) => {
  return (

    <View className="bg-white h-full w-full">
      <StatusBarWrapper title="TimeTable">
        <View className="w-full h-[70px] items-end p-3">
          <MenuButton
           handlePress={() => navigation.toggleDrawer()} 
           />
        </View>
        <ResourceCard>
          
        </ResourceCard>
      </StatusBarWrapper>

    </View>
  )
}

export default TimeTable

const styles = StyleSheet.create({})