import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { StatusBar } from "expo-status-bar";
import StatusBarWrapper from "../components/statusBar";
import { Redirect, router } from "expo-router";
import { icons } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import ChatBubble from "../components/ChatBubble";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";

const Chat = () => {
  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView className="bg-white h-full w-full" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBarWrapper title="Chat">
          <View className="w-full h-[70px] justify-center items-start p-3">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image source={icons.leftArrow} />
            </TouchableOpacity>
          </View>
          <View className="h-full w-full">
            <View className="h-12 w-full justify-center">
              <Text className="text-primary text-2xl ml-10 font-bold">
                Tutor Name
              </Text>
            </View>
            <View className="p-5 h-[65%]">
              <ScrollView>
                <ChatBubble
                  time="14:00"
                  message="Im going on the talk tuah podcast!!!"
                  isSender={false}
                />
                <ChatBubble
                  time="14:00"
                  message="NO WAY (Drinks prime)!!!"
                  isSender={true}
                />
              </ScrollView>
            </View>
            <View className="bg-gray-200 h-[100px] flex-row ">
              <FormField placeholder="Insert Text here..." />
              <CustomButton
                title="yes"
                containerStyles="w-12 h-12 rounded-full  justify-center items-center"
              />
            </View>
          </View>
        </StatusBarWrapper>
    </KeyboardAvoidingView>
  );
};

export default Chat;
