// ./pages/UploadViaQR.js

import React, {useState} from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView} from "react-native";
import PageFooter from "../components/PageFooter";
import QRCode from 'react-native-qrcode-svg';
import ActionButton from "../components/ActionButton";


const UploadViaQR = (navigation, route) => {
  //set State Variables 
  let [qrData,setQRData] = useState("503");
  let [uploadRows, setUploadRows] = useState(0);
  let [deleteKeys, setDeleteKeys] = useState([]);
  

  const getMatchData = async() => {
    /*
    ** Go read Scouting Observations from SWAMP database  
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
    let matchno = this.state.match;
    let selectQuery = await ExecuteQuery(sql1,[matchno]);
    var rows = selectQuery.rows;

    let red = [];
    let blue = [];

    for (let i = 0; i < rows.length; i++) {
      red.push(rows.item(i).red_1,rows.item(i).red_1_teamname,rows.item(i).red_2,rows.item(i).red_2_teamname,rows.item(i).red_3,rows.item(i).red_3_teamname);
      blue.push(rows.item(i).blue_1,rows.item(i).blue_1_teamname,rows.item(i).blue_2,rows.item(i).blue_2_teamname,rows.item(i).blue_3,rows.item(i).blue_3_teamname); 
    }

    this.setState(state => ({redTeams: red, blueTeams: blue})); 
  } // end getMatchData


  const Process_routine = () => {
    deletePreviousKeys();
    getScoutData();
  }

  /*
  ** Count the number of rows in the UploadReady Table  
  */ 
  const getUploadCount = async() => {       
    let sql1 = "SELECT count(*) as rowcount from UploadReady;";
    let uploadrows = 0;

    let selectQuery = await ExecuteQuery(sql1,[]);
    var rows = selectQuery.rows;
  
    for (let i = 0; i < rows.length; i++) {
      uploadrows = rows.item(i).rowcount;
    }
    //Put the rowcount into the state variable 
    setUploadRows(uploadrows) 
  } // end getUploadCount
  
  /*
  ** copy the match scouting records into the UploadReady Table 
  ** FOR TESTING ONLY ******
  */
  const Process_reload = () => {
    let sql2 = "";
    sql2 = "INSERT INTO UploadReady(type,datakey1,datakey2,datakey3)";
    sql2 += " Select 0 as type,event_id as datakey1,match_num as datakey2, team_num as datakey3 from Match_Scouting ";
    sql2 += " order by event_id, match_num,team_num; ";
    ExecuteCommand(sql2);
    getUploadCount();

  }

  const getScoutData = async() => {
    /*
    ** If there are records to upload in the UploadReady Table 
    ** -- then Go read Scouting Observations from SWAMP database  
    */       
    let sql1 = "SELECT MS.*, UR.upload_ID from Match_Scouting as MS ";
    sql1 += " Inner Join UploadReady as UR on MS.event_id = UR.datakey1 "; 
    sql1 += " and MS.match_num = UR.datakey2 and MS.team_num = UR.datakey3 "; 
    sql1 += " Where UR.type = 0 ";
    sql1 += " Order by MS.event_id, MS.match_num, MS.team_num;"
  
    let selectQuery = await ExecuteQuery(sql1,[]);
    //var rows = selectQuery.rows;
    let qrWork = "";
    let delim = "|";
    let eor = "~";
    let deleteArray = [];
    for (let i = 0; i < selectQuery.rows.length; i++) { 
      qrWork+= selectQuery.rows.item(i).event_id + delim;
      qrWork+= selectQuery.rows.item(i).match_num + delim;
      qrWork+= selectQuery.rows.item(i).team_num + delim;
      qrWork+= selectQuery.rows.item(i).scoutnum + delim;
      qrWork+= selectQuery.rows.item(i).stationnum + delim;
      qrWork+= selectQuery.rows.item(i).starting_pos + delim;
      qrWork+= selectQuery.rows.item(i).ball_preloads + delim;
      qrWork+= selectQuery.rows.item(i).auton_motion + delim;
      qrWork+= selectQuery.rows.item(i).auton_balls_low + delim;
      qrWork+= selectQuery.rows.item(i).auton_balls_outer + delim;
      qrWork+= selectQuery.rows.item(i).auton_balls_inner + delim;
      qrWork+= selectQuery.rows.item(i).tele_cycle_count + delim;
      qrWork+= selectQuery.rows.item(i).tele_balls_low + delim;
      qrWork+= selectQuery.rows.item(i).tele_balls_outer + delim;
      qrWork+= selectQuery.rows.item(i).tele_balls_inner + delim;
      qrWork+= selectQuery.rows.item(i).floor_shot + delim;
      qrWork+= selectQuery.rows.item(i).batter_shot + delim;
      qrWork+= selectQuery.rows.item(i).trench_shot + delim;
      qrWork+= selectQuery.rows.item(i).truss_shot + delim;
      qrWork+= selectQuery.rows.item(i).center_shot + delim;
      qrWork+= selectQuery.rows.item(i).ending_pos + delim;
      qrWork+= selectQuery.rows.item(i).switch_level + delim;
      qrWork+= selectQuery.rows.item(i).rotation_challenge + delim;
      qrWork+= selectQuery.rows.item(i).position_challenge + delim;
      qrWork+= selectQuery.rows.item(i).defense + delim;
      deleteArray.push(selectQuery.rows.item(i).upload_ID);

      //set end of record in barcode 
      qrWork+=eor;
      //max length was 1400 
      if(qrWork.length > 1000) {
        console.log("Bar Code length reached Max!!");
        console.log("No of Records in Bar code = ",i+1);
        //console.log("Delete Keys=",deleteArray);
        //jump out of for loop 
        break;
      }  
       
    }
    console.log("Barcode Data Length=",qrWork.length);
    setQRData(qrWork);
    setDeleteKeys(deleteArray);
  } // end getScoutData
  
  const deletePreviousKeys = () => {
    if(deleteKeys.length == 0) {
      console.log("Nothing to Delete!");
      return;
    } 
    //console.log("Deleting Records ...",deleteKeys);
    let sql3 = "";
    sql3 = "Delete from UploadReady ";
    sql3 += " Where upload_ID in (";
    for(let i = 0;i<deleteKeys.length;i++) {
      if(i>0) {
        sql3+=",";
      }
      sql3+=deleteKeys[i];
    }
    sql3+=") ";
    //console.log("Delete SQL=",sql3);
    ExecuteCommand(sql3);
    setDeleteKeys([]);

    getUploadCount();
  }
  

  //mainline routine - runs every iteration 
  getUploadCount();
  if(qrData == "" ) {
    setQRData("503");
  }
  

  return (
    <View style={{flex:1, backgroundColor: 'white'}} >
        <KeyboardAvoidingView 
          behavior="padding"
          style={{flex:1, justifyContent: "space-between"}} 
        >
          <View>
          <Text style={styles.textHead}>You have {uploadRows} items waiting to Upload!</Text>
          </View>
          <View style={styles.center}>
            <QRCode
                size={300}
                value={qrData}
            />
        </View>
        <View style={{flexDirection: 'row'}}>
            <ActionButton 
              title="Reload Upload Table" customClick={Process_reload} > 
            </ActionButton>
            <ActionButton 
              title="Next Barcode" customClick={Process_routine} > 
            </ActionButton>
         </View>
        </KeyboardAvoidingView> 

        <PageFooter></PageFooter>
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
  textHead: {
    marginTop: 24,
    color: "red",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
  }
});

export default UploadViaQR;