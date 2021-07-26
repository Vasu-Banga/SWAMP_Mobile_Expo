// ./pages/TeamTBA.js

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import TeamPicker from '../components/TeamPicker';
import TeamTBAScore from '../components/TeamTBAScore';
import TBAAllianceScore from '../components/TBAAllianceScore';
import TBAAllianceCount from '../components/TBAAllianceCount';
import PageFooter from "../components/PageFooter";

onUpdate = (val) => {
 // this.setState({match: val});
};

const TeamTBA = ({ route,navigation }) => {
  let [matchSelect, setMatchSelect] = useState('');
  let [teamSelect, setTeamSelect] = useState('');

  //route.params;
  //console.log("Match=",match);
  return (
      <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1, justifyContent: 'space-between' }}>
              
              <TeamPicker team={teamSelect} onChangeText={
                  (teamSelect) => {
                    setTeamSelect(teamSelect);
                  }
                }
              />
               <Text style={styles.TextHeading}>
                Team Scores based on The Blue Alliance Data
                </Text>

              <TeamTBAScore team={teamSelect}>
              </TeamTBAScore> 

              <Text style={styles.TextHeading}>
                Alliance Scores based on The Blue Alliance Data
                </Text>

              <TBAAllianceScore team={teamSelect}>
              </TBAAllianceScore> 

              <Text style={styles.TextHeading}>
                Alliance Counts based on The Blue Alliance Data
                </Text>

              <TBAAllianceCount team={teamSelect}>
              </TBAAllianceCount> 


            </KeyboardAvoidingView>
          </ScrollView> 
      
        </View>  
        <PageFooter>
      </PageFooter>
      </View>         
        
    </SafeAreaView> 
  
    ); //end return 
} // end teamdetails 

export default TeamTBA;

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
