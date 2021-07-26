// ./pages/MatchStrategy.js

import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView,SafeAreaView,StyleSheet, Text} from "react-native";
import MatchPicker from '../components/MatchPicker';
import LineupTable from '../components/LineupTable';
import ForecastSelect from '../components/ForecastSelect';
import ScorecardSum from '../components/ScorecardSum';
import PageFooter from "../components/PageFooter";
import AnalyzeMetricPicker from "../components/AnalyzeMetricPicker";
import AnalyzeComponent from "../components/AnalyzeComponent";

onUpdate = (val) => {
 // this.setState({match: val});
};

const MatchStrategy = (navigation,props ) => {
  let [matchSelect, setMatchSelect] = useState('');
  let [forecastSelect, setForecastSelect] = useState(0);
  let [metricSelect, setMetricSelect] = useState(1);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              
              <MatchPicker onChangeText={
                  (matchSelect) => {
                    setMatchSelect(matchSelect);
                  }
                }
              />

              <LineupTable match={matchSelect}>
              </LineupTable> 

              <Text style={styles.TextHeading}>
                Scores based on Scouting Observations
                </Text>

              <ForecastSelect forecast={forecastSelect}
                onChangeText={
                  (forecastSelect) => {
                    setForecastSelect(forecastSelect);
                  }
                }>
              </ForecastSelect>  

              <ScorecardSum match={matchSelect} forecast={forecastSelect}> 
              </ScorecardSum>

              <AnalyzeMetricPicker metric={metricSelect} 
                onChangeText={
                  (metricSelect) => {
                    setMetricSelect(metricSelect);
                  }
                }
              />
              <AnalyzeComponent 
                // team={teamSelect} 
                team={503} 
                metric={metricSelect} 
              />





          </KeyboardAvoidingView>
        </ScrollView> 
        <PageFooter></PageFooter>
      </View>  
    </SafeAreaView> 
  );
};

export default MatchStrategy;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  TextHeading: {
    marginTop: 20,
    marginLeft:20,
    fontSize: 22,
    color: '#007200',
    fontWeight: "600",
    marginBottom: 0,
  },
});
