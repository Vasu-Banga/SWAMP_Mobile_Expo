// ./pages/Endgame.js

import React, { useCallback, useState } from "react";
import { View,StyleSheet, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import ActionButton from "../components/ActionButton";
import ClimbImage from "../components/ClimbImage";
import MatchScoring from "../components/MatchScoring";
import ClimbSelect from "../components/ClimbSelect";
import {useFocusEffect} from '@react-navigation/native';



const Endgame = (props) => {
   //Declare state variables
   const [endgameRobotPosition, setendgameRobotPosition] = useState(" ");
   const [endgameGoalPosition, setendgameGoalPosition] = useState(" ");
   const [flipField, setflipField] = useState(false);
   const [climb, setClimb] = useState(0);
   const [matchno,setMatchno] = useState(global.match_num);
   const [scoutpos,setScoutpos] = useState(global.scout_position);
   const [teamtitle,setTeamtitle] = useState(global.team_title);
   const [lastmatch,setLastMatch] = useState(0);
   const [resetimage,setResetimage] = useState(0);

  //function to clear the goal counters in state 
  const clearScreen = () => {
    console.log("Clearing Endgame Screen...");
    setendgameRobotPosition("Level");
    //force climb bar back to level
    let x = resetimage;
    x++;
    setResetimage(x);
    setClimb(0);
  }
 
  const handleFlipField = () => {
    if(flipField) {
      setflipField(false);
    } else {
      setflipField(true);
    } 
  }  

  const save_data = () => {
    //database update goes here ... 
    console.log("saving Endgame data...");
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
    let barlevel = 0;
    if(endgameRobotPosition == "Level") {
      barlevel=1;
    }
    let sql = "insert or Replace into Temp_Endgame(event_id,match_num,team_num,ending_pos,switch_level,scout_name) ";                    
    sql += " VALUES(?,?,?,?,?,?); ";
    let parms=[ffev, global.match_num,global.team_num,climb, barlevel, "Unknown"];

    ExecuteCommand(sql,parms);
  }

  useFocusEffect(
    React.useCallback(() => {
      //do nothing on gaining focus 
      setMatchno(global.match_num);
      setScoutpos(global.scout_position);
      setTeamtitle(global.team_title);
      //do nothing on gaining focus 
      //alert('Screen was focused');
      return () => {
        
      };
    }, [global.match_num])
  )
 
  if(lastmatch != matchno) {
    clearScreen();
    setLastMatch(matchno);
  }
 
  save_data(); 

  return (
     <View style={styles.container}>
       <View style={{flexDirection: 'row'}}>
         <ActionButton
           title="Flip Field"
           customClick={handleFlipField}
         />
          <ActionButton
           title="Clear Screen"
            customClick={clearScreen}
         />
        <Text style={styles.matchtitle}>Match: {matchno}</Text>
       </View>
 
       <ScrollView keyboardShouldPersistTaps="handled">
           <KeyboardAvoidingView
               behavior="padding"
               style={{ flex: 1, justifyContent: 'space-between' }}>
 
             <View style={{flexDirection: 'row'}}>
               <ClimbImage 
                flipField={flipField} 
                reset={resetimage} 
                onChangeText={
                   (endgameRobotPosition) => { 
                     setendgameRobotPosition(endgameRobotPosition);
                   }
                 }>
               </ClimbImage>
             </View>
 
             <View style={{flexDirection: 'column'}}>
              <MatchScoring
                  goalPosition={" "}
                  robotPosition= {" "}
                  lowGoals= {0}
                  batterShot={0}
                  outerGoals= {0}
                  centerShot={0}
                  innerGoals={0}
                  fieldShot={0}
                  trenchShot= {0}
                  otherShot={0}
              />     
              <Text style={styles.optionstexthead}>------Options------</Text>
          </View>

            <View style={styles.optionscontainer}> 
              <View style={{flexDirection: 'row'}}>
              <ClimbSelect climb={climb}
                    onChangeText={
                      (climb) => setClimb(climb)
                  }
                  >
                  </ClimbSelect>
              </View>
              <View style={{flexDirection: 'row'}}>
              <Text style={styles.optionstext}>Climb Bar:</Text>
              <Text style={styles.optionstextvalue}>{endgameRobotPosition}</Text>
              </View>
            
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.matchteamcontainer}>
          <Text style={styles.matchteam}>Watch {scoutpos}:{teamtitle}</Text>
          </View>
        </View>
  </View>
   );
 };
 

export default Endgame;

const styles = StyleSheet.create({
 
  container: {
    position: 'absolute',
    top: 20,
    bottom: 0,
    left:0, 
    right: 0,

  },
  optionscontainer: {
    position: 'absolute',
    top: 554,
    bottom: 0,
    left:460, 
    right: 0,

  },
  optionstexthead: {
    position: 'absolute',
    left: 460,
    color: '#111825',
    fontSize: 30,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 15,
    fontWeight: "600",
  },
  optionstext: {
    position: 'absolute',
    left: 0,
    color: 'green',
    fontSize: 22,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 15,
    fontWeight: "500",
  },
  optionstextvalue: {
    color: '#0880fd',
    fontSize: 22,
    marginTop: 5,
    marginLeft: 140,
    fontWeight: "600",
  },
  matchtitle: {
    color: '#0880fd',
    fontSize: 36,
    marginTop: 10,
    marginLeft: 150,
    fontWeight: "600",
  },
  matchteamcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  matchteam: {
    color: '#f05555',
    fontSize: 28,
  // marginTop: 5,
    marginBottom: 5,
  //  marginLeft: 100,
    fontWeight: "600",
   
  },
});

