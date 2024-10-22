import { StyleSheet, Text, View, Image, Linking, Alert } from "react-native";
import { Card } from "@rneui/themed";
import React from "react";
import { Button } from "@rneui/base";
import { icons } from "../../constants";

const ResourceCard = ({ link }) => {
  // Determine which card to render based on the link

  const renderCardContent = () => {
    // Switch case based on the link content
    switch (true) {
      case link.includes("wa.me"):
        return (
          <View>
            <View
              className="bg-whatsapp justify-center items-center"
              style={[styles.header]}
            >
              <Image source={icons.WhatsAppIcon} className="w-20 h-20" />
            </View>
            <View>
              <View style={{ padding: 10 }}>
                <Text className="text-wGreen font-pbold">
                  WhatsApp Chat Link
                </Text>
                <Text className="font-bold text-sm">
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
                <Text className="text-microsoft font-pbold">
                  Microsoft Teams Session
                </Text>
                <Text className="font-bold text-sm">Join your allocated teams session!</Text>
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

      case link.includes("tutorial"):
        return (
          <View>
            <View
              className="bg-wGreen justify-center items-center"
              style={[styles.header]}
            >
              <Text>{link}</Text>
            </View>
            <View>
              <View style={{ padding: 10 }}>
                <Text className="text-wGreen font-pbold">
                  Tutorial Resource
                </Text>
                <Text>[PH] Description for tutorial resource</Text>
              </View>
            </View>
            <View
              className="justify-center items-center"
              style={{ padding: 15 }}
            >
              <Button
                color={"#558571"}
                containerStyle={{ borderRadius: 15, width: 130 }}
                style={[styles.button]}
                onPress={() => {
                  // Handle the button click, e.g., open tutorial link
                  console.log(`Navigating to: ${link}`);
                }}
              >
                Link Here
              </Button>
            </View>
          </View>
        );

      default:
        return (
          <View>
            <View
              className="bg-wGreen justify-center items-center"
              style={[styles.header]}
            >
              <Text>{link}</Text>
            </View>
            <View>
              <View style={{ padding: 10 }}>
                <Text className="text-wGreen font-pbold">Default Resource</Text>
                <Text>[PH] Description for default resource</Text>
              </View>
            </View>
            <View
              className="justify-center items-center"
              style={{ padding: 15 }}
            >
              <Button
                color={"#558571"}
                containerStyle={{ borderRadius: 15, width: 130 }}
                style={[styles.button]}
                onPress={() => {
                  // Handle the button click, e.g., open default link
                  console.log(`Navigating to: ${link}`);
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
