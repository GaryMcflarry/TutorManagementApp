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
import React, {useEffect, useState} from "react";
import { StatusBar } from "expo-status-bar";
import StatusBarWrapper from "../components/statusBar";
import { router } from "expo-router";
import { icons } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import ChatBubble from "../components/ChatBubble";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";
import { fetchMessages, sendMessage, fetchRecipientInfo } from "../../lib/firebase";
import useFirebase from "../../lib/useFirebase";


const Chat = () => {

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { user } = useGlobalContext();
  const { tutorId } = useLocalSearchParams();
  const { data: recipientInfo } = useFirebase(() => fetchRecipientInfo(tutorId));


  useEffect(() => {
    const unsubscribe = fetchMessages(user.uid, tutorId, setMessages);
    return () => unsubscribe(); // Unsubscribe from Firestore when the component unmounts
  }, [user.uid, tutorId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(user.uid, tutorId, newMessage);
      setNewMessage(""); // Clear input
    }
  };

  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      className="bg-white h-full w-full"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="flex-1">
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
          <View className="flex-1 w-full">
            <View className="h-12 w-full justify-center">
              <Text className="text-primary text-2xl ml-10 font-bold">
                {recipientInfo?.fullname ? recipientInfo.fullname : "Loading..."}
              </Text>
            </View>
            <View className="flex-1 p-5">
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
              {messages.map((msg) => {
                if (msg.toId === user.uid) {
                <ChatBubble
                  time={msg.timeStamp}
                  message={msg.message}
                  isSender={true}
                />
                } else {
                  <ChatBubble
                  time={msg.timeStamp}
                  message={msg.message}
                  isSender={false}
                />
                }
              })}
              </ScrollView>
            </View>
            {/* Align FormField and CustomButton */}
            <View className="flex-row items-center bg-[#E5E5E5] px-5 py-3">
              <FormField
                placeholder="Insert Text here..."
                className="flex-1 mr-3"
              />
              <CustomButton
                title="Send"
                containerStyles="w-12 h-12 rounded-full justify-center items-center ml-5"
                handlePress={() => handleSendMessage()}
              />
            </View>
          </View>
        </StatusBarWrapper>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // You can keep your styles here if needed, but with Tailwind, you might not need them much.
});

export default Chat;
