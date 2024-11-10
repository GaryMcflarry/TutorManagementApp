import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native'; // To access the current route

const CustomButton = ({ title, handlePress, containerStyles, isLoading }) => {
  const route = useRoute(); // Get the current route

  // Check if the current path includes '/search'
  const isSearchRoute = route.name.includes('search');

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`${
        isSearchRoute ? 'bg-primary' : 'bg-tertiary'
      } ${containerStyles}`}
      style={[styles.shadow]}
      disabled={isLoading}
    >
    
      <Text className="text-white font-psemibold text-lg md:text-2xl">{title}</Text>
    </TouchableOpacity>
  );
};

// Shadow style for Android devices
const styles = StyleSheet.create({
  shadow: {
    elevation: 10,
  }
});

export default CustomButton;