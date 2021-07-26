// ./pages/Teleop.js

import React, { useCallback, useState } from "react";
import { View,StyleSheet, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import ActionButton from "../components/ActionButton";
import FieldImage from "../components/FieldImage";
import GoalImage from "../components/GoalImage";
import MatchScoring from "../components/MatchScoring";
import DefenseStratSelect from "../components/DefenseStratSelect";
import RotationSelect from "../components/RotationSelect";
import PositionSelect from "../components/PositionSelect";
import {useFocusEffect} from '@react-navigation/native';



const Teleop = (props) => {
  //Declare state variables
  const [teleopRobotPosition, setteleopRobotPosition] = useState(" ");
  const [teleopGoalPosition, setteleopGoalPosition] = useState(" ");
  const [teleopLowGoals, setteleopLowGoals] = useState(0);
  const [teleopOuterGoals, setteleopOuterGoals] = useState(0);
  const [teleopInnerGoals, setteleopInnerGoals] = useState(0);
  const [flipField, setflipField] = useState(false);
  const [teleopBatterShot, setteleopBatterShot] = useState(0);
  const [teleopCenterShot, setteleopCenterShot] = useState(0);
  const [teleopFieldShot, setteleopFieldShot] = useState(0);
  const [teleopTrenchShot, setteleopTrenchShot] = useState(0);
  const [teleopOtherShot, setteleopOtherShot] = useState(0);
  const [defense, setDefense] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState(0);
  const [matchno,setMatchno] = useState(global.match_num);
  const [scoutpos,setScoutpos] = useState(global.scout_position);
  const [lastmatch,setLastMatch] = useState(0);
  const [teamtitle,setTeamtitle] = useState(global.team_title);

  
  const save_data = () => {
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");

    let sql = "insert or Replace into Temp_Teleop(event_id,match_num,team_num,tele_cycle_count,tele_balls_low,tele_balls_outer,tele_balls_inner,floor_shot,batter_shot,"; 
    sql += "trench_shot, truss_shot, center_shot, rotation_challenge,position_challenge, defense) ";
    sql += " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); ";
    let parms=[ffev, global.match_num,global.team_num,0,teleopLowGoals,teleopOuterGoals,teleopInnerGoals,teleopFieldShot,teleopBatterShot,teleopTrenchShot,teleopOtherShot,teleopCenterShot,rotation,position,defense];
    
    ExecuteCommand(sql,parms);
  }

  //function to clear the goal counters in state 
  const clearScreen = () => { 
    console.log("clearing Teleop screen..."); 
    setteleopRobotPosition(" ");
    setteleopGoalPosition(" ");
    setteleopLowGoals(0);
    setteleopInnerGoals(0);
    setteleopOuterGoals(0);
    setteleopBatterShot(0);
    setteleopCenterShot(0);
    setteleopFieldShot(0);
    setteleopOtherShot(0);
    setteleopTrenchShot(0);
    setDefense(0);
    setRotation(1);
    setPosition(1);
  }
 
  //function to increment shot counters 
  const bumpCounters = (gp) => {
    setteleopGoalPosition(gp);
    switch (gp) {
      case "Outer":
        setteleopOuterGoals(teleopOuterGoals + 1);
        break;
      case "Inner": 
        setteleopInnerGoals(teleopInnerGoals + 1);
        break;  
      default:
        setteleopLowGoals(teleopLowGoals + 1);
        break;
    }
    switch(teleopRobotPosition) {
      case "Batter":
        setteleopBatterShot(teleopBatterShot + 1);
        break;
      case "Center":
        setteleopCenterShot(teleopCenterShot + 1);
        break;
      case "Field":
        setteleopFieldShot(teleopFieldShot + 1);
        break;
      case "Trench":
        setteleopTrenchShot(teleopTrenchShot + 1);
        break;
      default: 
        setteleopOtherShot(teleopOtherShot + 1);
        break;
    }
  };

  const handleFlipField = () => {
    if(flipField) {
      setflipField(false);
    } else {
      setflipField(true);
    } 
  }  

  useFocusEffect(
    React.useCallback(() => {
      //do nothing on gaining focus 
      setMatchno(global.match_num);
      setScoutpos(global.scout_position);
      setTeamtitle(global.team_title);
      //alert('Screen was focused');
      return () => {
        //database update goes here ... 
      };
    }, [global.match_num])
  )
 
  //Mainline routine 
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
               <FieldImage flipField={flipField} onChangeText={
                   (teleopRobotPosition) => { 
                     setteleopRobotPosition(teleopRobotPosition);
                   }
                 }>
               </FieldImage>
 
               <GoalImage onChangeText={
                   (teleopGoalPosition) => {   
                    bumpCounters(teleopGoalPosition);
                    // setteleopGoalPosition(teleopGoalPosition);
                   }
                 }>
               </GoalImage>
             </View>
 
        
             <View style={{flexDirection: 'column'}}>
              <MatchScoring
                  goalPosition={teleopGoalPosition}
                  robotPosition= {teleopRobotPosition}
                  lowGoals= {teleopLowGoals}
                  batterShot={teleopBatterShot}
                  outerGoals= {teleopOuterGoals}
                  centerShot={teleopCenterShot}
                  innerGoals={teleopInnerGoals}
                  fieldShot={teleopFieldShot}
                  trenchShot= {teleopTrenchShot}
                  otherShot={teleopOtherShot}
              />     
              <Text style={styles.optionstexthead}>------Options------</Text>
          </View>

            <View style={styles.optionscontainer}> 
              <View style={{flexDirection: 'row'}}>
              <DefenseStratSelect defense={defense}
                    onChangeText={
                      (defense) => setDefense(defense)
                  }
                  >
                  </DefenseStratSelect>
              </View>
              <View style={{flexDirection: 'row'}}>
              <RotationSelect rotation={rotation}
                    onChangeText={
                      (rotation) => setRotation(rotation)
                  }
                  >
                  </RotationSelect>
              </View>
              <View style={{flexDirection: 'row'}}>
              <PositionSelect position={position}
                    onChangeText={
                      (position) => setPosition(position)
                  }
                  >
                  </PositionSelect>
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
 

export default Teleop;

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
    color: '#111825',
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
