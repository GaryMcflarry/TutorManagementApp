import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import StatusBarWrapper from "../components/statusBar";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import MenuButton from "../components/MenuButton";
import ResourceCard from "../components/ResourceCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getTutorInfoByStudent } from "../../lib/firebase";
import { useState } from "react";
import useFirebase from "../../lib/useFirebase";

const Home = ({ navigation }) => {
  // Fetching the data of the logged-in user from the global provider
  const { user } = useGlobalContext();
  console.log("USER INFO: ", user);

  // Pass a function reference that fetches tutor info
  const { data: tutorInfo, refetch } = useFirebase(() => getTutorInfoByStudent(user));

  console.log("TUTORS INFO: ", tutorInfo);

  // Setting state for when a user decides to refresh a page
  const [refreshing, setRefreshing] = useState(false);

  // When a user refreshes the page
  const onRefresh = async () => {
    setRefreshing(true);
    // Re-fetch tutor info if needed
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView>
      <View className="bg-white h-full w-full">
        <StatusBarWrapper title="Home">
          <View className="w-full h-[70px] items-end p-3">
            <MenuButton handlePress={() => navigation.toggleDrawer()} />
          </View>
          <View className="bg-teal-200 h-full w-full">
            <ResourceCard />
            <View>
              <Text>User Information:</Text>
              <Text>Email: {user?.email}</Text>
              <Text>Address: {user?.address}</Text>
              <Text>Status: {user?.status}</Text>
              <Text>Grade: {user?.Grade}</Text>
              <Text>Subjects: {user?.subject?.join(", ")}</Text>
            </View>

            <View>
              <Text>Tutor Information:</Text>
              {tutorInfo && Array.isArray(tutorInfo) ? (
                tutorInfo.map((tutor, index) => (
                  <View key={index}>
                    <Text>Name: {tutor?.name}</Text>
                    <Text>Email: {tutor?.email}</Text>
                    <Text>Subjects: {tutor?.subjects?.join(", ")}</Text>
                  </View>
                ))
              ) : (
                <Text>No tutor information available.</Text>
              )}
            </View>
          </View>
        </StatusBarWrapper>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 50,
  },
});

export default Home;
