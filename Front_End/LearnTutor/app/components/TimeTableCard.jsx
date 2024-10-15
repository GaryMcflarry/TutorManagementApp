import React from 'react';
import { Card, Text } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

const TimeTableCard = ({ time, tutorName, sessionType, subject, online }) => {
  const getBackgroundColor = () => {
    if (sessionType === 'No Session') return styles.noSession;
    return online ? styles.onlineSession : styles.inPersonSession;
  };

  const getSubjectColor = () => {
    switch (subject) {
      case 'Science':
        return styles.science;
      case 'English':
        return styles.english;
      default:
        return styles.defaultSubject;
    }
  };

  return (
    <Card containerStyle={[styles.card, getBackgroundColor()]}>
      <View style={styles.header} className="bg-primary">
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.subject}>{subject}</Text>
      </View>
      <Text style={styles.tutorName}>
        {sessionType === 'No Session' ? 'No Session' : `${tutorName}`}
      </Text>
      <Text style={styles.tutorName}>
      {sessionType === 'No Session' ? 'No Session' : `${online ? 'Online' : 'In Person'}`}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 0,
    width: 300,
    height: 100,
    alignSelf: 'center',
    marginBottom: 5,
    elevation: 10,
  },
  header: {
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 5,
  },
  time: {
    margin: 5,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subject: {
    margin: 5,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tutorName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  onlineSession: {
    backgroundColor: '#2f4f2f', // dark green for online
  },
  inPersonSession: {
    backgroundColor: '#8b0000', // dark red for in-person
  },
  noSession: {
    backgroundColor: '#d3d3d3', // light grey for no session
  },
  defaultSubject: {
    color: 'white',
  },
});

export default TimeTableCard