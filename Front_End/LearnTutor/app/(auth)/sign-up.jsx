import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const signUp = () => {


//   const signUp = async () => {

//     if (!email || !password) {
//       Alert.alert("Error", "Please fill in all the fields");
//       return null;
//     }
    
//     setLoading(true);


//   try {
//     await createUser(email, password)

//     //no state change as admin will remain logged in

    
//     Alert.alert('User was created');
//     router.replace('/home')
//     // console.log(response);
//   } catch (error) { 
//     // console.log(error);
//     Alert.alert("Login has failed: ", error.message);


//   } finally {
//     setLoading(false);
//   }
// }


{/* <CustomButton
                  title="Create Account"
                  handlePress={() => signUp()}
                  containerStyles="w-[110px] h-[62px] justify-center items-center" /> */}

  return (
    <View>
      <Text>sign-up</Text>
    </View>
  )
}

export default signUp

const styles = StyleSheet.create({})