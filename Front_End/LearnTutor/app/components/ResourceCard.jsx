import { StyleSheet, Text, View, Image, Linking, Alert } from "react-native";
import { Card } from "@rneui/themed";
import React from "react";
import { Button } from "@rneui/base";
import { icons } from "../../constants";

const ResourceCard = ({ link, tutorData }) => {
  // Determine which card to render based on the link
  const renderCardContent = () => {
    // Check if link exists
    if (!link && tutorData) {
      // Unique resource card when link is not available but tutor data exists
      return (
        <View>
          <View
            className="bg-tutorRC justify-center items-center"
            style={[styles.header]}
          >
            <Image
              source={icons.TutorResourceCardIcon}
              className="h-[120px] w-[120px]"
            />
          </View>
          <View>
            <View style={{ padding: 10 }}>
              <Text className="text-tutorRC font-pbold md:text-xl">Book a session</Text>
              <Text className="font-bold text-sm">
                Book a session with your tutor!
              </Text>
            </View>
          </View>
          <View className="justify-center items-center" style={{ padding: 15 }}>
            <Button
              color={"#E6C11D"}
              containerStyle={{ borderRadius: 15, width: 130 }}
              style={[styles.button]}
              onPress={() => {}}
            >
              Link Here
            </Button>
          </View>
        </View>
      );
    }

    // Switch case based on the link content
    switch (true) {
      //WhatsApp
      case link.includes("wa.me"):
        return (
          <View>
            <View
              className="bg-whatsapp justify-center items-center h-min-1 w-[100%] rounded-tl-lg rounded-tr-md" 
              style={[styles.header]}
            >
              <Image source={icons.WhatsAppIcon} className="w-20 h-20" />
            </View>
            <View>
              <View style={{ padding: 10 }}>
                <Text className="text-wGreen text-whatsapp font-pbold md:text-xl">
                  WhatsApp Chat Link
                </Text>
                <Text className="font-bold text-sm md:text-lg">
                  Contact Your Tutor via WhatsApp!
                </Text>
              </View>
            </View>
            <View
              className="justify-center items-center"
              style={{ padding: 15 }}
            >
              <Button
                color={"#39753B"}
                containerStyle={{ borderRadius: 15, width: 130 }}
                style={[styles.button]}
                onPress={() => {
                  // Open the link using Linking API
                  if (link) {
                    Linking.openURL(link).catch((err) =>
                      Alert.alert(
                        "An error occurred while opening the link:",
                        err
                      )
                    );
                  } else {
                    Alert.alert("No link available to open.");
                  }
                }}
              >
                Link Here
              </Button>
            </View>
          </View>
        );
      //Microsoft Teams
      case link.includes("microsoft"):
        return (
          <View>
            <View
              className="bg-microsoft justify-center items-center"
              style={[styles.header]}
            >
              <Image source={icons.MicrosoftTeamsIcon} className="w-20 h-20" />
            </View>
            <View>
              <View style={{ padding: 10 }}>
                <Text className="text-microsoft font-pbold md:text-xl">
                  Microsoft Teams Session
                </Text>
                <Text className="font-bold text-sm md:text-lg">
                  Join your allocated teams session!
                </Text>
              </View>
            </View>
            <View
              className="justify-center items-center"
              style={{ padding: 15 }}
            >
              <Button
                color={"#5458AF"}
                containerStyle={{ borderRadius: 15, width: 130 }}
                style={[styles.button]}
                onPress={() => {
                  // Open the link using Linking API
                  if (link) {
                    Linking.openURL(link).catch((err) =>
                      Alert.alert(
                        "An error occurred while opening the link:",
                        err
                      )
                    );
                  } else {
                    Alert.alert("No link available to open.");
                  }
                }}
              >
                Link Here
              </Button>
            </View>
          </View>
        );
      //Telegram
      case link.includes("t.me"):
        // console.log("Link Telegram: ", link);
        return (
          <View>
            <View
              className="bg-telegram justify-center items-center"
              style={[styles.header]}
            >
              <Image source={icons.TelegramIcon} className="h-20 w-20" />
            </View>
            <View>
              <View style={{ padding: 10 }}>
                <Text className="text-telegram font-pbold md:text-xl">
                  Telegram Chat Link
                </Text>
                <Text className="font-bold text-sm md:text-lg">
                  Contact Your Tutor via Telegram!
                </Text>
              </View>
            </View>
            <View
              className="justify-center items-center"
              style={{ padding: 15 }}
            >
              <Button
                color={"#43A9E4"}
                containerStyle={{ borderRadius: 15, width: 130 }}
                style={[styles.button]}
                onPress={() => {
                  // Open the link using Linking API
                  if (link) {
                    Linking.openURL(link).catch((err) =>
                      Alert.alert(
                        "An error occurred while opening the link:",
                        err
                      )
                    );
                  } else {
                    Alert.alert("No link available to open.");
                  }
                }}
              >
                Link Here
              </Button>
            </View>
          </View>
        );
      //Google Meet
      case link.includes("meet.google"):
        // console.log("Link google: ", link);
        return (
          <View>
            <View
              className="bg-gray-100 justify-center items-center"
              style={[styles.header]}
            >
              <Image source={icons.GoogleMeetIcon} className="w-20 h-20" />
            </View>
            <View>
              <View style={{ padding: 10 }}>
                <Text className="text-gray-400 font-pbold md:text-xl">
                  Google Meet Session
                </Text>
                <Text className="font-bold text-sm md:text-lg">
                  Join your allocated session!
                </Text>
              </View>
            </View>
            <View
              className="justify-center items-center"
              style={{ padding: 15 }}
            >
              <Button
                color={"#9ca3af"}
                containerStyle={{ borderRadius: 15, width: 130 }}
                style={[styles.button]}
                onPress={() => {
                  // Open the link using Linking API
                  if (link) {
                    Linking.openURL(link).catch((err) =>
                      Alert.alert(
                        "An error occurred while opening the link:",
                        err
                      )
                    );
                  } else {
                    Alert.alert("No link available to open.");
                  }
                }}
              >
                Link Here
              </Button>
            </View>
          </View>
        );
    }
  };

  return (
    <View>
      <Card containerStyle={[styles.card]}>{renderCardContent()}</Card>
    </View>
  );
};

export default ResourceCard;

const styles = StyleSheet.create({
  //resource card styles
  card: {
    borderRadius: 25,
    height: 280,
    padding: 0,
  },
  header: {
    minHeight: 120,
    width: "100%",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  button: {
    width: 200,
    borderRadius: 40,
  },
});
