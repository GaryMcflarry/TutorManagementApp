import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import StatusBarWrapper from '../components/statusBar';
import MenuButton from "../components/MenuButton";
import HomeWorkCard from "../components/HomeWorkCard";

  const data = {
    Subject: "English",
    Tutor: "KSI",
    Homework: [
      "Do Activity 1.3.", 
      "Do the last section of Activity 5", 
      "Read up on the theory of rlativty in the prescribed textbook"
    ],
    dueDate: "10 October"
  }



const Homework = ({ navigation }) => {
  return (
    <View>
      <StatusBarWrapper title="Homework">
        <View className="w-full h-[70px] items-end p-3">
          <MenuButton
           handlePress={() => navigation.toggleDrawer()} 
           />
        </View>
        <ScrollView className="bg-teal-500 w-full h-full">
        <View className="h-full w-full justify-start items-center p-3">
          <HomeWorkCard data={data} />
        </View>
        </ScrollView>
      </StatusBarWrapper>
    </View>
  )
}

export default Homework

const styles = StyleSheet.create({})