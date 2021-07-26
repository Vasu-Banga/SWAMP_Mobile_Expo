// ./pages/DatabaseInit.js

import React, {useState} from "react";
import { View, StyleSheet, Text,KeyboardAvoidingView,Dimensions} from "react-native";
import PageFooter from "../components/PageFooter";
import ActionButton from "../components/ActionButton";
import * as Progress from 'react-native-progress';




const DatabaseInit = (navigation, route) => {  
  //get screen dimensions   
  let width = Dimensions.get('window').width;
  let height = Dimensions.get('window').height;
  let processCircleSize = 0 ;
  
  //set size of circular progress bar to half of screen size 
  if(width<height) {
    processCircleSize = width * .5; 
  } else {
    processCircleSize = height * .5; 
  }

  //set state variables 
  let [progress, setProgress] = useState(0);
  let [indeterminate, setIndeterminate] = useState(true);
  let [circlesize, setCirclesize] = useState(processCircleSize);
  let [statusmsg, setStatusmsg] = useState("");
 
  


  const initalize_database = () => {
    let sSQL = ""; 
    //initialize progress circle 
    let p = 0;  
    setIndeterminate(false);
    setProgress(p);

    //number of commands to execute 
    let n = 33; 
    let singlecmd = 1/n;

    //drop tables 
    setStatusmsg("Dropping Tables")
    ExecuteCommand("DROP TABLE IF EXISTS Events");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Matches");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Teams");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Match_Scouting");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Match_Scouting_Auton");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Match_Scouting_Teleop");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Match_Scouting_Endgame");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Temp_Auton");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Temp_Teleop");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Temp_Endgame");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Settings");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS PitScouting");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS TBA_Rankings");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS TBA_Data");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS TBA_OPRS");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS UploadReady");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Picklist");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Alliances");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("DROP TABLE IF EXISTS Alliance_Teams");
    p+=singlecmd;
    setProgress(p);

    //reclaim all free space in database 
    //ExecuteCommand("VACUUM");
    p+=singlecmd;
    setProgress(p);

    //create tables
    setStatusmsg("Creating Tables");
    ExecuteCommand("CREATE TABLE IF NOT EXISTS Events(event_id INTEGER PRIMARY KEY, event_key VARCHAR(30), event_name VARCHAR(60))");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("CREATE TABLE IF NOT EXISTS Matches(match_num INTEGER PRIMARY KEY, red_1 INTEGER, red_2 INTEGER, red_3 INTEGER, blue_1 INTEGER, blue_2 INTEGER, blue_3 INTEGER, projected_time INTEGER)");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("CREATE TABLE IF NOT EXISTS Teams(team_num INTEGER PRIMARY KEY, team_name VARCHAR(30), robot_uri varchar(254))");
    p+=singlecmd;
    setProgress(p);
    
    sSQL = "CREATE TABLE IF NOT EXISTS Match_Scouting(event_id Integer,match_num INTEGER, team_num INTEGER, ";
    sSQL += "scoutnum INTEGER, stationnum INTEGER, starting_pos INTEGER,ball_preloads INTEGER,auton_motion integer, ";
    sSQL += "auton_balls_low INTEGER, auton_balls_outer INTEGER, auton_balls_inner INTEGER, tele_cycle_count INTEGER, ";
    sSQL += "tele_balls_low INTEGER, tele_balls_outer INTEGER, tele_balls_inner INTEGER, floor_shot INTEGER, batter_shot INTEGER,"; 
    sSQL += "trench_shot INTEGER, truss_shot INTEGER, center_shot INTEGER, ending_pos INTEGER, switch_level INTEGER, rotation_challenge INTEGER,"; 
    sSQL += "position_challenge INTEGER, defense INTEGER, scout_name VARCHAR(30),";
    sSQL += "auton_motion_completed INTEGER, rotation_completed INTEGER, position_completed INTEGER, climb_completed INTEGER, park_completed INTEGER,";
    sSQL += " PRIMARY KEY(event_id, match_num,team_num))";
    ExecuteCommand(sSQL);
    p+=singlecmd;
    setProgress(p);


    sSQL = "CREATE TABLE IF NOT EXISTS Temp_Auton(event_id Integer,match_num INTEGER, team_num INTEGER, ";
    sSQL += "scoutnum INTEGER, stationnum INTEGER, starting_pos INTEGER,ball_preloads INTEGER,auton_motion integer, ";
    sSQL += "auton_balls_low INTEGER, auton_balls_outer INTEGER, auton_balls_inner INTEGER, ";
    sSQL += " floor_shot INTEGER, batter_shot INTEGER,trench_shot INTEGER, truss_shot INTEGER, center_shot INTEGER, ";
    sSQL += " PRIMARY KEY(event_id, match_num,team_num))";
    ExecuteCommand(sSQL);
    p+=singlecmd;
    setProgress(p);

    sSQL = "CREATE TABLE IF NOT EXISTS Temp_Teleop(event_id Integer,match_num INTEGER, team_num INTEGER, ";
    sSQL += " tele_cycle_count INTEGER, ";
    sSQL += "tele_balls_low INTEGER, tele_balls_outer INTEGER, tele_balls_inner INTEGER, floor_shot INTEGER, batter_shot INTEGER,"; 
    sSQL += "trench_shot INTEGER, truss_shot INTEGER, center_shot INTEGER, rotation_challenge INTEGER,"; 
    sSQL += "position_challenge INTEGER, defense INTEGER,";
    sSQL += " PRIMARY KEY(event_id, match_num,team_num))";
    ExecuteCommand(sSQL);
    p+=singlecmd;
    setProgress(p);

    sSQL = "CREATE TABLE IF NOT EXISTS Temp_Endgame(event_id Integer,match_num INTEGER, team_num INTEGER, ";
    sSQL += "ending_pos INTEGER, switch_level INTEGER, scout_name VARCHAR(30),";
    sSQL += " PRIMARY KEY(event_id, match_num,team_num))";
    ExecuteCommand(sSQL);
    p+=singlecmd;
    setProgress(p);

    sSQL = "CREATE TABLE IF NOT EXISTS Settings(key varchar(30),val varchar(60), ";
    sSQL += " PRIMARY KEY(key))";
    ExecuteCommand(sSQL);
    p+=singlecmd;
    setProgress(p);


    sSQL = "CREATE TABLE IF NOT EXISTS TBA_Data(event_id INTEGER,match_num INTEGER,red_score INTEGER,blue_score INTEGER,red_foul INTEGER,";
    sSQL += "blue_foul INTEGER,red_adjust INTEGER,blue_adjust INTEGER,red_foul_count INTEGER,blue_foul_count INTEGER,red_techfoul_count INTEGER,";
    sSQL += "blue_techfoul_count INTEGER,red_score_auton INTEGER,blue_score_auton INTEGER,red_score_auton_powercell INTEGER,blue_score_auton_powercell INTEGER,";
    sSQL += "red_score_initline INTEGER,blue_score_initline INTEGER,red_score_teleop INTEGER,blue_score_teleop INTEGER,red_score_teleop_powercell INTEGER,";
    sSQL += "blue_score_teleop_powercell INTEGER,red_score_controlpanel INTEGER,blue_score_controlpanel INTEGER,red_score_endgame INTEGER,blue_score_endgame INTEGER,";
    sSQL += "red_rp INTEGER,blue_rp INTEGER,red_climb_rp INTEGER,blue_climb_rp INTEGER,red_scoring_rp INTEGER,blue_scoring_rp INTEGER,red_1_moved INTEGER,";
    sSQL += "red_2_moved INTEGER,red_3_moved INTEGER,blue_1_moved INTEGER,blue_2_moved INTEGER,blue_3_moved INTEGER,red_auton_low INTEGER,red_auton_outer INTEGER,";
    sSQL += "red_auton_inner INTEGER,blue_auton_low INTEGER,blue_auton_outer INTEGER,blue_auton_inner INTEGER,red_tele_low INTEGER,red_tele_outer INTEGER,";
    sSQL += "red_tele_inner INTEGER,blue_tele_low INTEGER,blue_tele_outer INTEGER,blue_tele_inner INTEGER,red_target_color INTEGER,blue_target_color INTEGER,";
    sSQL += "red_activated_stage INTEGER,blue_activated_stage INTEGER,red_1_climbed INTEGER,red_2_climbed INTEGER,red_3_climbed INTEGER,";
    sSQL += "blue_1_climbed INTEGER,blue_2_climbed INTEGER,blue_3_climbed INTEGER,red_rung_level INTEGER,blue_rung_level INTEGER,";
    sSQL += " PRIMARY KEY (event_id,match_num)) ";
    ExecuteCommand(sSQL);
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("CREATE TABLE IF NOT EXISTS TBA_OPRS(event_ID INTEGER, team_num INTEGER, type integer, calc_value REAL, PRIMARY KEY(event_ID,team_num,type)) ");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("CREATE TABLE IF NOT EXISTS UploadReady(upload_ID INTEGER PRIMARY KEY AUTOINCREMENT, type INTEGER, datakey1 INTEGER, datakey2 INTEGER, datakey3 INTEGER) ");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("CREATE TABLE IF NOT EXISTS Picklist(event_id INTEGER, list_id INTEGER, slot_id INTEGER, team_num INTEGER, team_name varchar(30), rank integer, record varchar(15), inalliance integer, PRIMARY KEY(event_id, list_id, slot_id, team_num)) ");
    p+=singlecmd;
    setProgress(p);

    //ExecuteCommand("CREATE TABLE IF NOT EXISTS Alliances(event_id INTEGER, alliance_id INTEGER, pick_num INTEGER, team_num integer, PRIMARY KEY(event_id, alliance_id, pick_num, team_num)) ");
    //p+=singlecmd;
    //setProgress(p);

    ExecuteCommand("CREATE TABLE IF NOT EXISTS Alliance_Teams(event_id INTEGER, rank INTEGER, team_num INTEGER, alliance_id INTEGER, pick_num INTEGER, PRIMARY KEY(event_id, team_num)) ");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("CREATE TABLE IF NOT EXISTS PitScouting(event_id INTEGER, team_num INTEGER, robot_weight INTEGER, robot_height INTEGER, drivetrain INTEGER, proglang INTEGER, left_start INTEGER, center_start INTEGER, right_start INTEGER, move_towardgoal INTEGER, move_awaygoal INTEGER, comments varchar(254), PRIMARY KEY(event_id, team_num)) ");
    p+=singlecmd;
    setProgress(p);

    ExecuteCommand("CREATE TABLE IF NOT EXISTS TBA_Rankings(event_id Integer,team_num INTEGER, rank INTEGER, won INTEGER, lost INTEGER, tie INTEGER, dq INTEGER, PRIMARY KEY(event_id,team_num))");
    p=1;  
    setProgress(p);
    
  }

  return (
    <View style={{flex:1, backgroundColor: 'white'}} >
      <KeyboardAvoidingView 
        behavior="padding"
        style={{flex:1, justifyContent: "space-between"}} 
      >
        <View>
            <View style={styles.Newsbox}>
                <Text style={styles.TextHeading}>
                    Warning: This Utility Creates a New Database
                </Text>
          
                <Text style={styles.TextNormal}>
                    This utility will delete all existing data in any SWAMP Database. 
              It will create a brand new empty database ready to load data.
              Be Careful, once executed the initialization can not be undone.
                </Text>
                <Text> &nbsp;</Text>
            </View>

            <ActionButton title="Initialize Database" customClick={initalize_database} > 
            </ActionButton>

            <Text style={styles.StatusHeading}>
              {statusmsg}
            </Text>
        </View>

        <View style={styles.center}>
            <Progress.Circle
                size={circlesize}
                thickness={25}
                showsText={true}
                progress={progress}
                indeterminate={indeterminate}
                /> 
        </View>
      </KeyboardAvoidingView> 
      <PageFooter>
      </PageFooter>
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
  Newsbox: {
    // flex: 1,
     marginTop: 20,
     marginLeft:20,
     marginRight:20,
     justifyContent: "center",
     alignItems: "center",
     textAlign: "center",
     borderColor: "#007200",
     borderWidth: 2,
   },
   TextHeading: {
     marginTop: 10,
     fontSize: 28,
     fontWeight: "500",
     marginBottom: 20,
     color: "red",
   },
   TextNormal: {
     fontSize: 20,
     fontWeight: "300",
     textAlign: "left",
   },
   StatusHeading: {
    marginTop: 50,
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 20,
    color: "blue",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default DatabaseInit;