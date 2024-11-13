import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { icons } from "../../constants";

const ChatBubble = ({ message, time, isSender }) => {
  return (
    <View className={`flex flex-row items-end my-2 ${isSender ? 'justify-start' : 'justify-end'}`}>
      {/* Display avatar for the sender (reverse the avatar display logic) */}
      {isSender && (
        <View className="w-8 h-8 md:w-12 md:h-12 bg-gray-300 rounded-full mr-2 self-end">
          <Image source={icons.profile} className="w-full h-full rounded-full" />
        </View>
      )}  
      {/* Container for the chat bubble and timestamp */}
      <View style={styles.bubbleContainer}>
        {/* Chat bubble */}
        <View
          style={[
            styles.shadow,
            styles.chatBubble,
            isSender ? styles.senderBubble : styles.receiverBubble,
          ]}
        >
          <Text className="font-semibold text-base md:text-xl text-white">{message}</Text>
          <View style={[styles.bubbleTip, isSender ? styles.tipLeft : styles.tipRight]} />
        </View>

        {/* Timestamp below the chat bubble, aligned opposite to the profile icon */}
        <Text className="font-semibold text-sm md:text-lg text-[#666] mt-4" 
        style={[isSender ? styles.timeRight : styles.timeLeft]}>
          {time}
        </Text>
      </View>

      {/* Display avatar for the receiver */}
      {!isSender && (
        <View className="w-8 h-8 md:w-12 md:h-12 bg-gray-300 rounded-full ml-2 self-end">
          <Image source={icons.profile} className="w-full h-full rounded-full" />
        </View>
      )}
    </View>
  );
};

// Styles for the chat bubble and other elements
const styles = StyleSheet.create({
  //Bubble styles
  bubbleContainer: {
    maxWidth: '80%', 
    marginVertical: 2,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 20,
    position: 'relative',
  },
  senderBubble: {
    backgroundColor: '#4F7978',
    borderBottomLeftRadius: 4,
  },
  receiverBubble: {
    backgroundColor: '#FEA07D' , 
    borderBottomRightRadius: 4,
  },
  bubbleTip: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderWidth: 6,
    borderStyle: 'solid',
  },
  tipLeft: {
    left: -12,
    bottom: 0,
    borderColor: 'transparent',
    borderLeftColor: '#FEA07D',
    borderTopColor: 'transparent',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tipRight: {
    right: -12,
    bottom: 0,
    borderColor: 'transparent',
    borderRightColor: '#4F7978',
    borderTopColor: 'transparent',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  timeLeft: {
    textAlign: 'left',
    marginLeft: 10,
  },
  timeRight: {
    textAlign: 'right',
    marginRight: 10,
  },
  shadow: {
    // For Android shadow styling
    elevation: 10,
    shadowColor: '#000000',
  },
});

export default ChatBubble;
