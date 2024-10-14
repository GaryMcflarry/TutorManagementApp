import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Children } from "react"
import { StatusBar } from "expo-status-bar";

const StatusBarWrapper = ({ children, title }) =>
{
    return(
        
        <>
        <ScrollView contentContainerStyle={{ height: "100%" }}>

            <View className="bg-primary h-20 justify-center items-center mt-5" style={styles.shadow}>
                {/* <Text className="text-white font-pregular text-xs" style={styles.shadow}>14:43</Text> */}
                <Text className="text-white font-pbold text-xl">{title}</Text>
            </View>
            
            {children}

        </ScrollView><StatusBar backgroundColor="#FEA07D" style="light" />
        </>
        
    )
}

const styles = StyleSheet.create({
    shadow: {
        elevation: 20,
    }
  })
  

export default StatusBarWrapper;