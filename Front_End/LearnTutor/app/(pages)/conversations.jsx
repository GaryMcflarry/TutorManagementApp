import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import StatusBarWrapper from "../components/statusBar";
import MenuButton from "../components/MenuButton";
import SearchInput from "../components/SearchInput";
import ConversationBar from "../components/ConversationBar";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getConnectedUsers } from "../../lib/firebase"; 
import { images } from "../../constants";

const Conversations = ({ navigation }) => {
  const { user } = useGlobalContext(); // Get the logged-in user
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [connectedUsers, setConnectedUsers] = useState([]); // List of connected users
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users based on search
  
  // console.log("Connected Users: ", connectedUsers)

  // Fetch connected users (tutors or students)
  //const { data: usersData, refetch } = useFirebase(() => getContacts(user));

 // Fetch connected users (tutors or students)
 useEffect(() => {
  const fetchContacts = async () => {
    try {
      const usersData = await getConnectedUsers(user); // Fetch users from Firebase
      
      // Remove duplicates by `id`
      const uniqueUsers = Array.from(
        new Map(usersData.map((user) => [user.id, user])).values()
      );

      setConnectedUsers(uniqueUsers);
      setFilteredUsers(uniqueUsers); // Initialize with full list
    } catch (error) {
      console.error("Error fetching connected users: ", error);
    }
  };

  fetchContacts();
}, [user]); // Fetch users on component mount or when `user` changes


  // Handle Search Input
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredUsers(connectedUsers); // Reset to full list when search is empty
    } else {
      const filtered = connectedUsers.filter((user) =>
        user?.fullName?.toLowerCase().includes(text.toLowerCase()) || 
        user?.email?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <SafeAreaView>
      <StatusBarWrapper title="Chats">
        <ScrollView>
          <View className="w-full h-[70px] items-end p-3">
            <MenuButton handlePress={() => navigation.toggleDrawer()} />
          </View>
          <View className="w-full h-full">
            <View className="w-full h-[70px] justify-center items-center">
              {/* Search Input */}
              <SearchInput 
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by name or email"
              />
            </View>

            {/* Display the list of conversations */}
            <View className="w-full h-full bg-transparent justify-start items-center">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((connectedUser) => (
                  <ConversationBar
                    key={connectedUser.id}  // Fallback to index if uid is missing
                    title={connectedUser.fullname || "No Name"} // Safely handle missing names
                    handlePress={() => {
                      router.push(`/search/${connectedUser.id}`)
                      }} 
                  />
                ))
              ) : (
                // No results found
                <View className="justify-center items-center p-20">
                  <Image source={images.empty} className="h-[150px] w-[150px]" />
                  <Text className="text-lg text-[#888]">No results found</Text>
                </View>
              )}
            </View>
          </View>

        </ScrollView>
      </StatusBarWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  noResultsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsImage: {
    width: 200, // Adjust size as needed
    height: 200,
    marginBottom: 10,
  },
  noResultsText: {
    fontSize: 16,
    color: '#888', // Adjust color as needed
  },
});

export default Conversations;
