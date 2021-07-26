// ./pages/Auton.js

import React, { useCallback, useState } from "react";
import { View,StyleSheet, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import ActionButton from "../components/ActionButton";
import FieldImage from "../components/FieldImage";
import GoalImage from "../components/GoalImage";
import MatchScoring from "../components/MatchScoring";
import StartPosSelect from "../components/StartingPosSelect";
import {useFocusEffect} from '@react-navigation/native';
import BallPreloadSelect from "../components/BallPreloadSelect";
import AutonMotionSelect from "../components/AutonMotionSelect";


const Auton = (props) => {
  //Declare state variables
  const [autonRobotPosition, setautonRobotPosition] = useState(" ");
  const [autonGoalPosition, setautonGoalPosition] = useState(" ");
  const [autonLowGoals, setautonLowGoals] = useState(0);
  const [autonOuterGoals, setautonOuterGoals] = useState(0);
  const [autonInnerGoals, setautonInnerGoals] = useState(0);
  const [flipField, setflipField] = useState(false);
  const [autonBatterShot, setautonBatterShot] = useState(0);
  const [autonCenterShot, setautonCenterShot] = useState(0);
  const [autonFieldShot, setautonFieldShot] = useState(0);
  const [autonTrenchShot, setautonTrenchShot] = useState(0);
  const [autonOtherShot, setautonOtherShot] = useState(0);
  const [startingpos, setStartingpos] = useState(0);
  const [ballpreload, setBallPreload] = useState(0);
  const [autonmotion, setAutonMotion] = useState(0);
  const [matchno,setMatchno] = useState(global.match_num);
  const [scoutpos,setScoutpos] = useState(global.scout_position);
  const [teamtitle,setTeamtitle] = useState(global.team_title);
  const [lastmatch,setLastMatch] = useState(0);


  //function to clear the screen
  const clearScreen = () => {
    console.log("clearing auton screen..."); 
    setautonRobotPosition(" ");
    setautonGoalPosition(" ");
    setautonLowGoals(0);
    setautonInnerGoals(0);
    setautonOuterGoals(0);
    setautonBatterShot(0);
    setautonCenterShot(0);
    setautonFieldShot(0);
    setautonOtherShot(0);
    setautonTrenchShot(0);
    setStartingpos(0);
    setBallPreload(0);
    setAutonMotion(0);

  }
 
  //function to increment shot counters 
  const bumpCounters = (gp) => {
    setautonGoalPosition(gp);
    switch (gp) {
      case "Outer":
        setautonOuterGoals(autonOuterGoals + 1);
        break;
      case "Inner": 
        setautonInnerGoals(autonInnerGoals + 1);
        break;  
      default:
        setautonLowGoals(autonLowGoals + 1);
        break;
    }
    switch(autonRobotPosition) {
      case "Batter":
        let b = autonBatterShot;
        b++;
        setautonBatterShot(b);
        break;
      case "Center":
        let c = autonCenterShot;
        c++;
        setautonCenterShot(c);
        break;
      case "Field":
        let f = autonFieldShot;
        f++;
        setautonFieldShot(f);
        break;
      case "Trench":
        let t= autonTrenchShot;
        t++;
        setautonTrenchShot(t);
        break;
      default: 
        let o = autonOtherShot;
        o++;
        setautonOtherShot(o);
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

  const encode_scout_position = (sp) => {
    let retsp = 0;
    switch(sp) {
      case "Red-1":
        retsp=1;
        break;
      case "Red-2":
        retsp=2;
        break;
      case "Red-3":
        retsp=3;
        break;
      case "Blue-1":
        retsp=4;
        break;
      case "Blue-2":
        retsp=5;
        break;
      case "Blue-3":
        retsp=6;
        break;
    }
    return retsp;
  }

  const save_data = () => {
    console.log("saving auton data...");
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
    let lg = autonLowGoals;
    let og = autonOuterGoals;
    let ig = autonInnerGoals;
    let fs = autonFieldShot;
    let bs = autonBatterShot; 
    let ts = autonTrenchShot;
    let os = autonOtherShot; 
    let cs = autonCenterShot;
    let sp = encode_scout_position(global.scout_position);
    let sn = global.scout.substring(5);
    let sql = "insert or Replace into Temp_Auton(event_id,match_num,team_num,scoutnum,stationnum,starting_pos,ball_preloads,auton_motion, ";
    sql += "auton_balls_low, auton_balls_outer, auton_balls_inner, floor_shot, batter_shot,trench_shot, truss_shot, center_shot) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); ";
    let parms=[ffev, global.match_num,global.team_num,sn,sp,startingpos,ballpreload,autonmotion,lg, og, ig, fs, bs,ts, os, cs];
    
    ExecuteCommand(sql,parms);
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
 
  //mainline processing routine 
  if(lastmatch != matchno) {
    clearScreen();
    setLastMatch(matchno);
  }

  //save data everytime through....
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
                  (autonRobotPosition) => { 
                    setautonRobotPosition(autonRobotPosition);
                  }
                }>
              </FieldImage>

              <GoalImage onChangeText={
                  (autonGoalPosition) => {   
                  bumpCounters(autonGoalPosition);
                  // setautonGoalPosition(autonGoalPosition);
                  }
                }>
              </GoalImage>
            </View>
        
            <View style={{flexDirection: 'column'}}>
              <MatchScoring
                  goalPosition={autonGoalPosition}
                  robotPosition= {autonRobotPosition}
                  lowGoals= {autonLowGoals}
                  batterShot={autonBatterShot}
                  outerGoals= {autonOuterGoals}
                  centerShot={autonCenterShot}
                  innerGoals={autonInnerGoals}
                  fieldShot={autonFieldShot}
                  trenchShot= {autonTrenchShot}
                  otherShot={autonOtherShot}
              />     
              <Text style={styles.optionstexthead}>------Options------</Text>
          </View>

            <View style={styles.optionscontainer}> 
              <View style={{flexDirection: 'row'}}>
              <StartPosSelect startingpos={startingpos}
                    onChangeText={
                      (startingpos) => setStartingpos(startingpos)
                  }
                  >
                  </StartPosSelect>
              </View>
              <View style={{flexDirection: 'row'}}>
              <BallPreloadSelect ballpreload={ballpreload}
                    onChangeText={
                      (ballpreload) => setBallPreload(ballpreload)
                  }
                  >
                  </BallPreloadSelect>
              </View>
              <View style={{flexDirection: 'row'}}>
              <AutonMotionSelect autonmotion={autonmotion}
                    onChangeText={
                      (autonmotion) => setAutonMotion(autonmotion)
                  }
                  >
                  </AutonMotionSelect>
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
 

export default Auton;

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
    marginLeft: 100,
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
    marginBottom: 5,
    fontWeight: "600",
  
  },
});