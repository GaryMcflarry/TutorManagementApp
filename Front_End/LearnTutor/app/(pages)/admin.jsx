import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import StatusBarWrapper from '../components/statusBar';
import MenuButton from "../components/MenuButton";



const Admin = ({ navigation }) => {
  return (
    <View>
      <StatusBarWrapper title="Admin">
        <View className="w-full h-[70px] items-end p-3">
          <MenuButton
           handlePress={() => navigation.toggleDrawer()} 
           />
        </View>
      </StatusBarWrapper>
    </View>
  )
}

export default Admin

const styles = StyleSheet.create({})