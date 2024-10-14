import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StatusBarWrapper from '../components/statusBar'

const timeTable = () => {
  return (
    <View className="bg-white h-full w-full">
      <StatusBarWrapper>
        <Text>timeTable</Text>
      </StatusBarWrapper>
    </View>
  )
}

export default timeTable

const styles = StyleSheet.create({})