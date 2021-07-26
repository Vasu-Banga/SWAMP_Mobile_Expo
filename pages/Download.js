// ./pages/Download.js

import React , {useState} from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView } from "react-native";
import axios from "axios";
import PageFooter from "../components/PageFooter";
import EventTBAPicker from "../components/EventTBAPicker";
import ActionButton from "../components/ActionButton";
import * as Progress from "react-native-progress";

//TBA Token 
const gblToken = "AmlQfa3QBCCadNWB4synlSoHpN3Rby971VVRCUOGlDXS2daf8p5zJV8MtWIdnjld";
const gblServer = "https://www.thebluealliance.com/api/v3/";
const gblHeader =  {headers: {'X-TBA-Auth-Key': gblToken, 'User-Agent': 'Request'},json: true};

const Download = (navigation, route) => {
  //set State Variables 
  let [eventSelect,setEventSelect] = useState(0);
  let [progress, setProgress] = useState(0);
  let [indeterminate, setIndeterminate] = useState(true);

  /*******
   * Mainline Database Load 
   *****/
  const load_database = () => {
    if (!eventSelect || eventSelect == 0) {
      alert('Please select an event before pressing Download!');
      return;
    } 
    //initialize progress circle 
    let p = 0;  
    setIndeterminate(false);
    setProgress(p);
    loadEvents();
    loadMatches();
    loadTeams();
  }

  /*******
   * Load the Event Table 
   *****/
  const loadEvents = () => {
    let url1 = gblServer + "event/" + eventSelect;

    axios.get(url1, gblHeader)
      .then(response1 => { 
        ExecuteCommand("Delete from Events where event_id > 0");
        let sql1 = "INSERT INTO Events (event_id, event_key, event_name) VALUES (?,?,?);";
        ExecuteQuery(sql1,[1,eventSelect,response1.data.name]);
      })
  }

  /*******
   * Load the Matches Table 
   *****/
  const loadMatches = () => { 
   let url2 = gblServer + "event/" + eventSelect + "/matches/simple";
   //console.log("url2=",url2);
   
   axios.get(url2, gblHeader)
    .then(response2 => { 
      ExecuteCommand("Delete from Matches where match_num > 0");
      //bulk load Matches table - build sql parms 
      let qry2 = "";
      let parms2 = [];
      for(var i=0;i<response2.data.length;i++) {
        if(response2.data[i].comp_level == "qm") {
          //append comma if we are adding a new set of values to the insert string 
          if(qry2 != "" ) {
            qry2+=",";
          }
          qry2+= "(?,?,?,?,?,?,?,?)";
          let red=response2.data[i].alliances.red.team_keys;
          let blue=response2.data[i].alliances.blue.team_keys;
          let r1 = parseInt(red[0].replace('frc',''));
          let r2 = parseInt(red[1].replace('frc',''));
          let r3 = parseInt(red[2].replace('frc',''));
          let b1 = parseInt(blue[0].replace('frc',''));
          let b2 = parseInt(blue[1].replace('frc',''));
          let b3 = parseInt(blue[2].replace('frc',''));

          parms2.push(response2.data[i].match_number,r1,r2,r3,b1,b2,b3,response2.data[i].predicted_time);
        }  
      }
      let sql2 =  "INSERT INTO Matches (match_num,red_1,red_2,red_3,blue_1,blue_2,blue_3,projected_time) VALUES " + qry2 + ";" ;
      ExecuteQuery(sql2,parms2);
  
    }) // end then 
  }

  /*******
   * Load the Teams Table 
   *****/
  const loadTeams = () => { 
    let url3 = gblServer + "event/" + eventSelect + "/teams/simple";
    //console.log("url3=",url3);
    
    axios.get(url3, gblHeader)
      .then(response3 => { 
        ExecuteCommand("Delete from Teams where team_num > 0");
        
        //bulk load Teams table - build sql parms 
        let qry3 = "";
        let parms3 = [];
        for(var i=0;i<response3.data.length;i++) {
          //append comma if we are adding a new set of values to the insert string 
          if(qry3 != "" ) {
            qry3+=",";
          }
          qry3+= "(?,?)";
          parms3.push(response3.data[i].team_number,response3.data[i].nickname);
        }
        let sql3 =  "INSERT INTO Teams (team_num,team_name) VALUES " + qry3 + ";";
        ExecuteQuery(sql3,parms3);
        let p2 = progress; 
        setProgress(1);
      }); 

  } // End loadTeams 

  return (
    <View style={{flex:1, backgroundColor: 'white'}} >
      <KeyboardAvoidingView 
        behavior="padding"
        style={{flex:1, justifyContent: "space-between"}} 
      >
        <View>
          <Text style={styles.TextHeading}>
                Select Event to Download:
          </Text>

          <EventTBAPicker 
            onChangeText={(eventSelect) => {
              setEventSelect(eventSelect);
            }}
          />

          <ActionButton 
            title="Download Match Schedule and Team List" customClick={load_database} > 
          </ActionButton>
        </View>
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

     <PageFooter></PageFooter>
    </View>
  );
};

export default Download;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  TextHeading: {
    marginTop: 10,
    marginBottom: 0,
    fontSize: 28,
    fontWeight: "500",
    color: "blue",
  },
});
