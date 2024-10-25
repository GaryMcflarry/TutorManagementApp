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
  const { user } = useGlobalContext();
  const { data: studentInfo, refetch } = useFirebase(() =>
    getConnectedUsers(user)
  );
  const currentDate = dayjs();
  const getStudentOptions = (studentInfo) => {
    if (!studentInfo || studentInfo.length === 0) {
      return [];
    }
    return studentInfo.map((user) => ({
      label: user.fullname,
      value: user.id,
    }));
  };
  const studentOptions = getStudentOptions(studentInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const [student, setStudent] = useState("");
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState("");
  const [groupedHomework, setGroupedHomework] = useState({});

  useEffect(() => {
    const unsubscribe = fetchHomework(
      user.uid,
      user.status,
      setGroupedHomework
    );
    return () => unsubscribe();
  }, [user.uid]);

  const submitHomework = () => {
    if (student === "" || description === "" || date === "") {
      Alert.alert("Please Input all fields!");
      return;
    }

    const selectedStudent = studentInfo.find((s) => s.id === student.value);

    if (selectedStudent && selectedStudent.subject && user.subject) {
      const matchingSubject = selectedStudent.subject.find((subject) =>
        user.subject.includes(subject)
      );

      if (matchingSubject) {
        const dayjsDate = dayjs(date);
        const formattedDate = dayjsDate.format("DD/MM HH:mm");

        submittingHomework(
          student.value,
          user.uid,
          matchingSubject,
          description,
          formattedDate
        );

        setModalVisible(!modalVisible);
      } else {
        console.log("No matching subjects.");
      }
    } else {
      Alert.alert("Selected student info or subjects not found.");
    }

    setDate(dayjs());
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

        <View className="justify-center" style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
          {Object.keys(groupedHomework).length === 0 ? (
            <Text className="align-center  text-[#888] text-lg">
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
