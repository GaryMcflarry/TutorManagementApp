import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Children } from "react";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons, images } from "../../constants";
import { signOut } from "../../lib/firebase";
import { router } from 'expo-router';

const StatusBarWrapper = ({ children, title }) => {
  //getting global state of user from the global provider
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const logout = async () => {
    //appwrite function occurs to remove the session
    await signOut();
    //routes to the register page
    router.replace("/sign-in");
    //removes the data of the current logged in user
    // setUser(null);
    //sets the state establishing that no user is logged in anymore
    setIsLoggedIn(false);
  };

  return (
    <>
        <View
          className="bg-primary h-20 justify-center items-center p-2"
          style={styles.shadow}
        >
          {/* <Text className="text-white font-pregular text-xs" style={styles.shadow}>14:43</Text> */}
          <Text className="text-white font-pbold text-xl">{title}</Text>
          <TouchableOpacity className="w-full" onPress={logout}>
            <Image
              source={icons.logout}
              resizeMode="contain"
              className="w-8 h-8"
            />
          </TouchableOpacity>
        </View>

        {children}
      <StatusBar backgroundColor="#FEA07D" style="light" />
    </>
  );
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 20,
  },
});

export default StatusBarWrapper;
