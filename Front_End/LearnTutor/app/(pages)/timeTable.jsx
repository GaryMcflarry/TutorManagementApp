import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import StatusBarWrapper from "../components/statusBar";
import TimeTableCard from "../components/TimeTableCard";
import MenuButton from "../components/MenuButton";
import CustomButton from "../components/CustomButton";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import {
  getConnectedUsers,
  submittingSession,
  fetchSessions,
} from "../../lib/firebase";
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import useFirebase from "../../lib/useFirebase";

const TimeTable = ({ navigation }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const { user, setUser } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [groupedSession, setGroupedSession] = useState({});
  const [subject, setSubject] = useState("");
  const [timeSlot, setTimeslot] = useState([]);
  const [type, setType] = useState("");

  const timeRanges = useMemo(() => {
    const startHour = 8;
    const endHour = 16;
    const ranges = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const start = `${String(hour).padStart(2, "0")}:00`;
      const end = `${String(hour + 1).padStart(2, "0")}:00`;
      ranges.push(`${start} - ${end}`);
    }
    setLoading(false);
    return ranges;
  }, []);

  useEffect(() => {
    // Call fetchSessions and store the unsubscribe function
    const unsubscribe = fetchSessions(user.uid, user.status, setGroupedSession);
    console.log("Current logged in user: ", user);
    // Cleanup function to unsubscribe
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe(); // Call unsubscribe if it's a function
      }
    };
  }, [user.uid, user.availability]);

  const { data: userInfo, refetch } = useFirebase(() =>
    getConnectedUsers(user)
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getUserOptions = (users) => {
    if (!Array.isArray(users) || users.length === 0) return [];
    let options = [];
    users.forEach((user) => {
      if (user !== null) {
        //console.log("USER OPTIONS: ", user)
        options.push({
          label: `${user.fullname} (${user.subject})`,
          value: `${user.subject} ${user.id}`,
        });
      }
    });
    return options;
  };

  const userOptions = getUserOptions(userInfo);

  const submitSession = async () => {
    try {
      let createdSessionId;
      if (
        selectedUserId === "" ||
        timeSlot.length === 0 ||
        subject === "" ||
        type === ""
      ) {
        Alert.alert("Please fill out all fields!");
        return;
      }

      setLoading(true);

      if (user.status === "student") {
        createdSessionId = await submittingSession(
          user.uid,
          selectedUserId,
          subject,
          timeSlot,
          type,
          user.status,
          user.address
        );
      } else {
        createdSessionId = await submittingSession(
          user.uid,
          selectedUserId,
          subject,
          timeSlot,
          type,
          user.status,
          null
        );
      }

      let newAvailabilities = []; // Array to hold new availability entries

      timeSlot.forEach((slot) => {
        const newAvailability = `${slot}, ${createdSessionId}`;
        console.log("NEW AVAIL: ", newAvailability);
        newAvailabilities.push(newAvailability); // Add each new slot separately
      });

      // Merge new availabilities with existing ones
      const updatedAvailability = [...user.availability, ...newAvailabilities];

      // Update the user state in the context
      setUser({
        ...user,
        availability: updatedAvailability,
      });

      // Delay setting loading to false by 500 ms after updating the user
      setTimeout(() => {
        Alert.alert("Session was added");
        setLoading(false), 500;
        setModalVisible(false);
        setTimeslot([]);
        setSelectedUser("");
        setSelectedUserId("");
        setSubject("");
        setType("");
      });
    } catch (error) {
      console.error("Error submitting session:", error);
      Alert.alert(
        "An error occurred while submitting the session. Please try again."
      );
      setLoading(false); // Ensure loading is turned off if there's an error
    }
  };

  async function updateUserAvailability(userId, timeSlot) {
    // Assuming you are using Firestore as your database
    const userRef = firestore.collection("users").doc(userId);

    // Get the current user's data
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Check if availability exists and add the new time slot
    const updatedAvailability = userData.availability || [];

    // Optionally prevent duplicates
    if (!updatedAvailability.includes(timeSlot)) {
      updatedAvailability.push(timeSlot);
    }

    // Update the user's document with the new availability
    await userRef.update({ availability: updatedAvailability });

    // Update the user state in the context
    setUser({ ...userData, availability: updatedAvailability });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarWrapper title="Timetable">
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View className="flex-1 justify-center items-center">
            <View
              className="bg-tertiary border-none rounded-lg p-5 items-center"
              style={styles.shadow}
            >
              <View className="w-[300px] h-[30px] flex-row justify-end items-center">
                <TouchableOpacity
                  style={styles.shadow}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setSubject("");
                    setSelectedUserId("");
                    setSelectedUser("");
                    setTimeslot([]);
                    setType("");
                  }}
                >
                  <Text style={styles.textStyle} className="text-lg">
                    X
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="mb-5 text-center text-white font-bold text-lg">
                Add Session
              </Text>
              <Dropdown
                style={styles.dropdown}
                data={userOptions}
                labelField="label"
                valueField="value"
                placeholder="Select User"
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemTextStyle}
                conStyle={styles.iconStyle}
                value={selectedUser} // Ensure dropdown reflects the selected value
                onChange={(item) => {
                  setSelectedUser(item);
                  const [subjectValue, userId] = item.value.split(" ");
                  setSelectedUserId(userId);
                  setSubject(subjectValue);
                }}
              />
              <View className=" flex-row w-[80%] h-[20%] justify-between items-center p-6">
                <CustomButton
                  title="Online"
                  containerStyles={
                    "border-2 border-white rounded-md p-3 bg-primary"
                  }
                  handlePress={() => setType("Online")}
                />
                <CustomButton
                  title="In Person"
                  containerStyles={
                    "border-2 border-white rounded-md p-3 bg-primary"
                  }
                  handlePress={() => setType("inperson")}
                />
              </View>
              <View className="w-[270px] h-[310px] justify-center items-center border-none rounded-xl bg-[#FFFFFF]">
                <PagerView
                  className="w-full h-full justify-center items-center"
                  style={{ flex: 1 }}
                  initialPage={0}
                >
                  {days.map((day) => (
                    <View key={day} style={styles.page}>
                      <View className="flex-row justify-between items-center px-4">
                        <Icon
                          name="chevron-back-outline"
                          color="#4F7978"
                          size={30}
                        />
                        <Text className="text-base mx-8 font-semibold text-[#4F7978]">
                          {day}
                        </Text>
                        <Icon
                          name="chevron-forward-outline"
                          color="#4F7978"
                          size={30}
                        />
                      </View>
                      <FlatList
                        className="w-full h-full"
                        data={timeRanges}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                          const matchedAvailability = user.availability.find(
                            (avail) => {
                              const [availabilityDay, availabilityTime] =
                                avail.split(", ");
                              return (
                                availabilityDay === day &&
                                availabilityTime === item
                              );
                            }
                          );

                          return (
                            <>
                              {matchedAvailability ||
                              timeSlot.includes(`${day}, ${item}`) ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    Alert.alert("Timeslot is occupied!")
                                  }
                                >
                                  <View
                                    style={styles.timeSlotContainer}
                                    className="bg-tertiary"
                                  >
                                    <Text style={styles.timeSlotText}>
                                      {item}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => {
                                    setLoading(true); // Start the loading indicator
                                    setTimeslot((prevTimeslots) => [
                                      ...prevTimeslots,
                                      `${day}, ${item}`,
                                    ]);

                                    // Delay turning off the loading indicator
                                    setTimeout(() => {
                                      //console.log("TimeSlot: ", timeSlot);
                                      setLoading(false); // Stop the loading indicator after a brief delay
                                    }, 100); // Adjust delay as necessary, e.g., 500 ms
                                  }}
                                >
                                  <View
                                    style={styles.timeSlotContainer}
                                    className="bg-primary"
                                  >
                                    <Text style={styles.timeSlotText}>
                                      {item}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              )}
                            </>
                          );
                        }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                      />
                    </View>
                  ))}
                </PagerView>
              </View>
              {loading ? (
                <ActivityIndicator
                  className="my-5"
                  size="large"
                  color="#FEA07D"
                />
              ) : (
                <TouchableOpacity
                  className="bg-primary p-3 border-none rounded-xl mt-10"
                  style={styles.shadow}
                  onPress={submitSession}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
        <View className="w-full h-[70px] items-center p-3 flex-row justify-between">
          <CustomButton
            title="Add +"
            containerStyles="w-20 h-10 justify-center items-center"
            handlePress={() => setModalVisible(!modalVisible)}
          />
          <MenuButton handlePress={() => navigation.toggleDrawer()} />
        </View>
        <PagerView style={{ flex: 1 }} initialPage={0}>
          {days.map((day) => (
            <View key={day} style={styles.page}>
              <View className="flex-row justify-between items-center px-4">
                <Icon name="chevron-back-outline" color="#4F7978" size={50} />
                <Text className="text-xl mx-8 font-semibold text-[#4F7978]">
                  {day}
                </Text>
                <Icon
                  name="chevron-forward-outline"
                  color="#4F7978"
                  size={50}
                />
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" /> // Show a loader or placeholder
              ) : (
                <FlatList
                  data={timeRanges}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => {
                    const matchedAvailability = user.availability.find(
                      (avail) => {
                        const [availabilityDay, availabilityTime] =
                          avail.split(", ");
                        return (
                          availabilityDay === day && availabilityTime === item
                        );
                      }
                    );

                    const sessionId = matchedAvailability
                      ? matchedAvailability.split(", ")[2]
                      : null;

                    // Find the matching session in groupedSessions if a sessionId exists
                    const sessionDetails =
                      sessionId && groupedSession[sessionId]
                        ? groupedSession[sessionId][0] // Assuming there's only one session per ID
                        : null;

                    // Pass the session details to the TimeTableCard component
                    return (
                      <TimeTableCard
                        time={item}
                        sessionId={sessionId}
                        sessionDetails={sessionDetails}
                        day={day} // Pass the entire session details to the card
                      />
                    );
                  }}
                />
              )}
            </View>
          ))}
        </PagerView>
      </StatusBarWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  dropdown: {
    width: 300,
    height: 50,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#4F7978",
    marginBottom: 20,
  },
  placeholderStyle: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  itemTextStyle: {
    color: "#000000",
    fontSize: 16,
  },
  iconStyle: {
    tintColor: "#FFFFFF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  timeSlotContainer: {
    width: "100%",
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 10,
  },
  timeSlotText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 20,
    width: "100%",
  },
});

export default TimeTable;
