// ./pages/About.js

import React from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView} from "react-native";
import PageFooter from "../components/PageFooter";

const About = (navigation, route) => {
  return (
    <View style={{flex:1, backgroundColor: 'white'}} >
        <KeyboardAvoidingView 
          behavior="padding"
          style={{flex:1, justifyContent: "space-between"}} 
        >
          <View style={styles.center}>
            <Text>This is the about screen</Text>
          </View>
        </KeyboardAvoidingView> 

        <PageFooter></PageFooter>
      </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default About;