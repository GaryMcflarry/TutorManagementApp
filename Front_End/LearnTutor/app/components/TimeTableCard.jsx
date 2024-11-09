import React, { useEffect, useState } from "react";
import { Card, Text } from "@rneui/themed";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { listenToSessionDetails, deleteSession } from "../../lib/firebase";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const TimeTableCard = ({ sessionId, time, sessionDetails, day }) => {
  const { user, setUser } = useGlobalContext();






  // Dynamic background colors based on subject
  const backgroundColors = {
    English: "#822323",
    Science: "#2B572C",
    Mathematics: "#B5C00B",
    Geography: "#42C0C6",
    default: "#D9D9D9", // Fallback color
  };

  // Function to get the background color based on session details
  const getBackgroundColor = () => {
    if (sessionDetails && sessionDetails.subject) {
      return (
        backgroundColors[sessionDetails.subject] || backgroundColors.default
      );
    }
    return backgroundColors.default; // Return default if sessionDetails is null or subject is missing
  };

  // console.log("Card ID :", sessionId);
  // console.log("Card Time :", time);
  // console.log("Card Details :", sessionDetails);

  if (!sessionId || !sessionDetails) {
    return (
      <Card containerStyle={[styles.card, styles.noSession]}>
        <View style={styles.header}>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.fullname}>No Session</Text>
        </View>
      </Card>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          "Delete Session",
          "Are you sure you want to delete this session?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                try {
                  // Call the deleteSession function and wait for it to complete
                  await deleteSession(sessionId);

                  if (
                    user.availability.includes(`${day}, ${time}, ${sessionId}`)
                  ) {
                   

                    // Filter out any existing entries that match this day and time
                    const filteredAvailability = user.availability.filter(
                      (slot) => !slot.includes(`${sessionId}`)
                    );

                    // Update the user state in the context
                    setUser({
                      ...user, // Keep all other user details
                      availability: filteredAvailability, // Update with the new availability array
                    });

                    // console.log("Updated Availability:", updatedAvailability);
                  }
                  // Show success alert after deletion
                  Alert.alert("Success", "Session was deleted successfully!");
                } catch (error) {
                  Alert.alert(
                    "Error",
                    "There was a problem deleting the session."
                  );
                  console.error("Error deleting session: ", error);
                }
              },
            },
          ]
        );
      }}
    >
      <Card
        containerStyle={[
          styles.card,
          { backgroundColor: getBackgroundColor() },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.subject}>{sessionDetails.subject}</Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.fullname}>{sessionDetails.recipientName}</Text>
          <Text style={styles.fullname}>{sessionDetails.type}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 0,
    width: screenWidth > 768 ? 500 : 300,
    height: screenWidth > 768 ? 150 : 100,
    alignSelf: "center",
    marginBottom: 5,
    elevation: 10,
  },
  header: {
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    backgroundColor: "#FEA07D",
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 5,
  },
  time: {
    margin: 5,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  subject: {
    margin: 5,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  fullname: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  noSession: {
    backgroundColor: "#d3d3d3", // light grey for no session
  },
});

export default TimeTableCard;
