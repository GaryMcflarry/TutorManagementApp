import { StyleSheet } from 'react-native';
import React from 'react';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
import Home from "./home";
import Admin from "./admin";
import TimeTable from "./timeTable";
import Conversations from "./conversations";
import Homework from "./homework";
import { useGlobalContext } from "../../context/GlobalProvider";

const Drawer = createDrawerNavigator();

const _layout = () => {
  const { user } = useGlobalContext();

  return (
      <Drawer.Navigator 
        initialRouteName="Home" 
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#FEA07D',
            width: 200,
          },
          drawerPosition: 'right',
          drawerType: 'front',
          drawerLabelStyle: {
            color: "white",
            fontWeight: "bold",
            marginLeft: -20,
          },
          drawerItemStyle: {
            backgroundColor: "#4F7978",
            marginTop: 15,
          },
        }}
      >
        {user.status === "admin" ? (
          <>
            <Drawer.Screen 
              name="Admin" 
              component={Admin} 
              options={{ 
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon name="person-outline" color="white" size={size} />
                ),
              }}
            />
            <Drawer.Screen 
              name="Home" 
              component={Home} 
              options={{ 
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon name="home-outline" color="white" size={size} />
                ),
              }}
            />
          </>
        ) : (
          <>
            <Drawer.Screen 
              name="Home" 
              component={Home} 
              options={{ 
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <Icon name="home-outline" color="white" size={size} />
                ),
              }}
            />
          </>
        )}
        <Drawer.Screen 
          name="TimeTable" 
          component={TimeTable} 
          options={{
            headerShown: false,
            drawerIcon: ({ color, size }) => (
              <Icon name="calendar-outline" color="white" size={size} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Homework" 
          component={Homework} 
          options={{ 
            headerShown: false,
            drawerIcon: ({ color, size }) => (
              <Icon name="book-outline" color="white" size={size} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Chats" 
          component={Conversations} 
          options={{ 
            headerShown: false,
            drawerIcon: ({ color, size }) => (
              <Icon name="chatbubble-outline" color="white" size={size} />
            ),
          }}
        />
      </Drawer.Navigator>
  );
};

export default _layout;

const styles = StyleSheet.create({});
