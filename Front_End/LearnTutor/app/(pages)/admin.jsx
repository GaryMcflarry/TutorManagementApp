import { StyleSheet, Text, View } from "react-native";
import React from "react";
import StatusBarWrapper from "../components/statusBar";
import MenuButton from "../components/MenuButton";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Admin = ({ navigation }) => {
  return (
    <SafeAreaView>
      <StatusBarWrapper title="Admin">
        <View className="w-full h-[70px] items-end p-3">
          <MenuButton handlePress={() => navigation.toggleDrawer()} />
        </View>
        <View>
          <CustomButton
            title="+"
            containerStyles="h-6 w-6"
            handlePress={() => router.push("sign-up")}
          />
        </View>
      </StatusBarWrapper>
    </SafeAreaView>
  );
};

export default Admin;

const styles = StyleSheet.create({});
