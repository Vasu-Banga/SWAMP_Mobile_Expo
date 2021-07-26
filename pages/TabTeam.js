// ./pages/TabTeam.js

import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView, KeyboardAvoidingView} from "react-native";
import PageFooter from "../components/PageFooter";
import TeamPicker from '../components/TeamPicker';
import Textbox from '../components/Textbox';
import ActionButton from "../components/ActionButton";

const TabTeam = (navigation, route) => {
    let [teamselect, setTeamSelect] = useState('');
    let [teamname,setTeamName] = useState("");
    let [reload,setReload] = useState(0);
   

    const Reset_team = (team) => {
        setTeamSelect(team);
        setTeamName("");
        getTeambyID(team);
    }

    const getTeambyID = async(teamno) => {
        /*
        ** Go read Team table from SWAMP database  
        */       
        let sql1 = "SELECT * FROM teams ";
        sql1 += "Where team_num = ?;";
    
        //get match number to display from state 
        let selectQuery = await this.ExecuteQuery(sql1,[teamno]);
    
       
        
        for (let i = 0; i < selectQuery.rows.length; i++) {
            // console.log("Team Name=",selectQuery.rows.item(i).team_name);
             setTeamName(selectQuery.rows.item(i).team_name);
        } 
      }
        const update_database = () => {
          let sql = "insert or Replace into Teams(team_num,team_name,robot_uri) ";                    
          sql += " VALUES(?,?,?); ";
          let parms=[teamselect, teamname, " "];
    
          ExecuteCommand(sql,parms);
          alert('Data Saved!!');
          //tell picker to reload 
          let r = reload;
          r++;
          setReload(r); 
        }

        const new_team = () => {
         setTeamSelect("");
         setTeamName("");
        }

        const delete_team = () => {
          let sql = "delete from Teams ";                    
          sql += " Where team_num = ?; ";
          let parms=[teamselect];
          ExecuteCommand(sql,parms);
          alert('Team Deleted!!');
          //tell picker to reload 
          let r = reload;
          r++;
          setReload(r); 
        }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <KeyboardAvoidingView
                        behavior="padding"
                        style={{ flex: 1, justifyContent: 'space-between' }}>
                        
                        <Text style={styles.headtext}>Team Table</Text>

                         <TeamPicker reload={reload} 
                          onChangeText={
                            (teamSelect) => {
                                Reset_team(teamSelect);
                                }
                            }
                        />
                        {/* <View style={styles.hairline} /> */}
                        <View style={{flexDirection: 'row'}}>
                            <Textbox 
                                    heading="Team No:"
                                    headstyle={styles.TextboxHeading}
                                    keyboardType="numeric"
                                    placeholder="Team Number"
                                    value={teamselect.toString()}
                                    onChangeText={
                                        (teamselect) => setTeamSelect(teamselect)
                                    }
                                    style={styles.textbox}>
                                </Textbox> 
                                <ActionButton 
                                    title="New" 
                                    customClick={new_team} /> 
                                <ActionButton 
                                    title="Delete" 
                                    customClick={delete_team} /> 
                        </View> 
                        <View style={styles.hairline} />
                       
                        <View style={{flexDirection: 'row'}}>
                            <Textbox 
                                heading="Team Name:"
                                headstyle={styles.TextboxHeading}
                                keyboardType="numeric"
                                placeholder="Team Name"
                                value={teamname}
                                onChangeText={
                                    (teamname) => setTeamName(teamname)
                                }
                                style={styles.longtextbox}>
                            </Textbox>  
                           
                        </View>

                     
                    
                        <View>
                        <ActionButton 
                            title="Save Changes" 
                            customClick={update_database} /> 
                        </View>
                      
                    </KeyboardAvoidingView>
                </ScrollView> 
                <PageFooter></PageFooter>
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
  hairline: {
    backgroundColor: '#A2A2A2',
    height: 2,
    width: "97%",
    marginTop:10, 
    marginLeft:10, 
    marginRight:10,
    marginBottom:10, 
  },
  headtext: {
    alignItems: "center",
    textAlign: "center",
      fontSize: 24, 
      fontWeight: "500",
  },
  TextboxHeading: {
    marginTop: 20,
    marginLeft:50,
    fontSize: 24,
    color: 'green',
    fontWeight: "600",
    marginBottom: 0,
  },
  textbox: {
    marginTop: 0,
    fontSize: 20, 
    padding: 10,
    width: 150,
  },
  longtextbox: {
    marginTop: 0,
    fontSize: 20, 
    padding: 10,
    width: 500,
  },
  optionstexthead: {
    position: 'absolute',
    left: 460,
    color: '#111825',
    fontSize: 30,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 15,
    fontWeight: "600",
  },
  optionstext: {
    left: 0,
    color: 'green',
    fontSize: 22,
    marginTop: 5,
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
});

export default TabTeam;