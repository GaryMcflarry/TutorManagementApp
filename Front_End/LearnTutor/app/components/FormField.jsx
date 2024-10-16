import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Input, Icon } from '@rneui/themed';


export const EmailField = () => {

  return (
    <Input
      placeholder='INPUT WITH ERROR MESSAGE'
      errorStyle={{ color: 'red' }}
      errorMessage='ENTER A VALID ERROR HERE'
    />
  )
}

export const PasswordField = () => {
  return(
    <Input placeholder="Password" secureTextEntry={true} />
  )
}

const styles = StyleSheet.create({})