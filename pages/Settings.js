// ./pages/Settings.js

import React, { useState } from "react";
import { View,StyleSheet, Text, Image,Alert } from "react-native";
import SettingsList from 'react-native-settings-list';
import Dialog from "react-native-dialog";
import ScoutPicker from "../components/ScoutPicker";
import EventPicker from "../components/EventPicker";
import Textbox from "../components/Textbox";

const Settings = (navigation, route) => {
    const [switchValue, setSwitchValue] = useState(false);
    const [scoutpos,setScoutPos] = useState("");
    const [upload,setUpload] = useState("QR Code");
    const [visible, setVisible] = useState(false);
    const [eventvisible, setEventVisible] = useState(false); 
    const [ffeventvisible, setFFEventVisible] = useState(false); 
    const [event,setEvent] = useState("");
    const [ffevent,setFFEvent] = useState("0");
    const [eventtitle,setEventTitle] = useState("");
    const [firsttime,setFirsttime] = useState(true);


    //load settings array from database 
    const loadSettings = async() => {
      let sql1 = "Select key,val from Settings; ";
      let setarr = []; 
      let selectQuery = await this.ExecuteQuery(sql1,[]);
      for (let i = 0; i < selectQuery.rows.length; i++) {
        setarr.push({"key": selectQuery.rows.item(i).key,"value": selectQuery.rows.item(i).val});
      }
      //load a global variable for all pages to use 
      global.settings = setarr;
      console.log("Global=",global.settings);
      //load program variables from settings array
      loadVar();
    }

   /*
    ** Go read Event table from SWAMP database  
    */     
   const getEvents = async(evt) => {
    let sql1 = "SELECT event_id,event_name, event_key ";
    sql1 += "FROM Events where event_id = " + evt;
    let t = ""; 

    let selectQuery = await this.ExecuteQuery(sql1,[]);
    for (let i = 0; i < selectQuery.rows.length; i++) {
        t = selectQuery.rows.item(i).event_id + "-" + selectQuery.rows.item(i).event_name + "(" + selectQuery.rows.item(i).event_key +")";
    }

    setEventTitle(t);

}  // end getEvents

    //save settings from array to database 
    const saveSettings = (s) => {
      ExecuteCommand("Delete from Settings where key > '';");
      let parameters=[];
      let bigqry="";
      let sqlInsert = "INSERT INTO Settings (key, val) VALUES "; 

      // magic 
      for(var i=0;i<s.length;i++) {
        bigqry += "(?,?)";
        parameters.push(s[i].key,s[i].value);
        bigqry += ",";
      } // end for

      // Make sure there is something to send to tthe database
      if (bigqry !="")  {  
        ExecuteQuery(sqlInsert + bigqry.slice(0,-1)+ ";",parameters);
      }  // end if
    }

     //update settings value for a given key 
     const updateSettingsbyKey = (searchKey,newval) => {
      let found = false;
      let s = global.settings;
      for(var i=0;i<s.length;i++) {
        if(s[i].key == searchKey) {
           s[i].value = newval;
           found = true;
        }
      }
      //if key was not found - then add a new key 
      if(!found) {
        s.push({"key": searchKey,"value": newval});
      }
      //write out changes to the database 
      saveSettings(s);
      //load a global variable for all pages to use 
      console.log("Loading new Global Settings...");
      global.settings = s;

    }

    //load program variables from settings array 
    const loadVar = () => {
      let sp = FindSettingsKey("ScoutPos");
      if(sp =="") {
        sp="Scout1";
      }
      setScoutPos(sp);

      let ul = FindSettingsKey("Upload");
      if(ul =="") {
        ul="QR Code";
      }
      setUpload(ul);

      let ev = FindSettingsKey("Event");
      if(ev =="") {
        ev="Unknown";
      }
      resetEvent(ev);

      let ffev = FindSettingsKey("FFEvent");
      if(ffev =="") {
        ffev="0";
      }
      resetFFEvent(ffev);
    }

    const resetEvent = (evt) => {
      setEvent(evt);
      getEvents(evt); 
    }

    const resetFFEvent = (evt) => {
      setFFEvent(evt);
    }

    //update scout position in settings array 
    const updateScoutPos = () => {
      updateSettingsbyKey("ScoutPos",scoutpos);
      handleCancel();
    }

    //update scout position in settings array 
    const updateUpload = () => {
      updateSettingsbyKey("Upload",upload);
    }

    //update event in settings array 
    const updateEvent = () => {
      updateSettingsbyKey("Event",event);
      setEventVisible(false);
    }

     //update FFevent in settings array 
     const updateFFEvent = () => {
      updateSettingsbyKey("FFEvent",ffevent);
      setFFEventVisible(false);
    }

    const handleCancel = () => {
        setVisible(false);
    };

    const toggleVisible = () => {
        setVisible(!visible);
    }

    const toggleEventVisible = () => {
      setEventVisible(!eventvisible);
    }

    const toggleFFEventVisible = () => {
      setFFEventVisible(!ffeventvisible);
    }

    const toggleSwitch = () => {
        setSwitchValue(!switchValue);
    }

    /************
     * Mainline routine 
     *********** */

    if(firsttime) {
      //load setting array from database 
      loadSettings();
    
      //turn off first time switch 
      setFirsttime(false);
    }


  return (
    <View style={{backgroundColor:'#EFEFF4',flex:1}}>
      <View style={{borderBottomWidth:1, backgroundColor:'#f7f7f8',borderColor:'#c8c7cc'}}>
        <Text style={{alignSelf:'center',marginTop:30,marginBottom:10,fontWeight:'bold',fontSize:16}}>Settings</Text>
      </View>
      <View style={{backgroundColor:'#EFEFF4',flex:1}}>
        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
          <SettingsList.Header headerStyle={{marginTop:15}}/>
          
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/storage.png')}/>}
            title='Frog Force Event ID'
            titleInfo={ffevent}
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => toggleFFEventVisible()}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/memory.png')}/>}
            title='Event'
            titleInfo={eventtitle}
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => toggleEventVisible()}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/general.png')}/>}
            title='Scout Position'
            titleInfo={scoutpos}
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => toggleVisible()}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require("../images/wifi.png")}/>}
            title='Upload via'
            titleInfo={upload}
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => Alert.alert('Route to Upload Posibilities')}
          />  
          {/* <SettingsList.Item
            icon={
                <Image style={styles.imageStyle} source={require('../images/airplane.png')}/>
            }
            hasSwitch={true}
            switchState={switchValue}
            switchOnValueChange={toggleSwitch}
            hasNavArrow={false}
            title='Airplane Mode'
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/blutooth.png')}/>}
            title='Blutooth'
            titleInfo='Off'
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => Alert.alert('Route to Blutooth Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/cellular.png')}/>}
            title='Cellular'
            onPress={() => Alert.alert('Route To Cellular Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/hotspot.png')}/>}
            title='Personal Hotspot'
            titleInfo='Off'
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => Alert.alert('Route To Hotspot Page')}
          /> */}
          {/* <SettingsList.Header headerStyle={{marginTop:15}}/>
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/notifications.png')}/>}
            title='Notifications'
            onPress={() => Alert.alert('Route To Notifications Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/control.png')}/>}
            title='Control Center'
            onPress={() => Alert.alert('Route To Control Center Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/dnd.png')}/>}
            title='Do Not Disturb'
            onPress={() => Alert.alert('Route To Do Not Disturb Page')}
          /> */}
          {/* <SettingsList.Header headerStyle={{marginTop:15}}/> */}
          {/* <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/general.png')}/>}
            title='General'
            onPress={() => Alert.alert('Route To General Page')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require('../images/display.png')}/>}
            title="Display & Brightness"
            onPress={() => Alert.alert('Route To Display Page')}
          /> */}
        </SettingsList>
      </View>

      <View style={styles.container}>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Select Scout Position</Dialog.Title>
          <Dialog.Description>
          Please select a scout position:
          </Dialog.Description>
          <ScoutPicker scout = {scoutpos} onChangeText={
                  (scoutpos) => {
                      setScoutPos(scoutpos);
                  }
              }
          />

          <Dialog.Button label="Done" onPress={updateScoutPos} />
        </Dialog.Container>
      </View>

      <View style={styles.container}>

        <Dialog.Container visible={eventvisible} contentStyle={{height: 340, width: 500}}>
          <Dialog.Title>Select Event to Scout</Dialog.Title>
          <Dialog.Description>
          Please select an event from Database:
          </Dialog.Description>
          <EventPicker event = {event} onChangeText={
                  (event) => {
                    resetEvent(event);
                  }
              }
          />
          <Dialog.Button label="Done" onPress={updateEvent} />
        </Dialog.Container>
      </View>

      <View style={styles.container}>
        <Dialog.Container visible={ffeventvisible} contentStyle={{height: 200, width: 500}}>
          <Dialog.Title>Set Frog Force Event ID</Dialog.Title>
          <Dialog.Description>
          Please enter Frog Force Event ID:
          </Dialog.Description>
          <Textbox 
              heading="FF Event ID:"
              headstyle={styles.TextboxHeading}
              keyboardType="numeric"
              placeholder="Event ID"
              value={ffevent.toString()}
              onChangeText={
                  (ffevent) => setFFEvent(ffevent)
              }
              style={styles.textbox}>
          </Textbox> 
          <Dialog.Button label="Done" onPress={updateFFEvent} />
        </Dialog.Container>
        </View>
     
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
   // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:20,
    marginRight:20, 
    width:400,
  },
    imageStyle:{
      marginLeft:15,
      alignSelf:'center',
      height:30,
      width:30
    },
    titleInfoStyle:{
      fontSize:16,
      color: '#8e8e93'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
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
  });