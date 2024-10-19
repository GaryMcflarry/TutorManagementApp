//stater template code
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import GlobalProvider from "../context/GlobalProvider";

SplashScreen.preventAutoHideAsync(); //Preventing hide async before any of the assets have loaded

const RootLayout = () => {
  //laoding all necessary fonts to be used
  //fromt the assets folder, being managed by the constants folder
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  //allows actions to be performed while the page is loading
  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      //Elements should be ready to display before hideAsync, else a empty screen would be displayed
      SplashScreen.hideAsync(); //Hides the native splash screen immediately.
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(pages)" options={{ headerShown: false }} />
        <Stack.Screen name="convo/[query]" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[query]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#FEA07D" style="light" />
    </GlobalProvider>
  );
};

export default RootLayout;
