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
import {
  listenToUsers,
  deleteUser,
  updateUser,
  getAvailableTutors,
  fetchRecipientInfo,
  deleteAssociations
} from "../../lib/firebase";
import { ActivityIndicator, KeyboardAvoidingView } from "react-native";
import FormField from "../components/FormField";
import { Dropdown } from "react-native-element-dropdown";
import { CheckBox } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const Admin = () => {
  //FUNCTIONALITY:
  //Obtaining all users for displaying:
  const [users, setUsers] = useState([]);

  //Grouping/filtering the obtained user based of their roles
  const admins = users.filter((user) => user.status === "admin");
  const tutors = users.filter((user) => user.status === "tutor");
  const students = users.filter((user) => user.status === "student");

  //Fetching all the users upon page load
  useEffect(() => {
    const unsubscribe = listenToUsers(setUsers);

    return () => {
      unsubscribe();
    };
  }, []);

  //Loading icons
  const [loading, setLoading] = useState(false);
  //Dialog box functionality (Modal)
  const [modalVisible, setModalVisible] = useState(false);
  //Modal display effects
  const [fadeOut, setFadeOut] = useState(false); // State for fade-out effect
  //Storing user info of the current user to be edited
  const [editedUser, setEditedUser] = useState([]);

  //Main function for taking obtained data from tutor and student to store on the database
  const handleUpdateUser = async () => {
    setLoading(true);

    if (editedUser.status === "tutor") {
      if (fullname === "" || chatLink === "" || meetingLink === "") {
        Alert.alert("Please input all fields!");
      } else {
        const response = await updateUser(
          editedUser,
          subjects,
          setEditedUser,
          fullname,
          meetingLink,
          chatLink,
          grade,
          address,
          null,
          null
        );

        if (response) {
          Alert.alert("User has been updated!");
        } else {
          Alert.alert("An error has occurred");
        }
      }
    } else {
      const connectionsArray = selectedTutors
        .map((tutor) => `${tutor.subject} ${tutor.tutorId}`)
        .filter(Boolean);

      const response = await updateUser(
        editedUser,
        subjects,
        setEditedUser,
        fullname,
        meetingLink,
        chatLink,
        grade,
        address,
        connectionsArray,
        tutorsToDelete
      );
      if (response) {
        Alert.alert("User has been updated!");
      } else {
        Alert.alert("An error has occurred");
      }
    }
    setLoading(false);
  };

  //===============================================================================

  //Roles
  const [fullname, setfullname] = useState("");

  //===============================================================================

  //TUTOR
  //Capturing the chatlink text
  const [chatLink, setChatLink] = useState("");
  //Capturing the meetingLink text
  const [meetingLink, setMeetingLink] = useState("");
  //Whenever a new edited user is used, it calls the capacitypersubject function
  useEffect(() => {
    if (editedUser.connections) {
      capacityPerSubject();
    }
  }, [editedUser]); // Run whenever editedUser changes
  //Creating layout for subjects to be used for editing tutor details (Dialog box)
  const [subjects, setSubjects] = useState([
    { subject: "Mathematics", capacity: 0, selected: false },
    { subject: "English", capacity: 0, selected: false },
    { subject: "Science", capacity: 0, selected: false },
    { subject: "Geography", capacity: 0, selected: false },
  ]);

  //Taking the template of the subjects state and seeing the current tutors amount of that subject
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
  //When trying to remove a tutor from teaching a entire subject
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
  //When trying to lower the amount of student slots per subject
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
  //When trying to add to the amount of student slots for a subject for a tutor
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

  //===============================================================================

  //STUDENT
  //Storing the grade text to be stored
  const [grade, setGrade] = useState("");
  //Storing the grade text to be stored
  const [address, setAddress] = useState("");
  //Obtaining all the tutor info connected to the current conencted student
  const [tutorData, setTutorData] = useState([]);
  useEffect(() => {
    const loadTutors = async () => {
      if (
        modalVisible &&
        editedUser.status === "student" &&
        editedUser.connections
      ) {
        const tutorInfoPromises = editedUser.connections
        .map((connection) => {
          const [subject, tutorId] = connection.split(" ");
          // Only return if tutorId is valid (not null, undefined, or "NoTutors")
          if (tutorId && tutorId !== "NoTutors") {
            return fetchRecipientInfo(tutorId).then((info) => ({
              subject,
              tutorId,
              fullname: info.fullname,
            }));
          }
          // Return null for invalid tutorId to filter them out later
          return subject;
        })
        .filter(Boolean); // Remove any null entries
      
      // Now, tutorInfoPromises contains only valid tutorId and fullname pairs

        // Resolve all promises and set the array of tutor data
        const tutorsInfo = await Promise.all(tutorInfoPromises);
        //console.log("TUTOR INFO: ", tutorsInfo);
        setTutorData(tutorsInfo);
        // console.log("TUTOR DATA: ", tutorsInfo); // Log tutorsInfo directly
      }
    };

    loadTutors();
  }, [editedUser, modalVisible]);

  // Storing all avaialble tutors, grouped by the subject for selection
  const [availableSubjects, setAvailableSubjects] = useState([]);
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const groupedTutors = await getAvailableTutors();
        setAvailableSubjects(groupedTutors);
      } catch (error) {
        console.error("Failed to load tutors:", error);
      }
    };

    fetchTutors();
  }, [editedUser.connections]);

  // Taking all avaialble tutor per subject to display as options in dropdown
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
  //Keeping track of any tutor who were removed from a student to delete connection from database
  const [tutorsToDelete, setTutorsToDelete] = useState([]);
  //Keeping track of available tutors who were selected for the students subject
  const [selectedTutors, setSelectedTutors] = useState([]);
  //Function to obtain the neccesary information to delete the connection for the student and tutor
  const handleRemoveConnection = (subject) => {
    Alert.alert(
      "Remove Connection?",
      "This will remove all exisitng data between these users",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            setLoading(true);
  
            let tutorId = null;
  
            setEditedUser((prevUser) => {
              // Find the connection to remove
              const removedConnection = prevUser.connections.find((conn) =>
                conn.includes(subject)
              );
  
              if (removedConnection && removedConnection.includes(" ")) {
                [, tutorId] = removedConnection.split(" ");
                setTutorsToDelete((prevTutors) => [
                  ...prevTutors,
                  `${subject} ${tutorId}`, // Store the subject with tutor ID
                ]);
              }
  
              // Return the updated connections without the removed subject connection
              return {
                ...prevUser,
                connections: prevUser.connections.filter(
                  (conn) => !conn.includes(subject)
                ),
              };
            });
  
            if (tutorId) {
              await deleteAssociations(editedUser.uid, tutorId);
            }
  
            setLoading(false);
          },
        },
      ]
    );
  };

  //===============================================================================

  //UI COMPONENTS
  //Redering for the student edit dialog box
  const renderSubjectRow = (subjectObj, index) => {
    // Check if there is a connection for this subject
    const connection = editedUser.connections.find((conn) =>
      conn.includes(subjectObj.subject)
    );

    let tutorId;
    let tutorName;

    if (connection) {
      const [_, id] = connection.split(" ");
      tutorId = id;

      const tutorInfo = tutorData.find(
        (data) =>
          data.subject === subjectObj.subject && data.tutorId === tutorId
      );

      tutorName = tutorInfo ? tutorInfo.fullname : "No tutors";
    }

    return (
      <View
        key={index}
        className="flex-row items-center justify-between w-[90%]"
      >
        <Text className="text-base mx-5 text-white">{subjectObj.subject}</Text>

        {/* Only display the tutor information if there is a connection */}
        {connection ? (
          <>
            <TouchableOpacity
              onPress={() => {
                handleRemoveConnection(subjectObj.subject);
                setFadeOut(true); // Set fade-out on removal
              }}
              style={{ opacity: fadeOut ? 0.5 : 1 }} // Fade-out effect
            >
              <Text style={styles.tutorNameText}>{tutorName}</Text>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </>
        ) : (
          // If not connected, show dropdown to select available tutors
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
              selectedTutors.find((t) => t.subject === subjectObj.subject)
                ?.tutorId || "No Tutors"
            } // Track selected tutor ID
            onChange={(item) => {
              const subject = subjectObj.subject; // Get the subject name
              const tutorId = item.value; // Get the selected tutor ID

              // Update the tutors state, ensuring no duplicate entries for the same subject
              setSelectedTutors((prevTutors) => {
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
        )}
      </View>
    );
  };
  //Rendering the header of the table
  const renderTableHeader = (headers) => (
    <View style={styles.tableHeader}>
      {headers.map((header, index) => (
        <Text key={index} style={styles.headerText}>
          {header}
        </Text>
      ))}
    </View>
  );
  //Rendering the roe of the table to display the corresponding users information
  const renderTableRow = ({ item }, fields) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => {
        const options = [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel option selected"),
            style: "cancel",
          },
          // Conditionally add the "Edit" option if the user is not an admin
          ...(item.status !== "admin"
            ? [
                {
                  text: "Edit",
                  onPress: () => {
                    console.log("Edit option selected for User ID:", item.uid);
                    console.log("Full User Information (pre-filter):", item);
                    setEditedUser(item); // Set the edited user first

                    if (item.status === "tutor") {
                      setChatLink(item.chatLink || "");
                      setMeetingLink(item.meetingLink || "");
                    } else {
                      setGrade(item.grade || "");
                      setAddress(item.address || "");
                    }
                    setfullname(item.fullname || "");
                    setModalVisible(true);
                  },
                },
              ]
            : []), // No "Edit" option for admins
          {
            text: "Delete",
            onPress: () => {
              console.log("Delete option selected for User ID:", item.uid);

              Alert.alert(
                "Are you sure?",
                "",
                [
                  {
                    text: "Yes",
                    onPress: async () => {
                      const success = await deleteUser(item.uid);
                      if (success) {
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
        ];

        // Show alert with dynamically generated options
        Alert.alert("Choose an option", "What would you like to do?", options, {
          cancelable: true,
        });
      }}
    >
      {fields.map((field, index) => (
        <Text key={index} style={styles.cellText}>
          {item[field]}
        </Text>
      ))}
    </TouchableOpacity>
  );

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
                  setSelectedTutors([]);
                  setTutorsToDelete([]);
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
                          onPress={() =>
                            removeAssignedSubject(
                              subjectObj.subject,
                              !subjectObj.selected
                            )
                          }
                          checked={subjectObj.selected}
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
            {editedUser.status === "student" && (
              <>
                <Text className="mb-5 text-center text-white font-bold text-lg">
                  Edit Student Information
                </Text>

                <FormField
                  placeholder="Full Name" // Placeholder to show in the input
                  value={grade} // Bind the input value to fullname state
                  handleChangeText={(text) => setGrade(text)} // Update fullname state on change
                />
                <FormField
                  placeholder="Grade" // Placeholder to show in the input
                  value={address} // Bind the input value to fullname state
                  handleChangeText={(text) => setAddress(text)} // Update fullname state on change
                />
                <FormField
                  placeholder="Address" // Placeholder to show in the input
                  value={fullname} // Bind the input value to fullname state
                  handleChangeText={(text) => setfullname(text)} // Update fullname state on change
                />

                <View className="w-full p-3">
                  {availableSubjects.map((subjectObj, index) =>
                    renderSubjectRow(subjectObj, index)
                  )}
                </View>
              </>
            )}
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
                      setSelectedTutors([]);
                      setTutorsToDelete([]);

                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                )}
                {editedUser.status === "student" && (
                  <TouchableOpacity
                    className={`bg-primary p-3 border-none rounded-xl mt-10`}
                    style={styles.shadow}
                    onPress={() => {
                      handleUpdateUser();
                      setSelectedTutors([]);
                      setTutorsToDelete([]);
                      setModalVisible(false);
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
    width: "65%", // Control CheckBox width for consistency
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
