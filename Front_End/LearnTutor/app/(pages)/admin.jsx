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
import { getAllUsers, deleteUser } from "../../lib/firebase";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const handleEdit = (data) => {
    setCurrentData(data);
    // Assuming you have the state variables for these fields
    setFullName(data.fullName);
    setGrade(data.grade);
    setAddress(data.address);
    setModalVisible(true);
    setEditMode(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setUsers(users);
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
        fields.forEach((field) => {
          console.log(
            `${field.charAt(0).toUpperCase() + field.slice(1)}: ${item[field]}`
          );
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
              },
            },
            {
              text: "Delete",
              onPress: () => {
                console.log(
                  "Delete option selected for User ID:",
                  item.uid
                );
                console.log("Full User Information (pre-filter):", item);

                Alert.alert(
                  "Are you sure?",
                  "",
                  [
                    {
                      text: "Yes",
                      onPress: async () => {
                        const success = await deleteUser(item.uid);
                        if (success) {
                          console.log("User deleted successfully");
                          // Optionally, you can refetch the users after deletion
                          const updatedUsers = await getAllUsers();
                          setUsers(updatedUsers);
                        } else {
                          console.log("User deletion failed or was not necessary");
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
