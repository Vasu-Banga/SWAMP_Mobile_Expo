// ./pages/Submit.js

import React, { useState } from "react";
import { View, StyleSheet, Text} from "react-native";
import {useFocusEffect} from '@react-navigation/native';
import ShotSummary from "../components/ShotSummary";
import ActionButton from "../components/ActionButton";



const Submit = (navigation, route) => {
  //declare state variables 
  const [matchno,setMatchno] = useState(global.match_num);
  const [scoutpos,setScoutpos] = useState(global.scout_position);
  const [teamtitle,setTeamtitle] = useState(global.team_title);
  const [ballpreloads,setBallpreloads] = useState(0);
  const [autonmotion,setAutonmotion] = useState("");
  const [startpos,setStartPos] = useState("");
  const [autonscoredata,setautonscoredata] = useState([]);
  const [teleopscoredata,setteleopscoredata] = useState([]);
  const [defense, setDefense] = useState("");
  const [rotation, setRotation] = useState("");
  const [position, setPosition] = useState("");
  const [climb, setClimb] = useState("");
  const [barlevel, setBarlevel] = useState("");



  const decode_AutonMotion = (am) => {
    let ret = ""; 
    switch(am) {
      case 0:
        ret = "Didn't Move";
        break;
      case 1:
        ret = "Towards Driver";
        break;
      case 2: 
        ret = "Towards Trench";
        break;
      case 3: 
        ret = "Towards Truss";
        break; 
      case 4:
        ret = "Other";
        break;
      default:
        ret="Unknown";
        break;
    }
    return ret; 
  }
  
  const decode_StartingPos = (sp) => {
    let ret = ""; 
    switch(sp) {
      case 0:
        ret = "Unknown";
        break;
      case 1:
        ret = "Left";
        break;
      case 2: 
        ret = "Center";
        break;
      case 3: 
      ret = "Right";
        break; 
    }
    return ret; 
  }
  
  const decode_Defense = (def) => {
    let ret = ""; 
    switch(def) {
      case 0:
        ret = "None";
        break;
      case 1:
        ret = "Zone";
        break;
      case 2: 
        ret = "Target";
        break;
      default:
        ret="Unknown";
        break;
    }
    return ret; 
  }
  
  const decode_ColorWheel = (cw) => {
    let ret = ""; 
    switch(cw) {
      case 1:
        ret = "Didn't Attempt";
        break;
      case 2: 
        ret = "Attempted";
        break;
      case 3: 
        ret = "Completed";
        break;
      default:
        ret="Unknown";
        break;
    }
    return ret; 
  }
  
  const decode_Climb = (cl) => {
    let ret = ""; 
    switch(cl) {
      case 0:
        ret = "Nothing";
        break;
      case 1:
        ret = "Parked";
        break;
      case 2: 
        ret = "Climbed High Side";
        break;
      case 3: 
        ret = "Climbed Low Side";
        break;
      case 4: 
        ret = "Climbed Center";
        break;
      default:
        ret="Unknown";
        break;
    }
    return ret; 
  }
  
  const decode_Barlevel = (bl) => {
    let ret = ""; 
    switch(bl) {
      case 1:
        ret = "Level";
        break;
      default:
        ret="Unknown";
        break;
    }
    return ret; 
  }

  const get_Scoutdata = async () => {
    console.log("Getting Scout Data for submit...");
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
   
    setMatchno(global.match_num);
    setScoutpos(global.scout_position);
    setTeamtitle(global.team_title);

    let sql = "select * from Temp_Auton ";
    sql += " Where event_id = ? and match_num = ? and team_num = ? ";
    let selectQuery = await ExecuteQuery(sql,[ffev,global.match_num,global.team_num]);
    for (let i = 0; i < selectQuery.rows.length; i++) {
      setBallpreloads(selectQuery.rows.item(i).ball_preloads);
      setAutonmotion(decode_AutonMotion(selectQuery.rows.item(i).auton_motion));
      setStartPos(decode_StartingPos(selectQuery.rows.item(i).starting_pos));
 
      const asd = [];
      let dataRow = [];
      let t1 = selectQuery.rows.item(i).auton_balls_low + selectQuery.rows.item(i).auton_balls_outer+selectQuery.rows.item(i).auton_balls_inner;
        dataRow.push("Shots");
        dataRow.push(selectQuery.rows.item(i).auton_balls_low);
        dataRow.push(selectQuery.rows.item(i).auton_balls_outer);
        dataRow.push(selectQuery.rows.item(i).auton_balls_inner);
        dataRow.push(t1);
        dataRow.push('');
        dataRow.push(selectQuery.rows.item(i).batter_shot);
        dataRow.push(selectQuery.rows.item(i).center_shot);
        dataRow.push(selectQuery.rows.item(i).floor_shot);
        dataRow.push(selectQuery.rows.item(i).trench_shot);
        dataRow.push(selectQuery.rows.item(i).truss_shot);
        asd.push(dataRow);
        setautonscoredata(asd);
    } // End for 

    let sql1 = "select * from Temp_Teleop ";
    sql1 += " Where event_id = ? and match_num = ? and team_num = ? ";
    let selectQuery1 = await ExecuteQuery(sql1,[ffev,global.match_num,global.team_num]);
    for (let i = 0; i < selectQuery1.rows.length; i++) {
      setDefense(decode_Defense(selectQuery1.rows.item(i).defense));
      setRotation(decode_ColorWheel(selectQuery1.rows.item(i).rotation_challenge));
      setPosition(decode_ColorWheel(selectQuery1.rows.item(i).position_challenge));
    
      const tsd = [];
      dataRow = [];
      t1 = selectQuery1.rows.item(i).tele_balls_low + selectQuery1.rows.item(i).tele_balls_outer+selectQuery1.rows.item(i).tele_balls_inner;
        dataRow.push("Shots");
        dataRow.push(selectQuery1.rows.item(i).tele_balls_low);
        dataRow.push(selectQuery1.rows.item(i).tele_balls_outer);
        dataRow.push(selectQuery1.rows.item(i).tele_balls_inner);
        dataRow.push(t1);
        dataRow.push('');
        dataRow.push(selectQuery1.rows.item(i).batter_shot);
        dataRow.push(selectQuery1.rows.item(i).center_shot);
        dataRow.push(selectQuery1.rows.item(i).floor_shot);
        dataRow.push(selectQuery1.rows.item(i).trench_shot);
        dataRow.push(selectQuery1.rows.item(i).truss_shot);
        tsd.push(dataRow);
        setteleopscoredata(tsd);
    } // end for 

    let sql2 = "select * from Temp_Endgame ";
    sql2 += " Where event_id = ? and match_num = ? and team_num = ? ";
    let selectQuery2 = await ExecuteQuery(sql2,[ffev,global.match_num,global.team_num]);
    for (let i = 0; i < selectQuery2.rows.length; i++) {
      setClimb(decode_Climb(selectQuery2.rows.item(i).ending_pos));
      setBarlevel(decode_Barlevel(selectQuery2.rows.item(i).switch_level));
    } // end for 
    
  }

  const savedata = () => {
    //TODO -- save data in database .....
  }
  
  //refresh the data when the sceen focus is gained 
  useFocusEffect(
    React.useCallback(() => {
        //do nothing on gaining focus 
        //alert('Submit gained focused');
        get_Scoutdata();
      return () => {
        //do nothing on losing focus 
        //alert('Submit lost focus');
      };
    }, [global.match_num])
  )

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.Title}>Match Scouting Summary</Text>
      </View>
      <View>
        <Text style={styles.blankline}>&nbsp;</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.heading}>Match:</Text>
        <Text style={styles.headingtext}>{matchno}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.heading}>You Scouted:</Text>
        <Text style={styles.headingtext}>{scoutpos}:{teamtitle}</Text>
      </View>
      <View>
        <Text style={styles.blankline}>&nbsp;</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.sectionheading}>Auton</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.heading1}>Start Pos:</Text>
        <Text style={styles.text1}>{startpos}</Text>
        <Text style={styles.heading2}>Preloads:</Text>
        <Text style={styles.text2}>{ballpreloads}</Text>
        <Text style={styles.heading3}>Motion:</Text>
        <Text style={styles.text3}>{autonmotion}</Text>
      </View>
      
      <View>
        <ShotSummary data={autonscoredata}>
        </ShotSummary>
      </View>
      <View>
        <Text style={styles.blankline}>&nbsp;</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.sectionheading}>Teleop</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.heading1}>Defense:</Text>
        <Text style={styles.text1}>{defense}</Text>
        <Text style={styles.heading2}>Rotation:</Text>
        <Text style={styles.text2}>{rotation}</Text>
        <Text style={styles.heading3}>Position:</Text>
        <Text style={styles.text3}>{position}</Text>
      </View>
      <View>
        <ShotSummary data={teleopscoredata}>
        </ShotSummary>
      </View>
      <View>
        <Text style={styles.blankline}>&nbsp;</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.sectionheading}>End Game</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.heading1}>Climb:</Text>
        <Text style={styles.text1}>{climb}</Text>
        <Text style={styles.heading2}>Bar Level:</Text>
        <Text style={styles.text2}>{barlevel}</Text>
      </View>
      <View>
        <Text style={styles.blankline}>&nbsp;</Text>
      </View>
      <View>
        <Text style={styles.warningtext}>Please review the observation data. If it is not correct-goback to the appropriate tab and fix it! Once the data is correct you must press the Save Scouting Button to record your obervations!!!&nbsp;</Text>
      </View>
      <View>
        <Text style={styles.blankline}>&nbsp;</Text>
      </View>
      <ActionButton
           title="Save Scouting Data"
           customClick={savedata}
         />

    </View>
  );
};

export default Submit;

const styles = StyleSheet.create({
 
  container: {
    position: 'absolute',
    top: 10,
    bottom: 0,
    left:10, 
    right: 10,

  },
 
  Title: {
    color: '#111825',
    fontSize: 32,
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  blankline: {
    fontSize: 30,
    fontSize: 24,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 5,
  },

  heading: {
    color: '#111825',
    fontSize: 30,
    fontSize: 24,
    fontWeight: "600",
  },
  headingtext: {
    left:5,
    color: '#0880fd',
    fontSize: 24,
    marginLeft: 5,
    marginRight: 15,
    fontWeight: "500",
  },
  heading1: {
    position: "relative",
    left: 0,
    color: '#111825',
    fontSize: 30,
    fontSize: 24,
    fontWeight: "600",
  },
  text1: {
    position: "relative",
    left:5,
    color: '#0880fd',
    fontSize: 24,
    marginLeft: 5,
    marginRight: 15,
    fontWeight: "500",
  },
  heading2: {
    position: "relative",
    left: 50,
    color: '#111825',
    fontSize: 30,
    fontSize: 24,
    fontWeight: "600",
  },
  text2: {
    position: "relative",
    left: 55,
    color: '#0880fd',
    fontSize: 24,
    marginLeft: 5,
    marginRight: 15,
    fontWeight: "500",
  },

  heading3: {
    position: "relative",
    left: 110,
    color: '#111825',
    fontSize: 30,
    fontSize: 24,
    fontWeight: "600",
  },
  text3: {
    position: "relative",
    left: 120,
    color: '#0880fd',
    fontSize: 24,
    marginLeft: 5,
    marginRight: 15,
    fontWeight: "500",
  },
  sectionheading: {
    color: 'green',
    fontSize: 30,
    fontSize: 24,
    fontWeight: "600",
    marginTop:5,
    marginBottom: 5,
  },
  warningtext: {
    position: "relative",
    left: 5,
    right: 5,
    color: '#0880fd',
    fontSize: 24,
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
    marginBottom: 5,
    fontWeight: "600",
  },
});