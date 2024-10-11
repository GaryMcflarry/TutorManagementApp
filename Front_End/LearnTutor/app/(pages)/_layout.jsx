import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
import Home from "./home";
import Admin from "./admin";
import TimeTable from "./timeTable";
import Conversations from "./conversations";
import Homework from "./homework";
import {icons} from "../../constants";

const _layout = () => {
  const Drawer = createDrawerNavigator();
  return (

    <Drawer.Navigator initialRouteName="Home" screenOptions={{
      drawerStyle: {
      justifyContent: 'left',
      backgroundColor: '#FEA07D',
      width: 180
    },
    drawerPosition: 'right',
    drawerType: 'front',
    drawerLabelStyle: {
      color: "white",
      fontWeight: "bold",
      marginLeft: -20
    },
    drawerItemStyle: {
      backgroundColor: "#4F7978",
      shadow: {
      elevation: 1,
      },
      marginTop: 15
    }
    }}>
      <Drawer.Screen drawerIcon name="Home" component={Home} options={{ 
        headerShown: false,
        drawerIcon: config => <Icon
                size={30}
                name={'home-outline'}
                color={'white'}></Icon>
       }} />
      <Drawer.Screen name="Admin" component={Admin} options={{ 
        headerShown: false,
        drawerIcon: config => <Icon
                size={30}
                name={'person-outline'}
                color={'white'}></Icon>
       }}/>
      <Drawer.Screen name="TimeTable" component={TimeTable} options={{ 
        headerShown: false,
        drawerIcon: config => <Icon
                size={30}
                name={'calendar-outline'}
                color={'white'}></Icon>
       }}/>
      <Drawer.Screen name="Homework" component={Homework} options={{ 
        headerShown: false,
        drawerIcon: config => <Icon
                size={30}
                name={'book-outline'}
                color={'white'}></Icon>
       }}/>
      <Drawer.Screen name="Chats" component={Conversations} options={{ 
        headerShown: false,
        drawerIcon: config => <Icon
                size={30}
                name={'chatbubble-outline'}
                color={'white'}></Icon>
       }}/>
    </Drawer.Navigator>

  )
}

export default _layout

const styles = StyleSheet.create({})