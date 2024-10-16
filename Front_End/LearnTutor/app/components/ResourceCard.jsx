import { StyleSheet, Text, View } from 'react-native'
import {Card} from '@rneui/themed';
import React from 'react'
import { Button } from '@rneui/base';

const ResourceCard = () => {
  return (

    <View>
      <Card containerStyle={{borderRadius:25, height:250, padding:0}}>
        <View className='bg-wGreen justify-center items-center' style={{minHeight:120, width:'100%', borderRadius:25}} >
          <Text>[PH]Image</Text>
          </View>
          <View>
            <View style={{padding:10}}>
      <Text className='text-wGreen font-pbold'>[PH]Title</Text>
      <Text>[PH]Description</Text>
      </View>
      <View className='justify-center items-center' style={{padding:15}}>
        <Button color={'#558571'} containerStyle={{borderRadius:10}}>Link Here</Button>
      </View>
      </View>
      </Card>
    </View>

  )
}

export default ResourceCard 
const styles = StyleSheet.create({})