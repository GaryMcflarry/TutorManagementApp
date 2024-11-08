import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { icons } from '../../constants'

const ConversationBar = ({ title, handlePress, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="bg-primary h-12 md:h-[70px] w-[90%] my-5 border-none rounded-md flex-row items-center p-3"
      style={styles.shadow}
      disabled={isLoading}
    >
      <View className="bg-gray-300 h-10 w-10 justify-center items-center mr-4 border-none rounded-full">
        <Image source={icons.profile} className="h-7 w-7 " />
      </View>
      <Text className="text-white font-psemibold text-base md:text-xl flex-1">{title}</Text>
      <Image source={icons.rightArrow} />
    </TouchableOpacity>
  )
}

// Nativewind Shadow doesn't work for android devices on nativewind.
const styles = StyleSheet.create({
  shadow: {
    // For Android
    elevation: 5,
    shadowColor: '#000000',
  },
})

export default ConversationBar
