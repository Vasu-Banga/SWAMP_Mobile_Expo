// ./screens/TeamDetails.js
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
import TeamScorecard from '../components/TeamScorecard';
import ShotDistribution from "../components/ShotDistribution";
import PageFooter from "../components/PageFooter";

onUpdate = (val) => {
 // this.setState({match: val});
};

const TeamDetails = ({ route,navigation }) => {
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
                Shooting Distribution based on Scouting Observations
                </Text>

              <View style={styles.ShotDistrib} >
                <ShotDistribution 
                  team={teamSelect}>
                </ShotDistribution> 
               </View>

               <Text style={styles.TextHeading}>
                Scores based on Scouting Observations
                </Text>

              <TeamScorecard team={teamSelect}>
               </TeamScorecard> 
            </KeyboardAvoidingView>
          </ScrollView> 
      
        </View>  
        <PageFooter>
      </PageFooter>
      </View>         
        
    </SafeAreaView> 
  
    ); //end return 
} // end teamdetails 

export default TeamDetails;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  TextHeading: {
    marginTop: 10,
    marginLeft:20,
    fontSize: 22,
    color: '#007200',
    fontWeight: "600",
    marginBottom: 0,
  },
  ShotDistrib: {
    marginTop: 5,
    marginLeft:20,
    fontSize: 22,
    color: '#007200',
    fontWeight: "600",
    marginBottom: 0,
  },
});
