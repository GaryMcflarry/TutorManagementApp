import { StyleSheet, Text, View } from 'react-native'
import {Card} from '@rneui/themed';
import React from 'react'
import { Button } from '@rneui/base';

const ResourceCard = () => {
  return (

    <View>
      <Card containerStyle={[styles.card]}>
        <View className='bg-wGreen justify-center items-center' style={[styles.header]} >
          <Text>[PH]Image</Text>
          </View>
          <View>
            <View style={{padding:10}}>
      <Text className='text-wGreen font-pbold'>[PH]Title</Text>
      <Text styles={{elevation: 10}}>[PH]Description</Text>
      </View>
      <View className='justify-center items-center' style={{padding:15}}>
        <Button color={'#558571'} containerStyle={{borderRadius:15, width:130}} style={[styles.button]}>Link Here</Button>
      </View>
      </View>
      </Card>
    </View>

  )
}

export default ResourceCard 
const styles = StyleSheet.create({
  card: {
    borderRadius:25,
    height:280,
    padding:0,
  },
  header: {
    minHeight:120,
    width:'100%',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  button: {
    width:200,
    borderRadius:40,
  }
})