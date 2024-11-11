import { TouchableOpacity, View } from "react-native";
import React from "react";

const MenuButton = ({handlePress}) => {
  return (
    <TouchableOpacity onPress={handlePress}>
      <View>
        <View className="bg-tertiary w-12 h-[7.5px] my-1 rounded-md"></View>
        <View className="bg-tertiary w-12 h-[7.5px] my-1 rounded-md"></View>
        <View className="bg-tertiary w-12 h-[7.5px] my-1 rounded-md"></View>
      </View>
    </TouchableOpacity>
  );
};

export default MenuButton;
