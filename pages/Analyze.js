// ./pages/Analyze.js

import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView, KeyboardAvoidingView} from "react-native";
import PageFooter from "../components/PageFooter";
import MetricPicker from "../components/MetricPicker";
import MetricChart from "../components/MetricChart";

const Analyze = (navigation, route) => {
    let [metricSelect, setMetricSelect] = useState(1);
    let [team, setTeam] = useState(0);

    const Add_Picklist = () => {

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <KeyboardAvoidingView
                        behavior="padding"
                        style={{ flex: 1, justifyContent: 'space-between' }}>
                        
                        <MetricPicker onChangeText={
                                (metricSelect) => {
                                    setMetricSelect(metricSelect);
                                }
                            }
                        />

                        <Text style={styles.headtext}>Top 20 Teams</Text>

                         <MetricChart 
                            metric={metricSelect}>
                        </MetricChart> 
                      
                    </KeyboardAvoidingView>
                </ScrollView> 
                <PageFooter></PageFooter>
            </View>  
        </SafeAreaView> 

    );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  headtext: {
      fontSize: 24, 
      fontWeight: "500",
  },
  text: {
    fontSize: 24, 
    padding: 10
}
});

export default Analyze;