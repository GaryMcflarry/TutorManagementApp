import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'

const HomeWorkCard = ({ data }) => {
  return (
    <FlatList
    data={data}
    ListHeaderComponent={() => (
      <View className="my-6 px-4">
        <Text className="font-pmeduim text-sm text-gray-100">
          Search Results
        </Text>
        <Text className="text-2xl font-psemibold text-white">{data.subject}</Text>

        <View className="mt-6 mb-8"></View>
      </View>
    )}
    ListEmptyComponent={() => (
      <View>
        
      </View>
    )}
  />
  )
}

export default HomeWorkCard

const styles = StyleSheet.create({})