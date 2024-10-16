import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from '@rneui/base';


const MenuButton = () => {
  return (
    
      <Button containerStyle={{width:30,height:30}} color={'#FFFFFF'}>
        <View>
      <View className='bg-tertiary' style={{height:5, width:30, borderRadius:3, marginBottom:2.5}}>

      </View>
      <View className='bg-tertiary' style={{height:5, width:30, borderRadius:3, marginBottom:2.5}}> 

      </View>
      <View className='bg-tertiary' style={{height:5, width:30, borderRadius:3}}>

      </View>
      </View>
      </Button>
    
  )
}

export default MenuButton

const styles = StyleSheet.create({})