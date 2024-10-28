import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { ActivityIndicator, KeyboardAvoidingView } from "react-native";
import {
  createTutor,
  createAdmin,
  getAvailableTutors,
  createStudent,
} from "../../lib/firebase";
import { TouchableOpacity } from "react-native";
import { icons } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import FormField from "../components/FormField";

import { Dropdown } from "react-native-element-dropdown";
import { CheckBox } from "@rneui/themed";


const signUp = () => {
  //Roles
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [fullName, setFullName] = useState("");
  // Formvalid checking for signUp function - Roles
  const isFormValid = (status) => {
    if (status === "tutor") {
      return (
        isAnySubjectSelected() &&
        email &&
        password &&
        fullName &&
        meetingLink &&
        chatLink
      );
    } else if (status === "student") {
      return (
        email && password && fullName && grade && address && tutors.length > 0
      );
    } else if (status === "admin") {
      return email && password;
    }
    return false;
  };

  // Big boi function for creating users - Roles
  const signUp = async () => {
    if (!isFormValid(status)) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setLoading(true);

    try {
      let connectionsArray = [];

      if (status === "tutor") {
        connectionsArray = subjects
          .filter((subject) => subject.selected)
          .flatMap((subject) => Array(subject.capacity).fill(subject.subject));

        await createTutor(
          email,
          password,
          status,
          fullName,
          meetingLink,
          chatLink,
          connectionsArray
        );
        Alert.alert("Tutor was created");
      } else if (status === "student") {
        connectionsArray = tutors
          .map((tutor) => `${tutor.subject} ${tutor.tutorId}`)
          .filter(Boolean); // Removes any falsy values

        await createStudent(
          email,
          password,
          status,
          fullName,
          grade,
          address,
          connectionsArray
        );
        Alert.alert("Student was created");
      } else if (status === "admin") {
        await createAdmin(email, password);
        Alert.alert("Admin was created");
      }

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", `Failed to create ${status}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================

  //Tutor
  const [chatLink, setChatLink] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [subjects, setSubjects] = useState([
    { subject: "Mathematics", capacity: 1, selected: false },
    { subject: "English", capacity: 1, selected: false },
    { subject: "Science", capacity: 1, selected: false },
    { subject: "Geography", capacity: 1, selected: false },
  ]);
  //Updateing the selected subjects for availability - Tutors
  const toggleSubjectSelection = (index) => {
    setSubjects((prevSubjects) => {
      // Create a copy of the subjects array
      const updatedSubjects = [...prevSubjects];

      // Toggle the selected property for the specific subject
      updatedSubjects[index].selected = !updatedSubjects[index].selected;

      // Reset capacity if deselected
      if (!updatedSubjects[index].selected) {
        updatedSubjects[index].capacity = 1; // Or set it to any default value you prefer
      }

      // Log the updated subjects for debugging
      // console.log("Updated subjects:", updatedSubjects);

      return updatedSubjects;
    });
  };
  // Updating capacity of chosen subjects - tutors
  const updateCapacity = (index, newCapacity) => {
    // Parse the new capacity as a number
    const parsedCapacity = parseInt(newCapacity, 10) || 1; // Default to 1 if parsing fails

    setSubjects((prevSubjects) =>
      prevSubjects.map((subjectObj, i) =>
        i === index ? { ...subjectObj, capacity: parsedCapacity } : subjectObj
      )
    );
  };
  // Function to check if any subject is selected - Tutors
  const isAnySubjectSelected = () => {
    return subjects.some((subject) => subject.selected);
  };

  // ===========================================================================

  //Student
  const [grade, setGrade] = useState("");
  const [address, setAddress] = useState("");
  // Storing array for tutors - Student
  const [tutors, setTutors] = useState([]);
  //The state for storing availalbe tutors - Student
  const [availableSubjects, setAvailableSubjects] = useState([]);
  // Fetching the avialalble tutors Student
  // Fetching the available tutors for Students
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const groupedTutors = await getAvailableTutors();
        console.log("GroupedTutors: ", groupedTutors);
        setAvailableSubjects(groupedTutors);
      } catch (error) {
        console.error("Failed to load tutors:", error);
      }
    };

    fetchTutors();
  }, []);

  // Checking how the select tutor function works - Student
  useEffect(() => {
    console.log("Selected Tutors: ", tutors);
  }, [tutors]);

  // Function to take available tutors and make options for them to choose - student
  const createSubjectOptions = (availableSubjects) => {
    return availableSubjects
      .map((subjectObj) => {
        if (subjectObj.tutorIds.length > 0) {
          // If tutors are available for this subject, pair names with IDs
          return subjectObj.tutorIds.map((tutorId, index) => ({
            label: `${subjectObj.subject} - ${subjectObj.tutorNames[index]}`,
            value: tutorId,
          }));
        } else {
          // If no tutors are available for this subject, return a "no tutors" option
          return [
            {
              label: `${subjectObj.subject} - No available tutors`,
              value: "NoTutors",
            },
          ];
        }
      })
      .flat(); // Flatten to ensure a single array
  };

  // ===========================================================================

  //Functionality
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  return (
    <SafeAreaView className="bg-primary h-full">
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
                  setTutors([]); // Clear the tutors array

                  // Reset the selected tutor IDs for each subject
                  availableSubjects.forEach((subjectObj) => {
                    subjectObj.selectedTutorId = null; // Reset selected tutor ID
                  });

                  // Trigger re-render
                  setAvailableSubjects([...availableSubjects]); // Update state
                }}
              >
                <Text style={styles.textStyle} className="text-lg text-white">
                  X
                </Text>
              </TouchableOpacity>
            </View>
            {status === "tutor" && (
              <>
                <Text className="mb-5 text-center text-white font-bold text-lg">
                  Add Tutor Information
                </Text>

                <FormField
                  placeholder="Enter Full Name"
                  handleChangeText={(text) => setFullName(text)}
                />

                <FormField
                  placeholder="Enter Chat Link"
                  handleChangeText={(text) => setChatLink(text)}
                />
                <FormField
                  placeholder="Enter Meeting Link"
                  handleChangeText={(text) => setMeetingLink(text)}
                />

                <View className="w-full p-3">
                  {subjects.map((subjectObj, index) => (
                    <View key={index}>
                      <View className="flex-row items-center justify-evenly w-[90%]">
                        <CheckBox
                          title={subjectObj.subject}
                          checked={subjectObj.selected}
                          onPress={() => toggleSubjectSelection(index)}
                          containerStyle={styles.checkboxContainer}
                          checkedColor="#FEA07D"
                          uncheckedColor="#FFFFFF"
                          textStyle={{ color: "white" }}
                        />
                        {subjectObj.selected && (
                          <TextInput
                            style={styles.capacityInput}
                            placeholder="Students"
                            keyboardType="number-pad"
                            onChangeText={(text) => updateCapacity(index, text)}
                          />
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
            {status === "student" && (
              <>
                <Text className="mb-5 text-center text-white font-bold text-lg">
                  Add Student Information
                </Text>

                <FormField
                  placeholder="Enter Full Name"
                  handleChangeText={(text) => setFullName(text)}
                />
                <FormField
                  placeholder="Enter Grade"
                  handleChangeText={(text) => setGrade(text)}
                />

                <FormField
                  placeholder="Enter Address"
                  handleChangeText={(text) => setAddress(text)}
                />

                <View className="w-full p-3">
                  {availableSubjects.map((subjectObj, index) => (
                    <View key={index}>
                      <View className="flex-row items-center justify-between w-[90%]">
                        {/* Display the subject name directly */}
                        <Text className="text-base text-white">
                          {subjectObj.subject}
                        </Text>

                        {/* Dropdown component for selecting the tutor */}
                        <Dropdown
                          key={subjectObj.subject} // Unique key for each subject
                          style={styles.dropdown}
                          data={createSubjectOptions([subjectObj])}
                          labelField="label"
                          valueField="value"
                          placeholder="Select Tutor"
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          itemTextStyle={styles.itemTextStyle}
                          iconStyle={styles.iconStyle}
                          value={
                            tutors.find((t) => t.subject === subjectObj.subject)
                              ?.tutorId || "No Tutors"
                          } // Track selected tutor ID
                          onChange={(item) => {
                            const subject = subjectObj.subject; // Get the subject name
                            const tutorId = item.value; // Get the selected tutor ID

                            // Update the tutors state, ensuring no duplicate entries for the same subject
                            setTutors((prevTutors) => {
                              const existingIndex = prevTutors.findIndex(
                                (t) => t.subject === subject
                              );
                              if (existingIndex !== -1) {
                                // Replace the existing tutor
                                const updatedTutors = [...prevTutors];
                                updatedTutors[existingIndex].tutorId = tutorId;
                                return updatedTutors;
                              }
                              // Add new subject-tutor pair
                              return [...prevTutors, { subject, tutorId }];
                            });

                            // Optionally, you could set the selected ID back to the subject object
                            subjectObj.selectedTutorId = tutorId; // This line is optional as it might not re-render
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
            {loading ? (
              <ActivityIndicator size="large" color="#FEA07D" />
            ) : (
              <>
                {status === "tutor" && (
                  <TouchableOpacity
                    className={`bg-primary p-3 border-none rounded-xl mt-10 ${
                      !isFormValid(status) ? "opacity-50" : ""
                    }`}
                    style={styles.shadow}
                    onPress={() => {
                      signUp();
                    }}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                )}
                {status === "student" && (
                  <TouchableOpacity
                    className={`bg-primary p-3 border-none rounded-xl mt-10 ${
                      !isFormValid(status) ? "opacity-50" : ""
                    }`}
                    style={styles.shadow}
                    onPress={() => {
                      signUp();
                    }}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <KeyboardAvoidingView behavior="padding">
          <View className="w-full my-10 flex-row items-center p-3">
          <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image source={icons.leftArrow} />
            </TouchableOpacity>
            <Text className="text-7xl font-pregular text-white mt-7 text-center flex-1">
              learn.
            </Text>
          </View>
          <View className="justify-center items-center">
            <FormField
              value={email}
              placeholder="Enter Email"
              handleChangeText={(text) => setEmail(text)}
            />
            <FormField
              value={password}
              placeholder="Enter Password"
              handleChangeText={(text) => setPassword(text)}
            />

            <View className="w-[full] mt-14 rounded-md flex flex-row justify-between items-center">
              <CustomButton
                title="Tutor"
                handlePress={() => {
                  setModalVisible(!modalVisible);
                  setStatus("tutor");
                }}
                containerStyles="w-[80px] h-[50px] justify-center items-center mx-1 bg-[#741B09] border-2 border-secondary rounded-md"
              />
              <CustomButton
                title="Admin"
                handlePress={() => {
                  setStatus("admin");
                }}
                containerStyles="w-[80px] h-[50px] justify-center items-center mx-1 bg-[#96A70D] border-2 border-secondary rounded-md"
              />
              <CustomButton
                title="Student"
                handlePress={() => {
                  setModalVisible(!modalVisible);
                  setStatus("student");
                }}
                containerStyles="w-[80px] h-[50px] justify-center items-center mx-1 bg-[#1D830A] border-2 border-secondary rounded-md"
              />
            </View>

            {status === "admin" && email !== "" && password !== "" && (
              <View className="h-[100px] w-full justify-center items-center mt-5">
                {loading ? (
                  <ActivityIndicator size="large" color="#4F7978" />
                ) : (
                  <>
                    <CustomButton
                      title="Sign Up"
                      handlePress={() => signUp()} // Ensure to use the correct sign-up function
                      containerStyles="w-[150px] h-[62px] justify-center items-center"
                    />
                  </>
                )}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signUp;

const styles = StyleSheet.create({
  checkboxContainer: {
    width: "67%", // Control CheckBox width for consistency
    backgroundColor: "transparent",
  },
  capacityInput: {
    width: "35%", // Set width to align with the CheckBox
    backgroundColor: "#FFF",
    padding: 5,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    textAlign: "center", // Center-align text inside input
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
