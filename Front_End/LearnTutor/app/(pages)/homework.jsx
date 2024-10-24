import { ScrollView, StyleSheet, Text, View, Modal, Alert } from "react-native";
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
import { fetchHomework, getConnectedUsers, submittingHomework } from "../../lib/firebase";
import useFirebase from "../../lib/useFirebase";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

const Homework = ({ navigation }) => {
  const { user } = useGlobalContext();
  const { data: studentInfo, refetch } = useFirebase(() =>
    getConnectedUsers(user)
  );
  const currentDate = dayjs();
  const getStudentOptions = (studentInfo) => {
    // Check if studentInfo exists and has valid data
    if (!studentInfo || studentInfo.length === 0) {
      return [];
    }

    // Map student data into label-value pairs
    return studentInfo.map((user) => ({
      label: user.fullname,
      value: user.id,
    }));
  };
  const studentOptions = getStudentOptions(studentInfo);
  //console.log("HW PAGE students: ", studentOptions);
  const [modalVisible, setModalVisible] = useState(false);

  const [student, setStudent] = useState("");
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState("");

  const [homework, setHomework] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchHomework(user.uid);
    return () => unsubscribe(); // Unsubscribe from Firestore when the component unmounts
  }, [user.uid]);

  const submitHomework = () => {
    if (student === "" || description === "" || date === "") {
      Alert.alert("Please Input all fields!");
      return; // Exit if fields are not filled
    }
    console.log("Tutor Id: ", user.uid);
    console.log("Selected Student: ", student.value);
    // Check if studentInfo exists and has the selected student's data
    const selectedStudent = studentInfo.find((s) => s.id === student.value);

    if (selectedStudent && selectedStudent.subject && user.subject) {
      const matchingSubjects = selectedStudent.subject.filter((subject) =>
        user.subject.includes(subject)
      );

      if (matchingSubjects.length > 0) {
        console.log("Matching subjects: ", matchingSubjects);
        submittingHomework(
          student.value,
          user.uid,
          matchingSubjects,
          description,
          date
        );
        setModalVisible(!modalVisible);
      } else {
        console.log("No matching subjects.");
      }
    } else {
      Alert.alert("Selected student info or subjects not found.");
    }

    console.log("Description: ", description);
    console.log("Selected Date: ", date);
    // Call the function to submit homework, for example:
    // submittingHomework(student.value, user.uid, matchingSubjects, description, date);
    setDate(dayjs());
    setDescription("");
    setStudent("");
  };

  return (
    <SafeAreaView>
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
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle} className="text-lg">
                    X
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="mb-5 text-center text-white font-bold text-lg">
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
                }}
              />
              <FormField
                placeholder="Write down homework..."
                handleChangeText={(item) => setDescription(item)}
              />
              <View className="w-[270px] h-[310px] border-none rounded-xl bg-[#FFFFFF]">
                <DateTimePicker
                  mode="single"
                  date={date}
                  onChange={(params) => setDate(params.date)}
                  timePicker={true}
                  selectedItemColor="#4F7978"
                />
              </View>
              <TouchableOpacity
                className="bg-primary p-3 border-none rounded-xl mt-10"
                style={styles.shadow}
                onPress={() => submitHomework()}
              >
                <Text style={styles.textStyle}>Submit</Text>
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
              handlePress={() => setModalVisible(!modalVisible)}
            />
          )}
          <MenuButton handlePress={() => navigation.toggleDrawer()} />
        </View>

        {/* <ScrollView className="bg-teal-500 w-full h-full">
          <View className="h-full w-full justify-start items-center p-3">
            {/* <HomeWorkCard data={data} /> 
          </View>
        </ScrollView> */}
      </StatusBarWrapper>
    </SafeAreaView>
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  dropdown: {
    width: 300,
    height: 50,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#4F7978", // Dropdown background color
    marginBottom: 20,
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

export default Homework;
