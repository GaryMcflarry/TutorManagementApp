import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import StatusBarWrapper from "../components/statusBar";
import MenuButton from "../components/MenuButton";
import SearchInput from "../components/SearchInput";
import Conversationbar from "../components/ConversationBar";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Conversations = ({ navigation }) => {
  return (
    <SafeAreaView>
      <StatusBarWrapper title="Chats">
        <ScrollView>
          <View className="w-full h-[70px] items-end p-3">
            <MenuButton handlePress={() => navigation.toggleDrawer()} />
          </View>
          <View className="w-full h-full">
            <View className="w-full h-[70px] justify-center items-center">
              <SearchInput />
            </View>
            <View className="w-full h-full bg-transparent justify-start items-center">
              <Conversationbar
                title="Tutor Name"
                handlePress={() => router.push("/search/[1]")}
              />
            </View>
          </View>
        </ScrollView>
      </StatusBarWrapper>
    </SafeAreaView>
  );
};

export default Conversations;
