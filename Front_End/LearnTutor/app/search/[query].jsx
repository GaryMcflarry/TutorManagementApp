import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import StatusBarWrapper from "../components/statusBar";
import { useNavigation } from "@react-navigation/native";
import ChatBubble from "../components/ChatBubble";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";
import {
  fetchMessages,
  sendMessage,
  fetchRecipientInfo,
} from "../../lib/firebase";
import useFirebase from "../../lib/useFirebase";
import { icons } from "../../constants";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef(); // Ref for the ScrollView

  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams();
  const { data: recipientInfo } = useFirebase(() => fetchRecipientInfo(query));

  useEffect(() => {
    const unsubscribe = fetchMessages(user.uid, query, setMessages);
    return () => unsubscribe(); // Unsubscribe from Firestore when the component unmounts
  }, [user.uid, query]);

  // Scroll to the bottom whenever a new message is added
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const isSending = useRef(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      isSending.current = true; // Mark as sending
      sendMessage(user.uid, query, newMessage).then(() => {
        isSending.current = false; // Mark as not sending after send is successful
        setNewMessage(""); // Clear input
  
        // Scroll to the end if the message was sent successfully
        if (!isSending.current) {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      });
    } else {
      Alert.alert("Input a message please!");
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
                {recipientInfo?.fullname
                  ? recipientInfo.fullname
                  : "Loading..."}
              </Text>
            </View>
            <View className="flex-1 p-5">
              <ScrollView
                ref={scrollViewRef} // Reference for the ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })} // Scroll to bottom on content size change
              >
                {messages.map((msg) => {
                  // Ensure the ChatBubble is rendered correctly
                  const messageTime = msg.timeStamp?.toDate(); // Convert Firestore timestamp to JavaScript Date
                  const formattedTime = messageTime?.toLocaleTimeString(); // Format the time as needed

                  return (
                    <ChatBubble
                      key={msg.id} // Ensure each message has a unique key
                      time={formattedTime} // Pass the formatted time
                      message={msg.message}
                      isSender={msg.fromId === user.uid} // Check if the user is the sender
                    />
                  );
                })}
              </ScrollView>
            </View>
            {/* Align FormField and CustomButton */}
            <View className="flex-row items-center bg-[#E5E5E5] px-5 py-3">
              <FormField
                value={newMessage}
                handleChangeText={(text) => setNewMessage(text)}
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
