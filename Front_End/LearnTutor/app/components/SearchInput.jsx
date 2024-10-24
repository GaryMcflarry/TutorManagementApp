import { View, TextInput, Image } from "react-native";
import React from "react";
import { icons } from "../../constants";


const SearchInput = ({ value, onChange }) => {
  return (
    <View
      className="border-b-2 border-tertiary w-[350px] 
      h-15 px-6 items-center flex-row"
    >
      <TextInput
        className="text-base mt-0.5 text-tertiary flex-1 font-pregular"
        value={value} // Use the controlled `value` from parent
        placeholder="Search..."
        placeholderTextColor="#4F7978"
        onChangeText={onChange} // Trigger the passed `onChange` handler
      />
      <Image source={icons.search} className="h-6 w-6"/>
    </View>
  );
};

export default SearchInput;