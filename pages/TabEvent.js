// ./pages/TabEvent.js

import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView, KeyboardAvoidingView} from "react-native";
import PageFooter from "../components/PageFooter";
import EventTBAPicker from '../components/EventTBAPicker';
import Textbox from '../components/Textbox';
import ActionButton from "../components/ActionButton";

const TabEvent = (navigation, route) => {
    let [eventSelect, setEventSelect] = useState('');
    let [eventid,setEventID] = useState("");
    let [eventname,setEventName] = useState("");
    let [reload,setReload] = useState(0);
   
    const Reset_event = (event) => {
        setEventSelect(event);
        setEventID("");
        setEventName("");
        getEventbyID(event);
    }

    const getEventbyID = async(eventkey) => {
        /*
        ** Go read Event table from SWAMP database  
        */       
        let sql1 = "SELECT * FROM events ";
        sql1 += "Where event_key = ?;";
    
        //get match number to display from state 
        let selectQuery = await this.ExecuteQuery(sql1,[eventkey]);
    
       
        
        for (let i = 0; i < selectQuery.rows.length; i++) {
            // console.log("Event ID=",selectQuery.rows.item(i).event_id);
            // console.log("Event Name=",selectQuery.rows.item(i).event_name);
             setEventID(selectQuery.rows.item(i).event_id);
             setEventName(selectQuery.rows.item(i).event_name);
        } 
      }
        const update_database = () => {
          let sql = "insert or Replace into Events(event_id,event_key,event_name) ";                    
          sql += " VALUES(?,?,?); ";
          let parms=[eventid, eventSelect, eventname];
    
          ExecuteCommand(sql,parms);
          alert('Data Saved!!');
          //tell picker to reload 
          let r = reload;
          r++;
          setReload(r); 
        }

        const new_event = () => {
         setEventID("");
         setEventSelect("");
         setEventName("");
        }

        const delete_event = () => {
          let sql = "delete from Events ";                    
          sql += " Where event_id = ?; ";
          let parms=[eventid];
          ExecuteCommand(sql,parms);
          alert('Event Deleted!!');
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
                        
                        <Text style={styles.headtext}>Event Table</Text>

                         <EventTBAPicker reload={reload}  
                           onChangeText={
                            (eventSelect) => {
                                Reset_event(eventSelect);
                                }
                            }
                        />
                        {/* <View style={styles.hairline} /> */}
                        <View style={{flexDirection: 'row'}}>
                            <Textbox 
                                    heading="Event ID:"
                                    headstyle={styles.TextboxHeading}
                                    keyboardType="numeric"
                                    placeholder="Event ID"
                                    value={eventid.toString()}
                                    onChangeText={
                                        (eventid) => setEventID(eventid)
                                    }
                                    style={styles.textbox}>
                                </Textbox> 
                                <ActionButton 
                                    title="New" 
                                    customClick={new_event} /> 
                                <ActionButton 
                                    title="Delete" 
                                    customClick={delete_event} /> 
                        </View> 
                        <View style={styles.hairline} />
                        <View style={{flexDirection: 'row'}}>
                            <Textbox 
                                    heading="Event Key:"
                                    headstyle={styles.TextboxHeading}
                                    keyboardType="numeric"
                                    placeholder="FIM Event KEY"
                                    value={eventSelect.toString()}
                                    onChangeText={
                                        (eventSelect) => setEventSelect(eventSelect)
                                    }
                                    style={styles.textbox}>
                            </Textbox>  
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Textbox 
                                heading="Event Name:"
                                headstyle={styles.TextboxHeading}
                                keyboardType="numeric"
                                placeholder="Event Name"
                                value={eventname.toString()}
                                onChangeText={
                                    (eventname) => setEventName(eventname)
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

export default TabEvent;