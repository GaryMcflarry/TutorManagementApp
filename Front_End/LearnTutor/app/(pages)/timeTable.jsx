import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StatusBarWrapper from '../components/statusBar'

const TimeTable = () => {
  return (

    <View className="bg-white h-full w-full">
      <StatusBarWrapper title="TimeTable">
        <Text>timeTable</Text>
      </StatusBarWrapper>

    </View>
  )
}

export default TimeTable

const styles = StyleSheet.create({})