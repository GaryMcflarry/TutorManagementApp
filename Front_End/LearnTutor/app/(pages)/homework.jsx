import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import StatusBarWrapper from "../components/statusBar";
import MenuButton from "../components/MenuButton";
import HomeWorkCard from "../components/HomeWorkCard";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import {
  fetchHomework,
  getConnectedUsers,
  submittingHomework,
} from "../../lib/firebase";
import useFirebase from "../../lib/useFirebase";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

const Homework = ({ navigation }) => {
  //Obtain the current logged in user
  const { user } = useGlobalContext();
  //Fetch users via the connections array
  const { data: userInfo, refetch } = useFirebase(() =>
    getConnectedUsers(user)
  );

  // Utility function to convert subjects in `connections` into { label, value } format
  const getStudentOptions = (users) => {
    // Check if users is an array and has at least one user
    if (!Array.isArray(users) || users.length === 0) return [];

    // Initialize an array to hold all student options
    let options = [];

    users.forEach((user) => {
      if (user !== null) {
        // Push the formatted option for valid users into the options array
        options.push({
          label: `${user.fullname} (${user.subject})`, // Format label to include subject
          value: `${user.subject} ${user.id}`, // Use user ID as value
        });
      }
    });

    return options;
  };

  // Usage example
  const studentOptions = getStudentOptions(userInfo); // Pass the entire array
  // console.log(studentOptions);

  const [modalVisible, setModalVisible] = useState(false); //Displaying the dialog

  const [student, setStudent] = useState(""); //Setting the student to be edited
  const [studentId, setStudentId] = useState(""); //Setting the selected students Id
  const [studentSubject, setStudentSubject] = useState(""); //Setting the subject connection between tutor and student
  const [date, setDate] = useState(dayjs()); //Setting the due date
  const [description, setDescription] = useState(""); //Setting the homework description
  const [groupedHomework, setGroupedHomework] = useState({}); //Grouping the homework based of the subject

  //Fetching the homework connected to the current student
  useEffect(() => {
    const unsubscribe = fetchHomework(
      user.uid,
      user.status,
      setGroupedHomework
    );
    return () => unsubscribe();
  }, [user.uid]);

  //Function for Tutor to submit homework
  const submitHomework = () => {
    // Check for empty fields
    if (student === "" || description === "" || date === "") {
      Alert.alert("Please Input all fields!");
      return;
    }

    // Format the date using dayjs
    const dayjsDate = dayjs(date);
    const formattedDate = dayjsDate.format("DD/MM HH:mm");

    // Submit the homework
    submittingHomework(
      studentId,
      user.uid,
      studentSubject,
      description,
      formattedDate
    );

    // Reset form fields and close modal
    setModalVisible(false);
    setDate(dayjs()); // Reset to current date/time
    setDescription("");
    setStudent("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <StatusBarWrapper title="Homework">
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
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
                      setStudentId("");
                      setStudentSubject("");
                      setStudent("");
                      setDescription("");
                    }}
                  >
                    <Text className="text-lg text-white font-bold">X</Text>
                  </TouchableOpacity>
                </View>
                <Text className="mb-3 text-center text-white font-bold text-lg">
                  Add Homework
                </Text>
                <Dropdown
                  style={styles.dropdown}
                  data={studentOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Student"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.itemTextStyle}
                  conStyle={styles.iconStyle}
                  value={student}
                  onChange={(item) => {
                    setStudent(item);
                    const [subjectValue, userId] = item.value.split(" ");
                    setStudentId(userId);
                    setStudentSubject(subjectValue);
                  }}
                />
                <FormField
                  placeholder="Write down homework..."
                  handleChangeText={(item) => setDescription(item)}
                />
                <View className="w-[80%] h-[310px] border-none rounded-xl bg-[#FFFFFF]">
                  <DateTimePicker
                    mode="single"
                    date={date}
                    onChange={(params) => setDate(params.date)}
                    timePicker={true}
                    selectedItemColor="#4F7978"
                  />
                </View>
                <TouchableOpacity
                  className="bg-primary p-3 border-none rounded-xl mt-3"
                  style={styles.shadow}
                  onPress={() => {
                    submitHomework();
                    setStudentId("");
                    setStudentSubject("");
                    setStudent("");
                    setDescription("");
                  }}
                >
                  <Text className="text-white font-bold">Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View
            className={`w-full h-[70px] items-center p-3 ${
              user.status === "tutor" ? "flex-row justify-between" : "items-end"
            }`}
          >
            {user.status === "tutor" && (
              <CustomButton
                title="Add +"
                containerStyles="w-20 h-10 justify-center items-center"
                handlePress={() => {
                  setModalVisible(!modalVisible);
                }}
              />
            )}
            <MenuButton handlePress={() => navigation.toggleDrawer()} />
          </View>
            <View
              className="justify-start items-center"
              style={{
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              {Object.keys(groupedHomework).length === 0 ? (
                <Text className="align-center text-[#888] text-lg">
                  No Homework Assigned
                </Text>
              ) : (
                <FlatList
                  scrollEnabled
                  data={Object.keys(groupedHomework)}
                  keyExtractor={(subject) => subject}
                  renderItem={({ item: subject }) => {
                    const homeworkItems = groupedHomework[subject];
                    const recipientName =
                      homeworkItems.length > 0
                        ? homeworkItems[0].recipientName
                        : "Unknown";

                    return (
                      <HomeWorkCard
                        key={subject}
                        subject={subject}
                        homeworkItems={homeworkItems}
                        recipientName={recipientName}
                        userStatus={user.status}
                      />
                    );
                  }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              )}
            </View>
        </StatusBarWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  //Shadow for andriod
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
  //Dropdown Styles
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
});

export default Homework;
