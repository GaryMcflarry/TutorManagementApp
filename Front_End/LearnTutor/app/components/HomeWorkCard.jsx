import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For the 'X' delete icon
import { deleteHomework } from "../../lib/firebase";

const HomeWorkCard = ({ subject, homeworkItems, recipientName, userStatus }) => {

  const getSubjectStyle = (subject) => {
    switch (subject) {
      case "Science":
        return { cardBg: "#078C0F", activityBg: "#066D0C" }; // Science wallpaper color
      case "Mathematics":
        return { cardBg: "#C5CD1A", activityBg: "#8F9513" }; // Mathematics wallpaper color
      case "English":
        return { cardBg: "#E53114", activityBg: "#951E0B" }; // English wallpaper color
      case "Geography":
        return { cardBg: "#0AD6E3", activityBg: "#07848C" }; // Afrikaans wallpaper color
      default:
        return { cardBg: "#FFFFF", activityBg: "#FFFFFF" }; // Default color if subject does not match
    }
  };


  const handleDelete = (itemId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this homework item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            // setHomeworkItems((prevItems) => prevItems.filter(item => item.id !== itemId));
            console.log(`Home work ID ${itemId}`);

            deleteHomework(itemId);
          }, // Call the deletion function
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View
      style={[styles.shadow, { backgroundColor : getSubjectStyle(subject).cardBg}]}
      className=" border-none rounded-lg my-2"
    >
      <View className="flex-row justify-between items-center h-[50px] bg-primary w-full rounded-t-lg px-2">
        <Text className="text-white font-bold text-base md:text-xl">{subject}</Text>
        <Text className="text-white font-bold text-base md:text-xl">{recipientName}</Text>
      </View>
      <View className="p-5">
        {homeworkItems.length === 0 ? ( // Check if homeworkItems is empty
          <Text style={styles.noHomeworkText}>No Homework Assigned</Text>
        ) : (
          <FlatList
            data={homeworkItems}
            keyExtractor={(item) => item.id} // Ensure item.id is unique
            renderItem={({ item }) => (
              <View className="flex-row items-center  p-3 border-none rounded-md" style={{ backgroundColor : getSubjectStyle(subject).activityBg}}>
                <Text className="text-white text-base md:text-xl flex-1 ml-2">
                  {item.description || "No Description"}
                </Text>
                <Text className="text-white text-sm md:text-lg ml-2">{item.dueDate}</Text>
                {userStatus === "tutor" && (
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  separator: {
    height: 2,
    backgroundColor: "#FFF",
    marginVertical: 5,
  },
  noHomeworkText: {
    color: "#888", // Adjust as needed
    textAlign: "center", // Centering the no homework message
  },
});

export default HomeWorkCard;
