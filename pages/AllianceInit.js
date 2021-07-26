// ./pages/AllianceInit.js

import React, {useState} from "react";
import { View, StyleSheet, Text,KeyboardAvoidingView} from "react-native";
import PageFooter from "../components/PageFooter";
import ActionButton from "../components/ActionButton";
import * as Progress from "react-native-progress";



putLog = (msg) => {
  console.log(msg);
}


const AllianceInit = (navigation, route) => {
  let [progress, setProgress] = useState(0);
  let [indeterminate, setIndeterminate] = useState(true);
  
  /*******
   * Mainline Database Load 
   *****/
    const load_database = () => {  
        setProgress(0);
        setIndeterminate(false);
        clearTables();
    }

    const clearTables = () => {
        setProgress(.1);
        putLog("Clearing Tables ...");
        //ExecuteCommand("Delete from Alliances where event_ID > 0");
        ExecuteCommand("Delete from Alliance_Teams where event_ID > 0");
        getTeamRanking();
    }

    const getTeamRanking = async() => {
        /*
        ** Go read TBA Rankings table from SWAMP database  
        */   
        let sql1 = "SELECT team_num from TBA_Rankings ";
        sql1 += "Where event_id = ?  ";
        sql1 += " order by rank; ";

        let t=[];
        //go get the Frog Force Event Key for DB insert  
        let ffev = FindSettingsKey("FFEvent");

        let selectQuery = await ExecuteQuery(sql1,[ffev]);
        for(let i=0;i<selectQuery.rows.length;i++) { 
            //push team number onto array 
            t.push(selectQuery.rows.item(i).team_num);
        }

        setProgress(.3);
        //clear picklist just in case  
        clearPicklist(t); 
    }

    const clearPicklist = (t) => {
      setProgress(.6);
      
      //go get the Frog Force Event Key for DB insert  
      let ffev = FindSettingsKey("FFEvent");
      
      let sqlClear = "Update Picklist "; 
      sqlClear += "Set inalliance = 0 ";
      sqlClear += "Where event_id = " + ffev;
      ExecuteCommand(sqlClear);
      
      //go load teams table 
      loadTeamsTable(t); 

    }

    // const loadAllianceTable = (t) => {
    //     putLog("Loading Alliance Table...");
    //     //go get the Frog Force Event Key for DB insert  
    //     let ffev = FindSettingsKey("FFEvent");
    //     let parameters=[],
    //         qry="";
    
    //     let sqlInsert = "INSERT INTO Alliances (event_id, alliance_ID, pick_num,team_num) VALUES "; 

    //     // magic
    //     putLog("Rows expected to be inserted = 8 ");

    //     for(var i=0;i<8;i++) {
    //         qry += "(?,?,?,?)";
    //         parameters.push(ffev,i+1,0,t[i]);
    //         qry += ",";
    //     } // end  for

    //     ExecuteQuery(sqlInsert + qry.slice(0,-1)+ ";",parameters);
    
    //     putLog("Insert Completed...");
    //     setProgress(.66);
    //     loadTeamsTable(t);
    // }

    const loadTeamsTable = (t) => {
        putLog("Loading Alliance Teams Table...");
        
        //go get the Frog Force Event Key for DB insert  
        let ffev = FindSettingsKey("FFEvent");
        
        let parameters=[],
            qry="";
    
        let sqlInsert = "INSERT INTO Alliance_Teams (event_id, rank, team_num,alliance_id,pick_num) VALUES "; 

        // magic
        let e = (t.length - 8);
        putLog("Rows expected to be inserted = " + e);

        let a=0,p=0;
        for(var i=0;i<t.length;i++) {
            qry += "(?,?,?,?,?)";
            
            if(i<8) {
              a=i+1;
              p=1;
            } else {
              a=0;
              p=0;
            }
            parameters.push(ffev,i+1,t[i],a,p);
            qry += ",";
        } // end  for

        ExecuteQuery(sqlInsert + qry.slice(0,-1)+ ";",parameters);
    
        putLog("Insert Completed...");
        setProgress(1.0);
    }


  return (
    <View style={{flex:1, backgroundColor: 'white'}} >
      <KeyboardAvoidingView 
        behavior="padding"
        style={{flex:1, justifyContent: "space-between"}} 
      >
          <View style={styles.Newsbox}>
                <Text style={styles.TextHeading}>
                    Initialize Alliance Selection Process
                </Text>
          
                <Text style={styles.TextNormal}>
                    This utility will initialize the SWAMP database for the Alliance Selection process. It should be run AFTER the qualification matches have been completed.  
                    It will take the team rankings and copy them into the Alliance system. THIS UTILITY WILL NOT IMPACT THE REST OF THE SWAMP DATABASE! If you make a mistake in the alliiance selection process you can rerun this initialization process to start over. 
                    thier observations as the event has progressed. 
  
                </Text>
                <Text> &nbsp;</Text>
            </View>

        <ActionButton 
            title="Initialize the Alliance Selection Tables" customClick={load_database} > 
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

export default AllianceInit;