// ./pages/TabMatch.js

import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView, KeyboardAvoidingView} from "react-native";
import PageFooter from "../components/PageFooter";
import MatchPicker from '../components/MatchPicker';
import Textbox from '../components/Textbox';
import ActionButton from "../components/ActionButton";

const TabMatch = (navigation, route) => {
    let [matchSelect, setMatchSelect] = useState('');
    let [red1,setRed1] = useState("");
    let [blue1,setBlue1] = useState("");
    let [red2,setRed2] = useState("");
    let [blue2,setBlue2] = useState("");
    let [red3,setRed3] = useState("");
    let [blue3,setBlue3] = useState("");
    let [reload,setReload] = useState(0);



    const Reset_match = (match) => {
        setMatchSelect(match);
        getMatchbyID(match);
    }

    const getMatchbyID = async(matchno) => {
        /*
        ** Go read Matches table from SWAMP database  
        */       
        let sql1 = "SELECT * FROM matches ";
        sql1 += "Where match_num = ?;";
    
        //get match number to display from state 
        let selectQuery = await ExecuteQuery(sql1,[matchno]);
    
        for (let i = 0; i < selectQuery.rows.length; i++) {
          setRed1(selectQuery.rows.item(i).red_1);
          setRed2(selectQuery.rows.item(i).red_2);
          setRed3(selectQuery.rows.item(i).red_3);
          setBlue1(selectQuery.rows.item(i).blue_1);
          setBlue2(selectQuery.rows.item(i).blue_2);
          setBlue3(selectQuery.rows.item(i).blue_3);
        } 
      }
        const update_database = () => {
            let sql = "insert or Replace into Matches(match_num,red_1,red_2,red_3,blue_1,blue_2,blue_3) ";                    
            sql += " VALUES(?,?,?,?,?,?,?); ";
            let parms=[matchSelect,red1,red2,red3,blue1,blue2,blue3];
      
            ExecuteCommand(sql,parms);
            alert('Data Saved!!');
            //tell picker to reload 
            let r = reload;
            r++;
            setReload(r); 
        }

        const new_match = () => {
            setMatchSelect("");
            setRed1("");
            setRed2("");
            setRed3("");
            setBlue1("");
            setBlue2("");
            setBlue3("");

        }

        const delete_match = () => {
            let sql = "delete from Matches ";                    
            sql += " Where match_num = ?; ";
            let parms=[matchSelect];
            ExecuteCommand(sql,parms);
            alert('Match Deleted!!');
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
                        
                        <Text style={styles.headtext}>Match Schedule Table</Text>

                         <MatchPicker reload={reload} 
                           onChangeText={
                            (matchSelect) => {
                                Reset_match(matchSelect);
                                }
                            }
                        />
                        {/* <View style={styles.hairline} /> */}
                        <View style={{flexDirection: 'row'}}>
                            <Textbox 
                                    heading="Match:"
                                    headstyle={styles.TextboxHeading}
                                    keyboardType="numeric"
                                    placeholder="Match No"
                                    value={matchSelect.toString()}
                                    onChangeText={
                                        (matchSelect) => setMatchSelect(matchSelect)
                                    }
                                    style={styles.textbox}>
                                </Textbox> 
                                <ActionButton 
                                    title="New" 
                                    customClick={new_match} /> 
                                <ActionButton 
                                    title="Delete" 
                                    customClick={delete_match} /> 
                        </View> 
                        <View style={styles.hairline} />
                        <View style={{flexDirection: 'row'}}>
                            <Textbox 
                                heading="Red 1:"
                                headstyle={styles.TextboxHeading}
                                keyboardType="numeric"
                                placeholder="Team Number"
                                value={red1.toString()}
                                onChangeText={
                                    (red1) => setRed1(red1)
                                }
                                style={styles.textbox}>
                            </Textbox>  
                            <Textbox 
                                heading="Blue 1:"
                                headstyle={styles.TextboxHeading}
                                keyboardType="numeric"
                                placeholder="Team Number"
                                value={blue1.toString()}
                                onChangeText={
                                    (blue1) => setBlue1(blue1)
                                }
                                style={styles.textbox}>
                            </Textbox>  
                        </View>

                        <View style={{flexDirection: 'row'}}>
                            <Textbox 
                                heading="Red 2:"
                                headstyle={styles.TextboxHeading}
                                keyboardType="numeric"
                                placeholder="Team Number"
                                value={red2.toString()}
                                onChangeText={
                                    (red2) => setRed2(red2)
                                }
                                style={styles.textbox}>
                            </Textbox>  
                            <Textbox 
                                heading="Blue 2:"
                                headstyle={styles.TextboxHeading}
                                keyboardType="numeric"
                                placeholder="Team Number"
                                value={blue2.toString()}
                                onChangeText={
                                    (blue2) => setBlue2(blue2)
                                }
                                style={styles.textbox}>
                            </Textbox>  
                        </View>

                        <View style={{flexDirection: 'row'}}>
                            <Textbox 
                                heading="Red 3:"
                                headstyle={styles.TextboxHeading}
                                keyboardType="numeric"
                                placeholder="Team Number"
                                value={red3.toString()}
                                onChangeText={
                                    (red3) => setRed3(red3)
                                }
                                style={styles.textbox}>
                            </Textbox>  
                            <Textbox 
                                heading="Blue 3:"
                                headstyle={styles.TextboxHeading}
                                keyboardType="numeric"
                                placeholder="Team Number"
                                value={blue3.toString()}
                                onChangeText={
                                    (blue3) => setBlue3(blue3)
                                }
                                style={styles.textbox}>
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

export default TabMatch;