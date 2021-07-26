// ./components/PageFooter.js

import React from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView } from "react-native";

const PageFooter = (navigation, route) => {
  return (
      <View>
        <Text style={styles.FooterTitle}>
            SWAMP
        </Text>
        <Text style={styles.FooterText}>
          Powered by Frog Force
        </Text>
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
  FooterTitle: {
    marginBottom:0,
    justifyContent: "flex-end",
    fontSize: 18,
    fontWeight: "600",
    textAlign: 'center',
    color: 'grey',

  },
  FooterText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: 'center',
    color: 'grey'
  },
  
});

export default PageFooter;