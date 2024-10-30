import { StyleSheet, Text, View, FlatList, ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import StatusBarWrapper from "../components/statusBar";
import TimeTableCard from "../components/TimeTableCard";
import MenuButton from "../components/MenuButton";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getSchedule, fetchSessionDetails } from "../../lib/firebase";
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";


const TimeTable = ({ navigation }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const { user } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const timeRanges = useMemo(() => {
    const startHour = 8; // 08:00
    const endHour = 16; // 16:00
    const ranges = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const start = `${String(hour).padStart(2, "0")}:00`;
      const end = `${String(hour + 1).padStart(2, "0")}:00`;
      ranges.push(`${start} - ${end}`);
    }
    setLoading(false);
    return ranges;
  }, []); // [] dependency ensures it only runs once

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarWrapper title="Timetable">
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
                Add Session
              </Text>
              <Dropdown
                style={styles.dropdown}
                data={[]}
                labelField="label"
                valueField="value"
                placeholder="Select Student"
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemTextStyle}
                conStyle={styles.iconStyle}
                value={null}
                onChange={(item) => {
                 
                }}
              />
              <FormField
                placeholder="Write down homework..."
                // handleChangeText={}
              />
              <View className="w-[270px] h-[310px] border-none rounded-xl bg-[#FFFFFF]">
                
              </View>
              <TouchableOpacity
                className="bg-primary p-3 border-none rounded-xl mt-10"
                style={styles.shadow}
                // onPress={}
              >
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View className="w-full h-[70px] items-center p-3 flex-row justify-between">
          <CustomButton
            title="Add +"
            containerStyles="w-20 h-10 justify-center items-center"
            handlePress={() => setModalVisible(!modalVisible)}
          />
          <MenuButton handlePress={() => navigation.toggleDrawer()} />
        </View>
        <PagerView style={{ flex: 1 }} initialPage={0}>
          {days.map((day) => (
            <View key={day} style={styles.page}>
              <View className="flex-row justify-between items-center px-4">
                <Icon name="chevron-back-outline" color="#4F7978" size={50} />
                <Text className="text-xl mx-8 font-semibold text-[#4F7978]">{day}</Text>
                <Icon name="chevron-forward-outline" color="#4F7978" size={50} />
              </View>
              {loading ? (
                <ActivityIndicator size="large" color="#4F7978" />
              ) : (
                <FlatList
                  data={timeRanges}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => {
                    const matchedAvailability = user.availability.find((avail) => {
                      const [availabilityDay, availabilityTime] = avail.split(", ");
                      return availabilityDay === day && availabilityTime === item;
                    });

                    const sessionId = matchedAvailability
                      ? matchedAvailability.split(", ")[2]
                      : null;

                    return (
                      <TimeTableCard
                        time={item}
                        day={day}
                        sessionId={sessionId}
                        userRole={user.status}
                      />
                    );
                  }}
                  contentContainerStyle={styles.flatListContent}
                />
              )}
            </View>
          ))}
        </PagerView>
      </StatusBarWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
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

export default TimeTable;
