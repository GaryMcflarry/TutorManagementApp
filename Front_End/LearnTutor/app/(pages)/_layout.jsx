import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./home";
import Admin from "./admin";
import TimeTable from "./timeTable";
import Conversations from "./conversations";
import Homework from "./homework";


const _layout = () => {
  const Drawer = createDrawerNavigator();
  return (

    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Drawer.Screen name="Admin" component={Admin} />
      <Drawer.Screen name="TimeTable" component={TimeTable} />
      <Drawer.Screen name="Homework" component={Homework} />
      <Drawer.Screen name="Conversations" component={Conversations} />
    </Drawer.Navigator>

  )
}

export default _layout

const styles = StyleSheet.create({})