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
import { getAllUsers } from "../../lib/firebase";

const Admin = () => {
  const [users, setUsers] = useState([]); // Change to a single users state

  const [editMode, setEditMode] = useState(false);
const [currentData, setCurrentData] = useState(null); // For holding data when editing


const handleEdit = (data) => {
  setCurrentData(data); // Set the current data to the data being edited
  setFullName(data.fullName);
  setGrade(data.grade); // for student
  setAddress(data.address); // for student
  setModalVisible(true); // Show the modal
  setEditMode(true); // Set to edit mode
};


  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers(); // Fetch all users
      setUsers(users); // Store all users

      // You can maintain filtered states if needed
    };

    fetchUsers();
  }, []);

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
        console.log("User ID:", item.uid);
        fields.forEach(field => {
          console.log(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${item[field]}`);
        });

        // Show alert with options
        Alert.alert(
          "Choose an option",
          "What would you like to do?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel option selected"),
              style: "cancel", // Optionally style the cancel button
            },
            {
              text: "Edit",
              onPress: () => {
                // Log all user info when "Edit" is selected
                console.log("Edit option selected for User ID:", item.uid);
                console.log("Full User Information (pre-filter):", item); // Log the entire user object
              },
            },
            {
              text: "Delete",
              onPress: () => {
                // Log all user info when "Delete" is selected
                console.log("Delete option selected for User ID:", item.uid);
                console.log("Full User Information (pre-filter):", item); // Log the entire user object
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

  // Separate data arrays (optional)
  const admins = users.filter((user) => user.status === "admin");
  const tutors = users.filter((user) => user.status === "tutor");
  const students = users.filter((user) => user.status === "student");

  return (
    <SafeAreaView style={styles.container}>
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
});
