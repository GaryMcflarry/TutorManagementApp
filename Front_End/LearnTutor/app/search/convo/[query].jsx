import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import MenuButton from "../../components/MenuButton";
import SearchInput from "../../components/SearchInput";
import Conversationbar from "../../components/ConversationBar"
import { router } from 'expo-router';
import StatusBarWrapper from '../../components/statusBar';


const Conversations = ({ navigation }) => {
  return (

    <View>
      <StatusBarWrapper title="Chats">
      <ScrollView>
        <View className="w-full h-[70px] items-end p-3">
          <MenuButton
           handlePress={() => navigation.toggleDrawer()} 
           />
        </View>
        <View className="w-full h-full">
          <View className="w-full h-[70px] justify-center items-center">
            <SearchInput />
          </View>
          <View className="w-full h-full bg-transparent justify-start items-center">
            <Conversationbar title='Tutor Name' handlePress={router.replace("/chat")} />
            <Conversationbar title='Tutor Name' handlePress={router.replace("/chat")}/>
            <Conversationbar title='Tutor Name' handlePress={router.replace("/chat")}/>
            <Conversationbar title='Tutor Name' handlePress={router.replace("/chat")}/>
            <Conversationbar title='Tutor Name' handlePress={router.replace("/chat")}/>
          </View>
        </View>
        </ScrollView>
      </StatusBarWrapper>
    </View>
  )
}

export default Conversations

const styles = StyleSheet.create({})