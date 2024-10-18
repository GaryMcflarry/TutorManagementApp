import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { icons } from "../../constants";

//creating custom function to be use accross all pages (component)
//making this to act as a form field
//params
const FormField = ({
  value,
  placeholder,
  handleChangeText,
  ...props //indicating that is it an array of the params in use, i guess multiple instances
}) => {
  //getting the current state of if the password is being shown or not
  const [showPassword, setShowPassword] = useState(false);
  //structure of the component
  
  return (
    <>
    <View className="space-y-5 justify-center items-center">

      <View
        className="border-2 border-tertiary w-full h-16 px-4 bg-formFieldGrey rounded-md focus:border-secondary items-center flex-row w-[350px] mt-16"
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base bg-formFieldGrey border-white-200"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={placeholder === "Enter Password" && !showPassword}
        />

        {placeholder === "Enter Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyehide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      
    </View>
    
    </>
  );
};

//allowing it to be used accross all pages
export default FormField;