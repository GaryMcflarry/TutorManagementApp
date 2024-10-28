import {
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import StatusBarWrapper from "../components/statusBar";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { listenToUsers, deleteUser, updateUser } from "../../lib/firebase";
import { ActivityIndicator, KeyboardAvoidingView } from "react-native";
import FormField from "../components/FormField";
import { Dropdown } from "react-native-element-dropdown";
import { CheckBox } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const Admin = () => {
  const [users, setUsers] = useState([]);

  //Functionality
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullname, setfullname] = useState("");
  const [chatLink, setChatLink] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [editedUser, setEditedUser] = useState([]);

  const [subjects, setSubjects] = useState([
    { subject: "Mathematics", capacity: 0, selected: false },
    { subject: "English", capacity: 0, selected: false },
    { subject: "Science", capacity: 0, selected: false },
    { subject: "Geography", capacity: 0, selected: false },
  ]);

  const capacityPerSubject = () => {
    // Map through subjects array to create a new array with updated capacities
    const updatedSubjects = subjects.map((subjectObj) => {
      // Filter connections that match the current subject
      const matchedConnections = editedUser.connections.filter((connection) => {
        const [subject] = connection.split(" ");
        return subject === subjectObj.subject;
      });

      // Return a new subject object with the updated capacity and selected flag
      return {
        ...subjectObj,
        selected: matchedConnections.length > 0, // Set selected to true if there are any connections for the subject
        capacity: matchedConnections.length, // Set capacity to the count of matched connections
      };
    });

    setSubjects(updatedSubjects); // Update the state with the modified subjects array
  };

  useEffect(() => {
    if (editedUser.connections) {
      capacityPerSubject();
    }
  }, [editedUser]); // Run whenever editedUser changes

  const removeAssignedSubject = async (subjectName, isSelected) => {
    // Check if the subject has any connected students
    const hasConnectedStudents = editedUser.connections.some((connection) => {
      const [subject, studentId] = connection.includes(" ")
        ? connection.split(" ")
        : [connection, null];
      return subject === subjectName && studentId;
    });

    // Proceed only if the subject is unselected and has no connected students
    if (!isSelected && hasConnectedStudents) {
      // Show an alert if attempting to deselect a subject with connected students
      alert(
        `Cannot remove subject ${subjectName}. Students are currently connected. Remove connections first.`
      );
      return;
    }

    // Update subjects selection in state
    const updatedSubjects = subjects.map((subjectObj) => {
      if (subjectObj.subject === subjectName) {
        return {
          ...subjectObj,
          selected: isSelected, // Set selected state based on the checkbox
        };
      }
      return subjectObj;
    });

    setSubjects(updatedSubjects); // Update subjects state

    // Update editedUser's connections if the subject is being deselected
    if (!isSelected) {
      const updatedConnections = editedUser.connections.filter((connection) => {
        const [subject] = connection.includes(" ")
          ? connection.split(" ")
          : [connection, null];
        return subject !== subjectName; // Keep only connections that don't match the deselected subject
      });

      // Update the editedUser state with the modified connections array
      setEditedUser((prevUser) => ({
        ...prevUser,
        connections: updatedConnections,
      }));
    }
  };

  const decreaseCapacity = async (subjectName) => {
    // Count the minimum capacity based on connections with student IDs
    const minCapacity = editedUser.connections.filter((connection) => {
      // Split each connection into subject and studentId (if it exists)
      const [subject, studentId] = connection.includes(" ")
        ? connection.split(" ")
        : [connection, null];
      // Check if the subject matches and has a connected studentId
      return subject === subjectName && studentId;
    }).length;

    // Map over subjects to update only the relevant subject's capacity
    const updatedSubjects = subjects.map((subjectObj) => {
      if (subjectObj.subject === subjectName) {
        // Check if the current capacity is greater than minCapacity
        if (subjectObj.capacity > minCapacity) {
          // Decrease capacity by 1
          return {
            ...subjectObj,
            capacity: subjectObj.capacity - 1,
          };
        } else {
          // Show alert if trying to decrease below connected students count
          alert(
            `Cannot decrease capacity. ${minCapacity} student(s) currently connected. Remove connections first.`
          );
        }
      }
      return subjectObj; // Return other subjects unchanged
    });

    setSubjects(updatedSubjects); // Update the state with the modified subjects array
  };

  const increaseCapacity = async (subjectName) => {
    // Use map to create a new array and avoid direct mutation
    const updatedSubjects = subjects.map((subjectObj) => {
      // Check if the subject matches the given subject name
      if (subjectObj.subject === subjectName) {
        // Increase capacity for the matching subject
        return {
          ...subjectObj,
          capacity: subjectObj.capacity + 1, // Increment the capacity by 1
        };
      }
      return subjectObj; // Return the subject unchanged if it's not a match
    });

    setSubjects(updatedSubjects); // Update the state with the new subjects array
  };

  const handleUpdateUser = async () => {
    // Log values for debugging
    // console.log("Updating user with values:", {
    //   fullname,
    //   chatLink,
    //   meetingLink,
    // });

    setLoading(true);
    // Check if any required fields are empty
    if (fullname === "" || chatLink === "" || meetingLink === "") {
      Alert.alert("Please input all fields!"); // Alert if any field is empty
    } else {
      const response = await updateUser(
        editedUser,
        subjects,
        setEditedUser,
        fullname,
        chatLink,
        meetingLink
      );

      // Check the response from updateUser
      if (response) {
        Alert.alert("User has been updated!");
      } else {
        Alert.alert("An error has occurred");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = listenToUsers(setUsers); // Set up the listener

    // Clean up the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array to run only once on mount

  const renderTableHeader = (headers) => (
    <View style={styles.tableHeader}>
      {headers.map((header, index) => (
        <Text key={index} style={styles.headerText}>
          {header}
        </Text>
      ))}
    </View>
  );

  const renderTableRow = ({ item }, fields) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => {
        // console.log("User ID:", item.uid);
        fields.forEach((field) => {
          // console.log(
          //   `${field.charAt(0).toUpperCase() + field.slice(1)}: ${item[field]}`
          // );
        });

        // Show alert with options
        Alert.alert(
          "Choose an option",
          "What would you like to do?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel option selected"),
              style: "cancel",
            },
            {
              text: "Edit",
              onPress: () => {
                console.log("Edit option selected for User ID:", item.uid);
                console.log("Full User Information (pre-filter):", item);
                setEditedUser(item); // Set the edited user first
                setChatLink(item.chatLink || ""); // Set chatLink to item value or empty string
                setMeetingLink(item.meetingLink || ""); // Set meetingLink to item value or empty string
                setfullname(item.fullname || ""); // Set fullname to item value or empty string
                setModalVisible(true);
              },
            },
            {
              text: "Delete",
              onPress: () => {
                console.log("Delete option selected for User ID:", item.uid);
                //console.log("Full User Information (pre-filter):", item);

                Alert.alert(
                  "Are you sure?",
                  "",
                  [
                    {
                      text: "Yes",
                      onPress: async () => {
                        const success = await deleteUser(item.uid);
                        if (success) {
                          //console.log("User deleted successfully");
                          // Optionally, you can refetch the users after deletion
                          const updatedUsers = await getAllUsers();
                          setUsers(updatedUsers);
                        } else {
                          console.log(
                            "User deletion failed or was not necessary"
                          );
                        }
                      },
                    },
                    {
                      text: "No",
                      onPress: () => console.log("No selected"),
                      style: "cancel",
                    },
                  ],
                  { cancelable: true }
                );
              },
            },
          ],
          { cancelable: true }
        );
      }}
    >
      {fields.map((field, index) => (
        <Text key={index} style={styles.cellText}>
          {item[field]}
        </Text>
      ))}
    </TouchableOpacity>
  );

  const admins = users.filter((user) => user.status === "admin");
  const tutors = users.filter((user) => user.status === "tutor");
  const students = users.filter((user) => user.status === "student");

  return (
    <SafeAreaView style={styles.container}>
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
                  setEditedUser([]);
                }}
              >
                <Text style={styles.textStyle} className="text-lg text-white">
                  X
                </Text>
              </TouchableOpacity>
            </View>
            {editedUser.status === "tutor" && (
              <>
                <Text className="mb-5 text-center text-white font-bold text-lg">
                  Edit Tutor Information
                </Text>

                <FormField
                  placeholder="Full Name" // Placeholder to show in the input
                  value={fullname} // Bind the input value to fullname state
                  handleChangeText={(text) => setfullname(text)} // Update fullname state on change
                />

                <FormField
                  placeholder="Chat Link" // Placeholder to show in the input
                  value={chatLink} // Bind the input value to chatLink state
                  handleChangeText={(text) => setChatLink(text)} // Update chatLink state on change
                />

                <FormField
                  placeholder="Meeting Link" // Placeholder to show in the input
                  value={meetingLink} // Bind the input value to meetingLink state
                  handleChangeText={(text) => setMeetingLink(text)} // Update meetingLink state on change
                />

                <View className="w-full p-3">
                  {subjects.map((subjectObj, index) => (
                    <View key={index}>
                      <View className="flex-row items-center justify-evenly w-[90%]">
                        <CheckBox
                          title={subjectObj.subject}
                          checked={subjectObj.selected}
                          onPress={() =>
                            removeAssignedSubject(
                              subjectObj.subject,
                              !subjectObj.selected
                            )
                          }
                          containerStyle={styles.checkboxContainer}
                          checkedColor="#FEA07D"
                          uncheckedColor="#FFFFFF"
                          textStyle={{ color: "white" }}
                        />
                        {subjectObj.selected && (
                          <>
                            <View className="flex-row">
                              <TouchableOpacity
                                onPress={() => {
                                  decreaseCapacity(subjectObj.subject);
                                }}
                              >
                                <Ionicons
                                  name="caret-down-outline"
                                  size={24}
                                  color="white"
                                />
                              </TouchableOpacity>
                              <Text className="text-white text-base">
                                {subjectObj.capacity}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  increaseCapacity(subjectObj.subject);
                                }}
                              >
                                <Ionicons
                                  name="caret-up-outline"
                                  size={24}
                                  color="white"
                                />
                              </TouchableOpacity>
                            </View>
                          </>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
            {/* {status === "student" && (
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
                        <Text className="text-base text-white">
                          {subjectObj.subject}
                        </Text>

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
            )} */}
            {loading ? (
              <ActivityIndicator size="large" color="#FEA07D" />
            ) : (
              <>
                {editedUser.status === "tutor" && (
                  <TouchableOpacity
                    className={`bg-primary p-3 border-none rounded-xl mt-10`}
                    style={styles.shadow}
                    onPress={() => {
                      handleUpdateUser();
                    }}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                )}
                {/* {status === "student" && ( */}
                {/* <TouchableOpacity
                    className={`bg-primary p-3 border-none rounded-xl mt-10 ${
                      !isFormValid(status) ? "opacity-50" : ""
                    }`}
                    style={styles.shadow}
                    onPress={() => {
                      signUp();
                    }}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity> */}
                {/* )} */}
              </>
            )}
          </View>
        </View>
      </Modal>

      <StatusBarWrapper title="Admin">
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Add User"
            containerStyles="h-[45px] w-[100px] items-center justify-center"
            handlePress={() => router.push("sign-up")}
          />
        </View>

        {/* Admin Table */}
        <Text style={styles.tableTitle}>Admins</Text>
        <FlatList
          data={admins}
          ListHeaderComponent={() => renderTableHeader(["Email"])}
          renderItem={(item) => renderTableRow(item, ["email"])}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.tableContainer}
        />

        {/* Tutor Table */}
        <Text style={styles.tableTitle}>Tutors</Text>
        <FlatList
          data={tutors}
          ListHeaderComponent={() => renderTableHeader(["Full Name", "Email"])}
          renderItem={(item) => renderTableRow(item, ["fullname", "email"])}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.tableContainer}
        />

        {/* Student Table */}
        <Text style={styles.tableTitle}>Students</Text>
        <FlatList
          data={students}
          ListHeaderComponent={() =>
            renderTableHeader(["Full Name", "Email", "Address", "Grade"])
          }
          renderItem={(item) =>
            renderTableRow(item, ["fullname", "email", "address", "grade"])
          }
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.tableContainer}
        />
      </StatusBarWrapper>
    </SafeAreaView>
  );
};

export default Admin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: "center",
    padding: 10,
  },
  tableContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 10,
  },
  headerText: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "#4F7978",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#FEA07D",
  },
  cellText: {
    flex: 1,
    textAlign: "center",
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    color: "#4F7978",
  },
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
