import { StyleSheet, View, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";

const FormField = ({
  value,
  placeholder,
  handleChangeText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="space-y-5 justify-center items-center">
      <View style={styles.shadow}
        className={`${
          placeholder === "Enter Password" || placeholder === "Enter Email"
            ? "border-2 border-tertiary w-full h-16 px-4 bg-formFieldGrey rounded-md focus:border-secondary items-center flex-row w-[350px]"
            : "bg-primary p-3 rounded-full w-[300px] items-center flex-row shadow-md"
        } ${placeholder === "Enter Password" ? "mt-16" : ""}`}
      >
        <TextInput
          className={`flex-1 text-tertiary text-base ${
            placeholder === "Enter Password" || placeholder === "Enter Email"
              ? "bg-formFieldGrey border-white-200 font-psemibold"
              : "bg-transparent text-white"
          }`}
          value={value}
          autoCapitalize="none"
          placeholder={placeholder}
          placeholderTextColor={placeholder === "Enter Password" || placeholder === "Enter Email" ? "#4F7978" : "#FFFFFF"}
          onChangeText={handleChangeText}
          secureTextEntry={placeholder === "Enter Password" && !showPassword}
        />

        {placeholder === "Enter Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

//nativewind Shadow doesn't work for android devices on nativewind.
const styles = StyleSheet.create({
  shadow: {
      elevation: 20,
  }
})
export default FormField;
