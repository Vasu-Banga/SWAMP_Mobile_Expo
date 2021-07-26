// ./pages/AllianceSelection.js

import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView,SafeAreaView,StyleSheet, Text} from "react-native";
import AllianceSelect from "../components/AllianceSelect";
import AllianceTeams from "../components/AllianceTeams";
import AlliancePicklist from "../components/AlliancePicklist";
import PageFooter from "../components/PageFooter";
import TextBox from "../components/Textbox";
import ActionButton from "../components/ActionButton";
import Dialog from "react-native-dialog";



const AllianceSelection = (navigation, route) => {
  let [actionText, setActionText] = useState('Alliance 1 - First Pick');
  let [team,setTeam] = useState(0);
  let [action, setAction] = useState(0);
  let [visible, setVisible] = React.useState(false);

 
  const Process_Selection = async() => { 
    //Step 1 - validate the team number entered by the user 
    let teamValid=false;
    let teamno = team;
    if (teamno <= 0) {
      return;
    }

    let sql1 = "SELECT team_num,alliance_id,pick_num ";
    sql1 += "FROM Alliance_Teams Where team_num = ?";

    let selectQuery = await ExecuteQuery(sql1,[teamno]);
    let origAlliance = 0;
    let origPick = 0;
    for (let k = 0; k < selectQuery.rows.length; k++) {
      origAlliance = selectQuery.rows.item(k).alliance_id;
      origPick = selectQuery.rows.item(k).pick_num;
    }
    //was the team returned from the database 
    if(selectQuery.rows.length > 0) {
      teamValid=true;
    } else {
      setVisible(true);
      return;
    }

    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");

    //Step 2 -we have a valid team number-take action based on staus of alliance selection  
    let a=0,p=0;nextAction="";
    switch (actionText) {
      case "Alliance 1 - First Pick":
        a=1;
        p=2;
        nextAction="Alliance 2 - First Pick";
        break;
      case "Alliance 2 - First Pick":
        a=2;
        p=2;
        nextAction="Alliance 3 - First Pick";
        break;
      case "Alliance 3 - First Pick":
        a=3;
        p=2;
        nextAction="Alliance 4 - First Pick";
        break;
      case "Alliance 4 - First Pick":
        a=4;
        p=2;
        nextAction="Alliance 5 - First Pick";
        break;
      case "Alliance 5 - First Pick":
        a=5;
        p=2;
        nextAction="Alliance 6 - First Pick";
        break;
      case "Alliance 6 - First Pick":
        a=6;
        p=2;
        nextAction="Alliance 7 - First Pick";
        break;
      case "Alliance 7 - First Pick":
        a=7;
        p=2;
        nextAction="Alliance 8 - First Pick";
        break;
      case "Alliance 8 - First Pick":
        a=8;
        p=2;
        nextAction="Alliance 8 - Second Pick";
        break;
      case "Alliance 8 - Second Pick":
        a=8;
        p=3;
        nextAction="Alliance 7 - Second Pick";
        break;
      case "Alliance 7 - Second Pick":
        a=7;
        p=3;
        nextAction="Alliance 6 - Second Pick";
        break;
      case "Alliance 6 - Second Pick":
        a=6;
        p=3;
        nextAction="Alliance 5 - Second Pick";
        break;
      case "Alliance 5 - Second Pick":
        a=5;
        p=3;
        nextAction="Alliance 4 - Second Pick";
        break;
      case "Alliance 4 - Second Pick":
        a=4;
        p=3;
        nextAction="Alliance 3 - Second Pick";
        break;
      case "Alliance 3 - Second Pick":
        a=3;
        p=3;
        nextAction="Alliance 2 - Second Pick";
        break;
      case "Alliance 2 - Second Pick":
        a=2;
        p=3;
        nextAction="Alliance 1 - Second Pick";
        break;
      case "Alliance 1 - Second Pick":
        a=1;
        p=3;
        nextAction="Alliance Selection Complete!!";
        break;
    }
    let sql2 = "Update Alliance_teams ";
    sql2 += " set alliance_id = " + a + ", pick_num = " + p;
    sql2 += " where event_id = " + ffev + " and team_num = " + teamno + ";";

    console.log("sql2=",sql2);
    ExecuteCommand(sql2,[]);
    
    //Step 3-if team was a captain of the first 8-promote all alliances and fill alliance 8 captain 
    //if alliance captain-then promote 
    if(origPick == 1) {
      let sql3 = "";
      //promote existing alliance captains 
      for(let l=origAlliance;l<9;l++) {
        sql3 = "Update Alliance_teams ";
        sql3 += " set alliance_id = " + l + ", pick_num = " + origPick;
        sql3 += " where event_id = " + ffev + " and alliance_id = " + (l+1) + " and pick_num = 1;";
        ExecuteCommand(sql3,[]);
      } 
      //now find lowest ranking team without an alliance to promote 
      sql4 = "Select team_num from Alliance_teams ";
      sql4 += " where event_id = " + ffev;
      sql4 += " and alliance_ID = 0  order by rank ASC;";
      let teamToPromote = 0; 

      let selectQuery2 = await ExecuteQuery(sql4,[]);
      for (let m = 0; m < selectQuery2.rows.length; m++) {
        teamToPromote = selectQuery2.rows.item(m).team_num;
        break;
      }
    
      //now promote next available team to captain of alliance 8
      sql5 = "Update Alliance_teams ";
      sql5 += " set alliance_id = 8, pick_num = 1 ";
      sql5 += " where event_id = " + ffev;
      sql5 += " and team_num = " + teamToPromote;
      ExecuteCommand(sql5,[]);
    }
    
    //last step - check picklist and 
    let sql6 = "Update Picklist ";
    sql6 += " set inalliance = 1 where event_id = " + ffev; 
    sql6 += " and team_num = " + teamno;  
    ExecuteCommand(sql6,[]);
    
    //set next action for user 
    let act = action;
    act++;
    setAction(act);
    setActionText(nextAction);
    setTeam(0);

  }

  const Process_Undo = () => {

  }

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1, justifyContent: 'space-between' }}>
         
               <Text style={styles.TextHeading}>
                Event Finals - Team Alliances
                </Text>

              <AllianceSelect action={action}>
              </AllianceSelect> 

                <Text style={styles.TextHeading}>
                  Picklist 
                </Text>
               
                <AlliancePicklist action={action}>
                </AlliancePicklist> 
            
              <Text style={styles.TextHeading}>
                Available Teams
              </Text>

              <AllianceTeams action={action}>
              </AllianceTeams> 
            </KeyboardAvoidingView>  
           
          </ScrollView> 
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.TextHeading}>
                  Next Action: 
                </Text>
              <Text style={styles.TextAction}>
                  {actionText}
                </Text>
              <TextBox width={400} 
                keyboardType="numeric"
                placeholder="Enter Team Number"
                onChangeText={
                    (team) => setTeam(team)
                }
                style={styles.text}>
              </TextBox>
          </View>  
          <View style={{flexDirection: 'row'}}>
           <ActionButton title="Assign Team" customClick={Process_Selection} > 
           </ActionButton>
           {/* <ActionButton title="Undo Team Assign" customClick={Process_Undo} > 
           </ActionButton> */}
           </View>
          
            <Text style={styles.text}>&nbsp;</Text>
            <Dialog.Container visible={visible}>
              <Dialog.Title>Invalid Team Number</Dialog.Title>
                <Dialog.Description>
                Please enter a valid team number, Try Again
              </Dialog.Description>
            
              <Dialog.Button label="Cancel" onPress={handleCancel} />
        </Dialog.Container>
        </View>  
        <PageFooter>
      </PageFooter>
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
  TextHeading: {
    marginTop: 20,
    marginLeft:20,
    fontSize: 24,
    color: '#f05555',
    fontWeight: "600",
    marginBottom: 0,
  },
  TextHeading2: {
    marginTop: 20,
    marginLeft:20,
    fontSize: 24,
    color: '#f05555',
    fontWeight: "600",
    marginBottom: 0,
  },
  TextAction: {
    marginTop: 20,
    marginLeft:20,
    fontSize: 24,
    color: '#007200',
    fontWeight: "600",
    marginBottom: 20,
  },
  text: {
    fontSize: 24, 
    padding: 10,
}
});

export default AllianceSelection;