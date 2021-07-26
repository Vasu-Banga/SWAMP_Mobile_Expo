// ./pages/MatchScoutSetup.js

import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
 } from "react-native";

import MatchPicker from "../components/MatchPicker";
import LineupTable from '../components/LineupTable';
import RobotThumbnail from "../components/RobotThumbnail";
import ActionButton from "../components/ActionButton";


const MatchScoutSetup = (props) => {
  let [matchSelect, setMatchSelect] = useState('');
  let [teamSelect, setTeamSelect] = useState('');
  let [teamTitle, setTeamTitle] = useState('');
  let [scoutPosition, setScoutPosition] = useState('');
  let [imagename, setImagename] = useState("../images/no_photo_available.jpg");
  let [lastmatch, setLastMatch] = useState("");


  //search gloabl settings for a given key 
  const findSettingsKey = (searchKey) => {
    let s = global.settings;
    let retval = "";
    for(var i=0;i<s.length;i++) {
      if(s[i].key == searchKey) {
        retval = s[i].value;
      }
    }
    return retval;
  }

  const initalize_match = () => {
    //set globals for other pages to use 
    global.match_num = matchSelect;
    global.team_num = teamSelect;
    global.team_title = teamTitle;
    global.scout_position = scoutPosition;
    global.scout = findSettingsKey("ScoutPos");
    props.navigation.navigate("Auton");
  } 

  const getMatchTeams = async(teamindex) => {
    /*
    ** Go read Matches table from SWAMP database  
    */       
    let sql1 = "SELECT matches.match_num,matches.red_1 as red_1,t1.team_name as red_1_teamname";
    sql1 += ",matches.red_2 as red_2,t2.team_name as red_2_teamname ";
    sql1 += ",matches.red_3 as red_3,t3.team_name as red_3_teamname ";
    sql1 += ",matches.blue_1 as blue_1,t4.team_name as blue_1_teamname ";
    sql1 += ",matches.blue_2 as blue_2,t5.team_name as blue_2_teamname ";
    sql1 += ",matches.blue_3 as blue_3,t6.team_name as blue_3_teamname ";
    sql1 += "FROM matches left outer join teams as t1 on matches.red_1 = t1.team_num ";
    sql1 += "left outer join teams as t2 on matches.red_2 = t2.team_num ";
    sql1 += "left outer join teams as t3 on matches.red_3 = t3.team_num ";
    sql1 += "left outer join teams as t4 on matches.blue_1 = t4.team_num ";
    sql1 += "left outer join teams as t5 on matches.blue_2 = t5.team_num ";
    sql1 += "left outer join teams as t6 on matches.blue_3 = t6.team_num ";
    sql1 += "Where match_num = ?;";

    //get match number to display from state 
    let matchno = matchSelect;
    let selectQuery = await ExecuteQuery(sql1,[matchno]);

    let teamtitles = [];
    let teams=[];

    for (let i = 0; i < selectQuery.rows.length; i++) {
      teams.push(selectQuery.rows.item(i).red_1,selectQuery.rows.item(i).red_2,selectQuery.rows.item(i).red_3,selectQuery.rows.item(i).blue_1,selectQuery.rows.item(i).blue_2,selectQuery.rows.item(i).blue_3);
      teamtitles.push(selectQuery.rows.item(i).red_1+"-"+selectQuery.rows.item(i).red_1_teamname);
      teamtitles.push(selectQuery.rows.item(i).red_2+"-"+selectQuery.rows.item(i).red_2_teamname);
      teamtitles.push(selectQuery.rows.item(i).red_3+"-"+selectQuery.rows.item(i).red_3_teamname);
      teamtitles.push(selectQuery.rows.item(i).blue_1+"-"+selectQuery.rows.item(i).blue_1_teamname);
      teamtitles.push(selectQuery.rows.item(i).blue_2+"-"+selectQuery.rows.item(i).blue_2_teamname);
      teamtitles.push(selectQuery.rows.item(i).blue_3+"-"+selectQuery.rows.item(i).blue_3_teamname); 
    }

    //save values in state 
    setTeamSelect(teams[teamindex]);
    setTeamTitle(teamtitles[teamindex]);

  }

  if(matchSelect != lastmatch) {
    let teamindex = 0 ;
    let s = findSettingsKey("ScoutPos");
    switch(s) {
      case "Scout1":
        teamindex = 0;
        setScoutPosition("Red-1");
        break;
      case "Scout2":
        teamindex = 1; 
        setScoutPosition("Red-2");
        break;
      case "Scout3":
        teamindex = 2;
        setScoutPosition("Red-3");
        break;
      case "Scout4":
        teamindex = 3;
        setScoutPosition("Blue-1");
        break;
      case "Scout5":
        teamindex = 4;
        setScoutPosition("Blue-2");
        break;
      case "Scout6":
        teamindex = 5;
        setScoutPosition("Blue-3");
        break;
      default:
        teamindex = 0;
        setScoutPosition("Red-1");
        break;
    }
    getMatchTeams(teamindex);
    setLastMatch(matchSelect);
  }


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

              <Text style={styles.TextHeading}>Your Scouting Assignment:</Text>
              <Text style={styles.Text}>Position: {scoutPosition}</Text>
              <Text style={styles.Text}>{teamTitle}</Text>
          
              <View style={styles.imagecontainer}>
                <RobotThumbnail team={teamSelect}>
                </RobotThumbnail>
              </View>
          </KeyboardAvoidingView>
         

        </ScrollView> 
        <ActionButton title="Initialize Scouting Match" customClick={initalize_match} > 
            </ActionButton>
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
  imagecontainer: {
    position: "absolute",
    marginLeft:10,
    marginTop:420,
    left: 440,
    width: 300,
    height: 300,
  },
  TextHeading: {
    marginTop: 60,
    marginLeft:20,
    fontSize: 28,
    color: '#f05555',
    fontWeight: "600",
    marginBottom: 0,
  },
  Text: {
    marginTop: 20,
    marginLeft:20,
    fontSize: 32,
    color: 'blue',
    fontWeight: "600",
    marginBottom: 0,
  },
});

export default MatchScoutSetup;