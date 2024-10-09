import { TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from "react-native"

//creating custom function to be use accross all pages (component)
//params
const CustomButton = ({title, handlePress, containerStyles, isLoading}) => {
  //component structure
  return (
    <TouchableOpacity 
    //press functionality 
    onPress={handlePress}
    activeOpacity={0.7}
    className={`bg-tertiary ${containerStyles} `}
    style={styles.shadow}
    //good for disabling the button while the app is still loading
    disabled={isLoading}>
      <Text className={`text-white font-psemibold text-lg`}>{title}</Text>
    </TouchableOpacity>
  )
}

//nativewind Shadow doesn't work for android devices on nativewind.
const styles = StyleSheet.create({
  shadow: {
      elevation: 20,
  }
})

//allowing it to be used
export default CustomButton