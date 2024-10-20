import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { StatusBar } from "expo-status-bar";
import StatusBarWrapper from "../components/statusBar";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import MenuButton from "../components/MenuButton";

const Home = ({ navigation }) => {
  return (
    <View className="bg-white h-full w-full">
      <StatusBarWrapper title="Home">
        <View className="w-full h-[70px] items-end p-3">
          <MenuButton
           handlePress={() => navigation.toggleDrawer()} 
           />
        </View>
      </StatusBarWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 50,
  },
});

export default Home;
