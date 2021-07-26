// ./pages/TBAUpdate.js

import React , {useState} from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView } from "react-native";
import axios from "axios";
import PageFooter from "../components/PageFooter";
import EventTBAPicker from "../components/EventTBAPicker";
import ActionButton from "../components/ActionButton";
import * as Progress from "react-native-progress";
import Test from "../components/Test.js";

//TBA Token 
const gblToken = "AmlQfa3QBCCadNWB4synlSoHpN3Rby971VVRCUOGlDXS2daf8p5zJV8MtWIdnjld";
const gblServer = "https://www.thebluealliance.com/api/v3/";
const gblHeader =  {headers: {'X-TBA-Auth-Key': gblToken, 'User-Agent': 'Request'},json: true};



const TBAUpdate = (navigation, route) => {
  //set State Variables 
  let [eventSelect,setEventSelect] = useState(0);
  let [progress, setProgress] = useState(0);
  let [indeterminate, setIndeterminate] = useState(true);

  /*******
   * Mainline Database Load 
   *****/
  const load_database = () => {
    if (!eventSelect || eventSelect == 0) {
      alert('Please select an event before pressing Update!');
      return;
    } 
    //initialize progress circle 
    let p = 0;  
    setIndeterminate(false);
    setProgress(p);
    loadRankings();
    loadMatchScores();
    loadOPR();
  } // end load_database 

  /*******
   * Load the Rankings Table 
   *****/
  const loadRankings = () => {
    let url1 = gblServer + "event/" + eventSelect + "/rankings";
    //console.log("URL=",url1);
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");

    axios.get(url1, gblHeader)
      .then(response1 => { 
        ExecuteCommand("Delete from TBA_Rankings where event_id > 0");
        //bulk load Rankings table - build sql parms 
        let qry1 = "";
        let parms1 = [];   
        //console.log("Axios Return");
        for(var i=0;i<response1.data.rankings.length;i++) {
            //console.log("matches played=",response1.data.rankings[i].matches_played);
            //console.log("rank=",response1.data.rankings[i].rank);
            //console.log("record=",response1.data.rankings[i].record);
            //console.log("won=",response1.data.rankings[i].record.wins);
            //console.log("lose=",response1.data.rankings[i].record.losses);
            //console.log("tie=",response1.data.rankings[i].record.ties);
            //console.log("dq=",response1.data.rankings[i].dq);
            //console.log("teamKey=",response1.data.rankings[i].team_key);
            //append comma if we are adding a new set of values to the insert string 
            if(qry1 != "" ) {
                qry1+=",";
            }
            qry1+= "(?,?,?,?,?,?,?)";
            
            let team = parseInt(response1.data.rankings[i].team_key.replace('frc',''));
            parms1.push(ffev,team,response1.data.rankings[i].rank,response1.data.rankings[i].record.wins,response1.data.rankings[i].record.losses, response1.data.rankings[i].record.ties,response1.data.rankings[i].dq);     
        }

        let sql1 =  "INSERT INTO TBA_Rankings (event_id, team_num,rank, won, lost, tie, dq) VALUES " + qry1 + ";" ;
        //console.log("SQL=",sql1);
        //console.log("parms=",parms1);
        ExecuteQuery(sql1,parms1);
        setProgress(1.0);
        }) // end then 
    .catch(error => {
        console.log('Error getting ranking data from TBA Server!')
        }); //end catch 
} // end LoadRankings 

  /*******
   * Load the Match Scoring Table 
   *****/
  const loadMatchScores = () => { 
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
   
    let url2 = gblServer + "event/" + eventSelect + "/matches";
   //console.log("url2=",url2);
   
   axios.get(url2, gblHeader)
    .then(response2 => { 
      ExecuteCommand("Delete from TBA_Data where event_id > 0");
      //bulk load Matches table - build sql parms 
      let qry2 = "";
      let parms2 = [];

      //SwampServer.prototype.SaveTBAMatchData = (event, MatchArr) => {
        let sql2 = "INSERT INTO TBA_Data(event_id,match_num,red_score,blue_score,red_foul,blue_foul,red_adjust,blue_adjust,red_foul_count,blue_foul_count,red_techfoul_count";
        sql2 += ",blue_techfoul_count,red_score_auton,blue_score_auton,red_score_auton_powercell,blue_score_auton_powercell,red_score_initline,blue_score_initline,red_score_teleop";
        sql2 += ",blue_score_teleop,red_score_teleop_powercell,blue_score_teleop_powercell,red_score_controlpanel,blue_score_controlpanel,red_score_endgame,blue_score_endgame,red_rp";
        sql2 += ",blue_rp,red_climb_rp,blue_climb_rp,red_scoring_rp,blue_scoring_rp,red_1_moved,red_2_moved,red_3_moved,blue_1_moved,blue_2_moved,blue_3_moved";
        sql2 += ",red_auton_low,red_auton_outer,red_auton_inner,blue_auton_low,blue_auton_outer,blue_auton_inner,red_tele_low,red_tele_outer,red_tele_inner";
        sql2 += ",blue_tele_low,blue_tele_outer,blue_tele_inner,red_target_color,blue_target_color,red_activated_stage,blue_activated_stage";
        sql2 += ",red_1_climbed,red_2_climbed,red_3_climbed,blue_1_climbed,blue_2_climbed,blue_3_climbed,red_rung_level,blue_rung_level) VALUES ";
        
        let Values = [];
        let RowCount = 0;
        
        response2.data.forEach((item) => {
            if (item.comp_level == "qm" && item.score_breakdown) {
                if(qry2 != "" ) {
                    qry2+=",";
                }
               
                qry2 += " (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
                
                Values.push(ffev, item.match_number);
                Values.push(item.score_breakdown.red.totalPoints, item.score_breakdown.blue.totalPoints);
                Values.push(item.score_breakdown.red.foulPoints, item.score_breakdown.blue.foulPoints);
                Values.push(item.score_breakdown.red.adjustPoints, item.score_breakdown.blue.adjustPoints);
                Values.push(item.score_breakdown.red.foulCount, item.score_breakdown.blue.foulCount);
                Values.push(item.score_breakdown.red.techFoulCount, item.score_breakdown.blue.techFoulCount);
                Values.push(item.score_breakdown.red.autoPoints, item.score_breakdown.blue.autoPoints);
                Values.push(item.score_breakdown.red.autoCellPoints, item.score_breakdown.blue.autoCellPoints);
                Values.push(item.score_breakdown.red.autoInitLinePoints, item.score_breakdown.blue.autoInitLinePoints);
                Values.push(item.score_breakdown.red.teleopPoints, item.score_breakdown.blue.teleopPoints);
                Values.push(item.score_breakdown.red.teleopCellPoints, item.score_breakdown.blue.teleopCellPoints);
                Values.push(item.score_breakdown.red.controlPanelPoints, item.score_breakdown.blue.controlPanelPoints);
                Values.push(item.score_breakdown.red.endgamePoints, item.score_breakdown.blue.endgamePoints);
                Values.push(item.score_breakdown.red.rp, item.score_breakdown.blue.rp);
                switch (item.score_breakdown.red.shieldOperationalRankingPoint) {
                    case "True":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.shieldOperationalRankingPoint) {
                    case "True":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.red.shieldEnergizedRankingPoint) {
                    case "True":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.shieldEnergizedRankingPoint) {
                    case "True":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.red.initLineRobot1) {
                    case "Exited":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.red.initLineRobot2) {
                    case "Exited":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.red.initLineRobot3) {
                    case "Exited":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.initLineRobot1) {
                    case "Exited":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.initLineRobot2) {
                    case "Exited":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.initLineRobot3) {
                    case "Exited":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                Values.push(item.score_breakdown.red.autoCellsBottom, item.score_breakdown.red.autoCellsOuter, item.score_breakdown.red.autoCellsInner);
                Values.push(item.score_breakdown.blue.autoCellsBottom, item.score_breakdown.blue.autoCellsOuter, item.score_breakdown.blue.autoCellsInner);
                Values.push(item.score_breakdown.red.teleopCellsBottom, item.score_breakdown.red.teleopCellsOuter, item.score_breakdown.red.teleopCellsInner);
                Values.push(item.score_breakdown.blue.teleopCellsBottom, item.score_breakdown.blue.teleopCellsOuter, item.score_breakdown.blue.teleopCellsInner);
                switch (item.score_breakdown.red.stage3TargetColor) {
                    case "Yellow":
                        Values.push(4);
                        break;
                    case "Green":
                        Values.push(3);
                        break;
                    case "Blue":
                        Values.push(2);
                        break;
                    case "Red":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.stage3TargetColor) {
                    case "Yellow":
                        Values.push(4);
                        break;
                    case "Green":
                        Values.push(3);
                        break;
                    case "Blue":
                        Values.push(2);
                        break;
                    case "Red":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                if (item.score_breakdown.red.stage3Activated == "True") {
                    Values.push(3);
                } else if (item.score_breakdown.red.stage2Activated == "True") {
                    Values.push(2);
                } else if (item.score_breakdown.red.stage1Activated == "True") {
                    Values.push(1);
                } else {
                    Values.push(0);
                }
                if (item.score_breakdown.blue.stage3Activated == "True") {
                    Values.push(3);
                } else if (item.score_breakdown.blue.stage2Activated == "True") {
                    Values.push(2);
                } else if (item.score_breakdown.blue.stage1Activated == "True") {
                    Values.push(1);
                } else {
                    Values.push(0);
                }
                switch (item.score_breakdown.red.endgameRobot1) {
                    case "Hang":
                        Values.push(3);
                        break;
                    case "Park":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.red.endgameRobot2) {
                    case "Hang":
                        Values.push(3);
                        break;
                    case "Park":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.red.endgameRobot3) {
                    case "Hang":
                        Values.push(3);
                        break;
                    case "Park":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.endgameRobot1) {
                    case "Hang":
                        Values.push(3);
                        break;
                    case "Park":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.endgameRobot2) {
                    case "Hang":
                        Values.push(3);
                        break;
                    case "Park":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.endgameRobot3) {
                    case "Hang":
                        Values.push(3);
                        break;
                    case "Park":
                        Values.push(2);
                        break;
                    case "None":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.red.endgameRungIsLevel) {
                    case "IsLevel":
                        Values.push(2);
                        break;
                    case "NotLevel":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                switch (item.score_breakdown.blue.endgameRungIsLevel) {
                    case "IsLevel":
                        Values.push(2);
                        break;
                    case "NotLevel":
                        Values.push(1);
                        break;
                    default:
                        Values.push(0);
                        break;
                }
                RowCount++;
                let sqlx =  sql2 + qry2 + ";" ;
                ExecuteQuery(sqlx,Values);
                //console.log("sql=",sqlx);
                //console.log("Values",Values); 
                //setProgress(1.0);
                Values = [];
                qry2 = '';
            } // end test for qualifying match 
        }); // end for each 
   
        // If there is anything remaining - send the rest of it
        if (qry2 !="")  {  
            ExecuteQuery(sql2 + qry2.slice(0,-1)+ ";",Values);
        }  // end

        setProgress(1.0);

    }) // end then 
  }

  /*******
   * Load the OPR Table 
   *****/
  const loadOPR = () => { 
    let url3 = gblServer + "event/" + eventSelect + "/oprs";
    //console.log("url3=",url3);
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
    
    axios.get(url3, gblHeader)
      .then(response3 => { 

        /*
        ** Need to Finish ...............................
        */
        ExecuteCommand("Delete from TBA_OPRS where event_id > 0");
        let teamtab = [];
        //bulk load OPR table - build sql parms 
        let qry3 = "";
        let parms3 = [];
        
        // Process CCWMS Object 
        for(let key in response3.data.ccwms) {
            //append comma if we are adding a new set of values to the insert string 
            if(qry3 != "" ) {
                qry3+=",";
            }
            qry3+= "(?,?,?,?)";
            let team3 = parseInt(key.replace('frc',''));
            parms3.push(ffev,team3,0,response3.data.ccwms[key]);
        }

        // Process DPRS Object 
        for(let key1 in response3.data.dprs) {
            //append comma if we are adding a new set of values to the insert string 
            if(qry3 != "" ) {
                qry3+=",";
            }
            qry3+= "(?,?,?,?)";
            let team3a = parseInt(key1.replace('frc',''));
            parms3.push(ffev,team3a,1,response3.data.dprs[key1]);
        }

         // Process OPRS Object 
         for(let key2 in response3.data.oprs) {
            //append comma if we are adding a new set of values to the insert string 
            if(qry3 != "" ) {
                qry3+=",";
            }
            qry3+= "(?,?,?,?)";
            let team3b = parseInt(key2.replace('frc',''));
            parms3.push(ffev,team3b,2,response3.data.oprs[key2]);
        }

        let sql3 =  "INSERT INTO TBA_OPRS(event_id,team_num,type,calc_value) VALUES " + qry3 + ";";
       //console.log("OPRS=",parms3);
        ExecuteQuery(sql3,parms3);
        setProgress(1.0);
      }); 

  } // End loadOPR 

  return (
    <View style={{flex:1, backgroundColor: 'white'}} >
      <KeyboardAvoidingView 
        behavior="padding"
        style={{flex:1, justifyContent: "space-between"}} 
      >
        <View>
          <Text style={styles.TextHeading}>
                Select Event to Update:
          </Text>

          <EventTBAPicker 
            onChangeText={(eventSelect) => {
              setEventSelect(eventSelect);
            }}
          />

          <ActionButton 
            title="Update Scoring, Rankings, and OPRs from TBA" customClick={load_database} > 
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

export default TBAUpdate;

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
