import { StyleSheet, View, FlatList, RefreshControl, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import StatusBarWrapper from "../components/statusBar";
import MenuButton from "../components/MenuButton";
import ResourceCard from "../components/ResourceCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getConnectedUsers } from "../../lib/firebase";
import useFirebase from "../../lib/useFirebase";
import { Dropdown } from "react-native-element-dropdown";

const Home = ({ navigation }) => {
  const { user } = useGlobalContext();
  const { data: userInfo, refetch } = useFirebase(() =>
    getConnectedUsers(user)
  );

  // Utility function to convert subjects in `connections` into { label, value } format
  const getSubjectOptions = (user) => {
    if (!user || !user.connections || user.connections.length === 0) return [];

    // Extract unique subjects from connections that include an ID
    const subjects = [
      ...new Set(
        user.connections
          .filter((connection) => connection.split(" ")[1]) // Only keep connections with an ID
          .map((connection) => connection.split(" ")[0]) // Extract the subject part
      ),
    ];

    // Return formatted options for the dropdown
    return subjects.map((subject) => ({
      label: subject,
      value: subject,
    }));
  };

  const [refreshing, setRefreshing] = useState(false);
  const [subject, setSubject] = useState(
    getSubjectOptions(user)[0]?.value || ""
  ); // Default to first subject, if available

  // Get subject options using the utility function
  const subjectOptions = getSubjectOptions(user);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-white h-full w-full">
      <StatusBarWrapper title="Home">
        {user.status === "tutor" ? (
          // If user is a tutor, show their own information
          <FlatList
            data={[user]} // Using user's own info for tutors
            renderItem={({ item }) => (
              <View>
                <ResourceCard link={item.chatLink} />
                <ResourceCard link={item.meetingLink} />
                <ResourceCard tutorData={item} />
              </View>
            )}
            ListHeaderComponent={() => (
              <View className="w-full h-[70px] flex-row justify-between items-center p-3">
                <Text className="font-bold text-lg">Your Links</Text>
                <MenuButton handlePress={() => navigation.toggleDrawer()} />
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <FlatList
            data={userInfo.filter(
              (tutor) => tutor.subject === subject // Only include tutors for the selected subject
            )}
            renderItem={({ item }) => (
              <View>
                <ResourceCard link={item.chatLink} />
                <ResourceCard link={item.meetingLink} />
                <ResourceCard tutorData={item} />
              </View>
            )}
            ListHeaderComponent={() => (
              <View className="w-full h-[70px] flex-row justify-between items-center p-3">
                <Dropdown
                  style={styles.dropdown}
                  data={subjectOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Subject"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.itemTextStyle}
                  iconStyle={styles.iconStyle}
                  value={subject}
                  onChange={(item) => {
                    setSubject(item.value);
                  }}
                />
                <MenuButton handlePress={() => navigation.toggleDrawer()} />
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </StatusBarWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 50,
  },
  dropdown: {
    width: 150,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#4F7978", // Dropdown background color
  },
  placeholderStyle: {
    color: "#FFFFFF", // Placeholder text color
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "#FFFFFF", // Selected text color
    fontSize: 16,
  },
  itemTextStyle: {
    color: "#000000", // Dropdown items text color
    fontSize: 16,
  },
  iconStyle: {
    tintColor: "#FFFFFF", // Arrow icon color
  },
});

export default Home;
