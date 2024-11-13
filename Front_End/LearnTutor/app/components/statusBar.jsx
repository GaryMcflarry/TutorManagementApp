import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import { signOut } from "../../lib/firebase";
import { router } from "expo-router";

const StatusBarWrapper = ({ children, title }) => {
  //getting global state of user from the global provider
  const {setIsLoggedIn, setUser } = useGlobalContext();

  //function to log out user
  const logout = async () => {
    //appwrite function occurs to remove the session
    await signOut();
    //routes to the register page
    router.replace("/sign-in");
    //removes the data of the current logged in user
    // setUser(null);
    //sets the state establishing that no user is logged in anymore
    setUser(null);
    setIsLoggedIn(false);
    Alert.alert("You Have logged out!")
  };

  return (
    <>
      <View
        className="bg-primary h-[10%] items-center p-2 flex-row justify-between px-6"
        style={styles.shadow}
      >
        <Text className="text-white font-pbold text-xl md:text-3xl">{title}</Text>
        <TouchableOpacity onPress={logout} className="ml-4">
          <Image
            source={icons.logout}
            resizeMode="contain"
            className="w-8 h-8 md:w-12 md:h-12"
          />
        </TouchableOpacity>
      </View>

      {children}
      <StatusBar backgroundColor="#FEA07D" style="light" />
    </>
  );
};

const styles = StyleSheet.create({
  //For andriod
  shadow: {
    elevation: 20,
  },
});

export default StatusBarWrapper;
