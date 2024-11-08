import { View, TextInput, Image } from "react-native";
import React from "react";
import { icons } from "../../constants";


const SearchInput = ({ value, onChange }) => {
  return (
    <View
      className="border-b-2 border-tertiary w-[80%] 
      h-[70%] px-6 items-center flex-row"
    >
      <TextInput
        className="text-base md:text-xl mt-0.5 text-tertiary flex-1 font-pregular"
        value={value} // Use the controlled `value` from parent
        placeholder="Search..."
        placeholderTextColor="#4F7978"
        onChangeText={onChange} // Trigger the passed `onChange` handler
      />
      <Image source={icons.search} className="h-7 w-7"/>
    </View>
  );
};

export default SearchInput;