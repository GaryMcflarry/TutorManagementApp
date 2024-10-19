import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";

import { icons } from "../../constants";
import { router, usePathname } from "expo-router";

//creating custom function to be use accross all pages (component)
//used in home page and search page for searching videos
//params
const SearchInput = ({ initialQuery }) => {
  const pathName = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  //structure of the component
  return (
    <View
      className="border-b-2 border-tertiary w-[350px] 
      h-15 px-6  focus:border-tertiary items-center flex-row"
    >
      <TextInput
        className="text-base mt-0.5 text-tertiary flex-1 font-pregular"
        value={query}
        placeholder="Search..."
        placeholderTextColor="#4F7978"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            );
          }
          // when you search it does set the query to the name of the search, usable on the page
          //works well with the main_layout to route to the correct page
          //hense why the search file is called [query]
          //so if searching on search page
          if (pathName.startsWith("/search")) router.setParams({ query });
          //when searchin on home page (will route to search page)
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

//allowing it to be used accross all pages
export default SearchInput;
