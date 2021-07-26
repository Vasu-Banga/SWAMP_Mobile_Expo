// ./pages/ImportFromWeb.js

import React, {useState} from "react";
import { View, StyleSheet, Text,KeyboardAvoidingView} from "react-native";
import SQLite from "react-native-sqlite-storage";
import PageFooter from "../components/PageFooter";
import ActionButton from "../components/ActionButton";
import * as Progress from "react-native-progress";
import axios from "axios";


putLog = (msg) => {
  console.log(msg);
}


const ImportFromWeb = (navigation, route) => {
  let [progress, setProgress] = useState(0);
  let [indeterminate, setIndeterminate] = useState(true);
  
  /*******
   * Mainline Database Load 
   *****/
  const load_database = () => {
    /* 
    ** Call the frog force server and signon to obtain security token  
    */ 
    setIndeterminate(false);
    setProgress(.1);

    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");

    let url2 = "https://frogforce503.org/swamp/KeithScoutingDump?event=" + ffev + "&key=FF503";
    /*
    ** Now that we are logged in go dump the scouting data 
    */
    
    axios.get(url2, {})
      .then(response2 => {
        putLog("Match data received from Frog Force Server!");
        clearTables(response2.data);
    }) //end then 
      .catch(error => {
        putLog('Error getting matchdata from Frogforce Server!')
        putLog(error);
      }); //end catch 
  }
  
  clearTables = (raw_data) => {
    setProgress(.4);
    putLog("Starting create Tables ...");
    ExecuteCommand("Delete from Match_Scouting where event_ID > 0");
    loadData(raw_data);
  }
  
  loadData = (raw_data) => {
    putLog("Ready to Load data...");
    let parameters=[],
        bigqry="";
  
    let sqlInsert = "INSERT INTO Match_Scouting (event_id, match_num,team_num,scoutnum,stationnum, starting_pos,ball_preloads,auton_motion, auton_balls_low, auton_balls_outer, auton_balls_inner, tele_cycle_count, tele_balls_low, tele_balls_outer, tele_balls_inner, floor_shot, batter_shot, trench_shot, truss_shot, center_shot, ending_pos, switch_level, rotation_challenge, position_challenge, defense, scout_name";
    sqlInsert += ",auton_motion_completed,rotation_completed,position_completed,climb_completed,park_completed) VALUES "; 

    // magic
    putLog("Starting Insert transaction...");
    putLog("Rows expected to be inserted="+raw_data.length);

    //percent completed 
    let p1 = .5;
    let p2 = .5/raw_data.length;


    for(var i=0;i<raw_data.length;i++) {
      bigqry += "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
     //*******************
     //calculate summary data fields 
     //*******************
     let am=0;
     if(raw_data[i].auton_motion>0) {
      am=1;
     }
     let rc=0;
     if(raw_data[i].rotation_challenge==3) {
       rc=1;
     }
     let pc=0;
     if(raw_data[i].position_challenge ==3) {
      pc=1;
     }
     let cc = 0;
     let park = 0;
     if(raw_data[i].ending_pos ==1) {
       park=1;
     } else {
       if(raw_data[i].ending_pos >1 && raw_data[i].ending_pos <5 ) {
         cc=1;
       }

     }

      parameters.push(raw_data[i].event_id,raw_data[i].match_num, raw_data[i].team_num, raw_data[i].ScoutNum, raw_data[i].stationNum, raw_data[i].starting_pos,raw_data[i].ball_preloads,raw_data[i].auton_motion, raw_data[i].auton_balls_low, raw_data[i].auton_balls_outer, raw_data[i].auton_balls_inner, raw_data[i].tele_cycle_count, raw_data[i].tele_balls_low, raw_data[i].tele_balls_outer, raw_data[i].tele_balls_inner, raw_data[i].floor_shot, raw_data[i].batter_shot, raw_data[i].trench_shot, raw_data[i].truss_shot, raw_data[i].center_shot, raw_data[i].ending_pos, raw_data[i].switch_level, raw_data[i].rotation_challenge, raw_data[i].position_challenge, raw_data[i].defense, raw_data[i].scout_name,am,rc,pc,cc,park);
      // sending   every 100 records to DB
      if (parameters.length > 1530) {
          //console.log("Sending Insert...");
          p1+=p2;
          if (p1>.95) {p1=.95;}
          setProgress(p1);
          ExecuteQuery(sqlInsert + bigqry + ";" ,parameters);
          // reset the varriables
          parameters= [];
          bigqry = '';
      } else bigqry += ",";
    } // end  for

    // If there is anything remainig - send the rest of it
    if (bigqry !="")  {  
      ExecuteQuery(sqlInsert + bigqry.slice(0,-1)+ ";",parameters);
    }  // end
    putLog("Insert Completed...");
    setProgress(1);
  }  

  return (
    <View style={{flex:1, backgroundColor: 'white'}} >
      <KeyboardAvoidingView 
        behavior="padding"
        style={{flex:1, justifyContent: "space-between"}} 
      >
          <View style={styles.Newsbox}>
                <Text style={styles.TextHeading}>
                    Import Scouting Obervations
                </Text>
          
                <Text style={styles.TextNormal}>
                    This utility deletes all existing scouting observation data from the database on this device and downloads the entire observation data 
                    for this event from the Frog Force Website. This assumes that the scouting team has uploaded 
                    thier observations as the event has progressed. 
  
                </Text>
                <Text> &nbsp;</Text>
            </View>

        <ActionButton 
            title="Import Scouting Data from FF Website" customClick={load_database} > 
          </ActionButton>

        <View style={styles.center}>
            <Progress.Circle
                size={300}
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
     color: "green",
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

export default ImportFromWeb;