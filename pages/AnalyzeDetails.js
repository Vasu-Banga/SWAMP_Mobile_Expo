// ./pages/AnalyzeDetails.js

import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView} from "react-native";
import TeamPicker from '../components/TeamPicker';
import AnalyzeMetricPicker from "../components/AnalyzeMetricPicker";
import AnalyzeComponent from "../components/AnalyzeComponent";
import PageFooter from "../components/PageFooter";

const AnalyzeDetails = (navigation, route) => {
    let [teamSelect, setTeamSelect] = useState('');
    let [metricSelect, setMetricSelect] = useState(1);

  return (
    <View style={{flex:1, backgroundColor: 'white'}} >
        <KeyboardAvoidingView 
          behavior="padding"
          style={{flex:1, justifyContent: "space-between"}} 
        >
             <TeamPicker team={teamSelect} 
                onChangeText={
                  (teamSelect) => {
                    setTeamSelect(teamSelect);
                  }
                }
              />
              <AnalyzeMetricPicker metric={metricSelect} 
                onChangeText={
                  (metricSelect) => {
                    setMetricSelect(metricSelect);
                  }
                }
              />
              <AnalyzeComponent 
                team={teamSelect} 
                metric={metricSelect} 
              />

          <View style={styles.center}>
           
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

export default AnalyzeDetails;