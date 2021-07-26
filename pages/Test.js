// ./pages/Test.js

import React, {useState} from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView} from "react-native";
import PageFooter from "../components/PageFooter";
import QRCode from 'react-native-qrcode-svg';
import ActionButton from "../components/ActionButton";
import TablePicker from "../components/TablePicker";


const Test = (navigation, route) => {
  //set State Variables 
  let [qrData,setQRData] = useState("");
  let [uploadRows, setUploadRows] = useState(0);
  let [deleteKeys, setDeleteKeys] = useState([]);
  
  
  const [tablelist, setTablelist] = React.useState(1);
  
    /*
    ** this routine is called when user clicks next barcode 
    */
    const Process_routine = async() => {
        //remove records from upload table in last barcode 
        deletePreviousKeys();

        //go get the next type of records to load into barcode 
        let sql1 = "SELECT UR.type ";
        sql1 += " from UploadReady as UR"; 
        sql1 += " order by upload_id;";  
        let nextUploadType = ""; 

        let selectQuery3 = await this.ExecuteQuery(sql1,[]);
        for (let i = 0; i < selectQuery3.rows.length; i++) {
            if(nextUploadType == "") {
                nextUploadType = selectQuery3.rows.item(i).type;
            }
        }
        //based on the type process the correct table 
        switch (nextUploadType) {
            //event table 
            case 1:
                process_events();
                break;
            //teams table 
            case 2:
                process_teams();
                break;
            //match schedule 
            case 3: 
                process_matches();
                break;
            //pit data    
            case 4:
                process_pit();
                break;    
        }
    }

    /*
    ** Count the number of rows in the UploadReady Table  
    */ 
    const getUploadCount = async() => {       
        let sql1 = "SELECT count(*) as rowcount from UploadReady ";
        sql1 += " where type > 0;";
        let uploadrows = 0;

        let selectQuery = await ExecuteQuery(sql1,[]);
    
        for (let i = 0; i < selectQuery.rows.length; i++) {
        uploadrows = selectQuery.rows.item(i).rowcount;
        }
        //Put the rowcount into the state variable 
        setUploadRows(uploadrows) 
    } // end getUploadCount
  
    /*
    ** read the selected table and stage the primary key in the
    ** Upload ready table 
    */
    const Process_extract = () => {
        let sql2 = "";
        switch (tablelist) {
            //event table 
            case 1:
                sql2 = "INSERT INTO UploadReady(type,datakey1,datakey2,datakey3)";
                sql2 += " Select 1 as type,event_id as datakey1,0 as datakey2, 0 as datakey3 ";
                sql2 += " from Events ";
                sql2 += " order by event_id; ";
                break;
            //teams table 
            case 2:
                sql2 = "INSERT INTO UploadReady(type,datakey1,datakey2,datakey3)";
                sql2 += " Select 2 as type, team_num as datakey1, 0 as datakey2, 0 as datakey3 "; 
                sql2 += " from Teams ";
                sql2 += " order by team_num; ";
                break;
            //match schedule 
            case 3: 
                sql2 = "INSERT INTO UploadReady(type,datakey1,datakey2,datakey3)";
                sql2 += " Select 3 as type, match_num as datakey1, 0 as datakey2, 0 as datakey3 "; 
                sql2 += " from Matches ";
                sql2 += " order by match_num; ";
                break;
            //pit data    
            case 4:
                sql2 = "INSERT INTO UploadReady(type,datakey1,datakey2,datakey3)";
                sql2 += " Select 4 as type, event_id as datakey1, team_num as datakey2, 0 as datakey3 "; 
                sql2 += " from PitScouting ";
                sql2 += " order by event_id,team_num; "; 
                break;    
        }

        ExecuteCommand(sql2);
        getUploadCount();
        setQRData("");
    }

    /**** 
    ** Extract Event records and load into qr code 
    ****/

    const process_events = async() => {
        /*
        ** If there are records to upload in the UploadReady Table 
        ** -- then Go read Event Table from SWAMP database  
        */       
        let sql1 = "SELECT EV.*, UR.upload_ID from Events as EV ";
        sql1 += " Inner Join UploadReady as UR on EV.event_id = UR.datakey1 "; 
        sql1 += " Where UR.type = 1 ";
        sql1 += " Order by EV.event_id; ";
      
        let selectQuery = await this.ExecuteQuery(sql1,[]);
      
        
        let delim = "|";
        let eor = "~";
        let qrWork = "T1" + delim; //indicate table id=1 (events)
        let deleteArray = [];
        for (let i = 0; i < selectQuery.rows.length; i++) {          
            qrWork+= selectQuery.rows.item(i).event_id + delim;
            qrWork+= selectQuery.rows.item(i).event_key + delim;
            qrWork+= selectQuery.rows.item(i).event_name + delim;
            
            //log the upload id so that row can be deleted next time round 
            deleteArray.push(selectQuery.rows.item(i).upload_ID);
        
            //set end of record in barcode 
            qrWork+=eor;
            //max length was 1400 
            if(qrWork.length > 1000) {
                console.log("Events Bar Code length reached Max!!");
                console.log("No of Event Records in Bar code = ",i+1);
                //jump out of for loop 
                break;
            }  
        } // end for 
        console.log("Event Barcode Data Length=",qrWork.length);
        setQRData(qrWork);
        setDeleteKeys(deleteArray);
    } // end process_events

    /**** 
    ** Extract Team records and load into qr code 
    ****/

    const process_teams = async() => {
        /*
        ** If there are records to upload in the UploadReady Table 
        ** -- then Go read Teams Table from SWAMP database  
        */       
        let sql1 = "SELECT TM.*, UR.upload_ID from Teams as TM ";
        sql1 += " Inner Join UploadReady as UR on TM.team_num = UR.datakey1 "; 
        sql1 += " Where UR.type = 2 ";
        sql1 += " Order by TM.team_num; ";
    
        let selectQuery = await this.ExecuteQuery(sql1,[]);
    
        let delim = "|";
        let eor = "~"; 
        let qrWork = "T2" + delim; //indicate table id=2 (teams);
        let deleteArray = [];
        for (let i = 0; i < selectQuery.rows.length; i++) { 
            qrWork+= selectQuery.rows.item(i).team_num + delim;
            qrWork+= selectQuery.rows.item(i).team_name + delim;
            qrWork+= selectQuery.rows.item(i).robot_uri + delim;
            
            //log the upload id so that row can be deleted next time round 
            deleteArray.push(selectQuery.rows.item(i).upload_ID);

            //set end of record in barcode 
            qrWork+=eor;
            //max length was 1400 
            if(qrWork.length > 1000) {
                console.log("Team Bar Code length reached Max!!");
                console.log("No of Team Records in Bar code = ",i+1);
                //jump out of for loop 
                break;
            }  
        } // end for 
        console.log("Team Barcode Data Length=",qrWork.length);
        setQRData(qrWork);
        setDeleteKeys(deleteArray);
    } // end process_teams

    /**** 
    ** Extract Match Schedule records and load into qr code 
    ****/

    const process_matches = async() => {
        /*
        ** If there are records to upload in the UploadReady Table 
        ** -- then Go read Matches Table from SWAMP database  
        */       
        let sql1 = "SELECT MT.*, UR.upload_ID from Matches as MT ";
        sql1 += " Inner Join UploadReady as UR on MT.match_num = UR.datakey1 "; 
        sql1 += " Where UR.type = 3 ";
        sql1 += " Order by MT.match_num; ";
    
        let selectQuery = await this.ExecuteQuery(sql1,[]);
    
        
        let delim = "|";
        let eor = "~";
        let deleteArray = [];
        let qrWork = "T3" + delim; //indicate table id=3 (matches)
        for (let i = 0; i < selectQuery.rows.length; i++) {   
            qrWork+= selectQuery.rows.item(i).match_num + delim;
            qrWork+= selectQuery.rows.item(i).red_1 + delim;
            qrWork+= selectQuery.rows.item(i).red_2 + delim;
            qrWork+= selectQuery.rows.item(i).red_3 + delim;
            qrWork+= selectQuery.rows.item(i).blue_1 + delim;
            qrWork+= selectQuery.rows.item(i).blue_2 + delim;
            qrWork+= selectQuery.rows.item(i).blue_3 + delim;
            qrWork+= selectQuery.rows.item(i).projected_time + delim;
            
            //log the upload id so that row can be deleted next time round 
            deleteArray.push(selectQuery.rows.item(i).upload_ID);

            //set end of record in barcode 
            qrWork+=eor;
            //max length was 1400 
            if(qrWork.length > 1000) {
                console.log("Match Bar Code length reached Max!!");
                console.log("No of Match Records in Bar code = ",i+1);
                //jump out of for loop 
                break;
            }  
        }// end for 
        console.log("Match Barcode Data Length=",qrWork.length);
        setQRData(qrWork);
        setDeleteKeys(deleteArray);
    } // end process_matches

    /**** 
    ** Extract PIT Scouting records and load into qr code 
    ****/

    const process_pit = async() => {
        /*
        ** If there are records to upload in the UploadReady Table 
        ** -- then Go read PitScouting Table from SWAMP database  
        */       
        let sql1 = "SELECT PS.*, UR.upload_ID from PitScouting as PS ";
        sql1 += " Inner Join UploadReady as UR on PS.event_id = UR.datakey1 and PS.team_num = UR.datakey2 "; 
        sql1 += " Where UR.type = 3 ";
        sql1 += " Order by PS.event_id, PS.team_num; ";
    
        let selectQuery = await this.ExecuteQuery(sql1,[]);
    
        
        let delim = "|";
        let eor = "~";
        let deleteArray = [];
        let qrWork = "T4" + delim; //indicate table id=4 (pitscouting)
        for (let i = 0; i < selectQuery.rows.length; i++) { 
            qrWork+= selectQuery.rows.item(i).event_id + delim;
            qrWork+= selectQuery.rows.item(i).team_num + delim;
            qrWork+= selectQuery.rows.item(i).robot_weight + delim;
            qrWork+= selectQuery.rows.item(i).robot_height + delim;
            qrWork+= selectQuery.rows.item(i).drivetrain + delim;
            qrWork+= selectQuery.rows.item(i).proglang + delim;
            qrWork+= selectQuery.rows.item(i).left_start + delim;
            qrWork+= selectQuery.rows.item(i).center_start + delim;
            qrWork+= selectQuery.rows.item(i).right_start + delim;
            qrWork+= selectQuery.rows.item(i).move_towardgoal + delim;
            qrWork+= selectQuery.rows.item(i).move_awaygoal + delim;
            qrWork+= selectQuery.rows.item(i).comments + delim;

            //log the upload id so that row can be deleted next time round 
            deleteArray.push(selectQuery.rows.item(i).upload_ID);

            //set end of record in barcode 
            qrWork+=eor;
            //max length was 1400 
            if(qrWork.length > 1000) {
                console.log("Pit Bar Code length reached Max!!");
                console.log("No of Pit Records in Bar code = ",i+1);
                //jump out of for loop 
                break;
            }  
        } //End for 
        console.log("Pit Barcode Data Length=",qrWork.length);
        setQRData(qrWork);
        setDeleteKeys(deleteArray);
    } // end process_pit


    /******** 
    ** remove keys in the last bar code so they are not processed again
    *****/
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
        
        //clear the state variable 
        setDeleteKeys([]);
        //go revise the upload count 
        getUploadCount();
    }
  


    /************************ 
    ** Mainline routine - runs every iteration 
    *********************/
    getUploadCount();

    //if there is nothing to put in barcode set to 503 
   // if(qrData == "" ) {
   //     setQRData("");
   // }
  
    if(qrData == "" || uploadRows == 0) {
        return (
            <View style={{flex:1, backgroundColor: 'white'}} >
                <KeyboardAvoidingView 
                behavior="padding"
                style={{flex:1, justifyContent: "space-between"}} 
                >
                    <View>
                        <Text style={styles.tableHead}>Select Table to export to QR Code:</Text>
                        <TablePicker onChangeText={
                            (tablelist) => {
                                setTablelist(tablelist);
                                }
                            }
                        />
                        <ActionButton 
                            title="Extract to Barcode" customClick={Process_extract} > 
                        </ActionButton>
                        <Text style={styles.textHead}>You have {uploadRows} items waiting to Upload!</Text>
                    </View>
                    <View style={styles.center}>
                    
                    </View>
                    <View>
                        <ActionButton 
                            title="Next Barcode" customClick={Process_routine} > 
                        </ActionButton>
                    </View>
                </KeyboardAvoidingView> 
    
                <PageFooter></PageFooter>
            </View>
        );
    } else {
        
        
    return (
        <View style={{flex:1, backgroundColor: 'white'}} >
            <KeyboardAvoidingView 
            behavior="padding"
            style={{flex:1, justifyContent: "space-between"}} 
            >
                <View>
                    <Text style={styles.tableHead}>Select Table to export to QR Code:</Text>
                    <TablePicker onChangeText={
                        (tablelist) => {
                            setTablelist(tablelist);
                            }
                        }
                    />
                    <ActionButton 
                        title="Extract to Barcode" customClick={Process_extract} > 
                    </ActionButton>
                    <Text style={styles.textHead}>You have {uploadRows} items waiting to Upload!</Text>
                </View>
                <View style={styles.center}>
                    <QRCode
                        size={300}
                        value={qrData}
                    />
                </View>
                <View>
                    <ActionButton 
                        title="Next Barcode" customClick={Process_routine} > 
                    </ActionButton>
                </View>
            </KeyboardAvoidingView> 

            <PageFooter></PageFooter>
        </View>
    );
                    }
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  textHead: {
    marginTop: 4,
    color: "red",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
  },
  tableHead: {
    marginTop: 10,
    marginBottom: 0,
    color: "red",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "400",
  }
});

export default Test;