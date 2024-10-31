import React, { useEffect, useState } from "react";
import { Card, Text } from "@rneui/themed";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { listenToSessionDetails, deleteSession } from "../../lib/firebase";

const TimeTableCard = ({ sessionId, time, userRole, day }) => {
  
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const getSessionDetails = () => {
      if (sessionId) {
        unsubscribe = listenToSessionDetails(
          sessionId,
          userRole,
          setSessionDetails
        );
      }
      setLoading(false);
    };

    getSessionDetails();

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Unsubscribe from listener to avoid memory leaks
      }
    };
  }, [sessionId, userRole]);

  const subject = sessionDetails?.subject;
  const fullname = sessionDetails?.recipientInfo.fullname;
  const sessionType = sessionDetails?.type;

  // Dynamic background colors based on subject
  const backgroundColors = {
    English: "#822323",
    Science: "#2B572C",
    Mathematics: "#B5C00B",
    Geography: "#B5C00B",
    default: "#D9D9D9", // Fallback color
  };

  const getBackgroundColor = () =>
    backgroundColors[subject] || backgroundColors.default;

  if (loading) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Text style={styles.fullname}>Loading...</Text>
      </View>
    );
  }

  if (!sessionId) {
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
          <Text style={styles.subject}>{subject}</Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.fullname}>{fullname}</Text>
          <Text style={styles.fullname}>{sessionType}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 0,
    width: 300,
    height: 100,
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
