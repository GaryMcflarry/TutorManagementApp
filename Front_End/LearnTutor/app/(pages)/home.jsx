import { StyleSheet, View, FlatList, RefreshControl, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import StatusBarWrapper from "../components/statusBar";
import MenuButton from "../components/MenuButton";
import ResourceCard from "../components/ResourceCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getTutorInfoByStudent } from "../../lib/firebase";
import useFirebase from "../../lib/useFirebase";
import { Dropdown } from "react-native-element-dropdown";

// Utility function to convert subjects into { label, value } format
const getSubjectOptions = (user) => {
  if (!user || !user.subject || user.subject.length === 0) return [];
  return user.subject.map((subj) => ({
    label: subj,
    value: subj,
  }));
};

const Home = ({ navigation }) => {
  const { user } = useGlobalContext();
  const { data: tutorInfo, refetch } = useFirebase(() =>
    getTutorInfoByStudent(user)
  );

  const [refreshing, setRefreshing] = useState(false);
  const [subject, setSubject] = useState(user.subject[0] || '');

  // Get subject options using the utility function
  const subjectOptions = getSubjectOptions(user);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Determine whether the user is a tutor
  const isTutor = user.status === "tutor";

  return (
    <SafeAreaView className="bg-white h-full w-full">
      <StatusBarWrapper title="Home">
        {isTutor ? (
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
          // If user is not a tutor, show the list of tutors based on the selected subject
          <FlatList
            data={tutorInfo.filter(
              (tutor) =>
                tutor.subject.includes(subject) &&
                tutor.students.includes(user.uid)
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
