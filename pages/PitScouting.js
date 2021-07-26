// ./pages/PitScouting.js

import React, { useState } from 'react';
import {
  View,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import * as ImagePicker from "react-native-image-picker";
import TeamPicker from '../components/TeamPicker';
import Textbox from "../components/Textbox";
import DrivetrainSelect from "../components/DrivetrainSelect";
import RobotThumbnail from "../components/RobotThumbnail";
import ProgLangSelect from "../components/ProgLangSelect";
import ToggleSwitch from "../components/ToggleSwitch";
import ActionButton from "../components/ActionButton";
import PageFooter from "../components/PageFooter";


encodefromBoolean = (b) => {
  let ret = 0; 
  if(b) {
    ret = 1;
  }
  return ret;
}

decodetoBoolean = (x) => {
  let ret = false; 
  if(x == 1) {
    ret = true;
  }
  return ret;
}

saveOKAlert = () =>
  Alert.alert(
    "Database Updated!",
    "SWAMP database successfully updated!",
    [
      { text: "OK"}
    ]
);

saveFailedAlert = (e) =>
  Alert.alert(
    "Database Update Failed",
    "error msg=S"+e,
    [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
);

const PitScouting = (navigation, route) => {
  let [teamSelect, setTeamSelect] = useState('');
  let [comments,setComments] = useState("");
  let [weight,setWeight] = useState("");
  let [height,setHeight] = useState("");
  let [drivetrain, setDrivetrain] = useState(0);
  let [proglang, setProglang] = useState(0);
  let [leftstart,setLeftstart] = useState(false);
  let [centerstart,setCenterstart] = useState(false);
  let [towardgoal,setTowardgoal] = useState(false);
  let [awaygoal,setAwaygoal] = useState(false);
  let [rightstart,setRightstart] = useState(false);
  let [imagename, setImagename] = useState("../images/no_photo_available.jpg");
  let [lastteam, setLastteam] = useState(0);
  let [teamFound,setTeamFound] = useState(false);
  let [refresh,setRefresh] = useState(0);

  //update image url in teams table of swamp database 
  const update_robot_uri = (uri) => {
    let sql = "Update teams set robot_uri = ? "; 
    sql += " where team_num = ? ";
    let parms = [uri,teamSelect];

    try {
      ExecuteCommand(sql,parms);
    } catch(err) {

    }

  }

  //pick robot picture from library on device 
  const pick_image = () => {
    let options = {
      title: 'You can choose one image',
      maxWidth: 250,
      maxHeight: 250300,
      mediaType: 'photo',
      includeBase64: true,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
        Alert.alert('You did not select any image');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };

        update_robot_uri(source.uri);
        //console.log("Image URI=",source.uri);
        //refresh image on screen 
        let q = refresh;
        q++;
        setRefresh(q);
      }
    });
  }

  //take robot picture with camera 
  const take_picture = () => {
   let cameraoptions = {
    mediaType: "photo",
    maxWidth: 250,
    maxHeight: 250,
    quality: 1,
    includeBase64: true,
    videoQuality: 'low',
    durationLimit: 30, //Video max duration in seconds
    saveToPhotos: true,
  };
  ImagePicker.launchCamera(cameraoptions, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      //console.log('base64 -> ', response.base64);
      //console.log('uri -> ', response.uri);
      //console.log('width -> ', response.width);
      //console.log('height -> ', response.height);
      //console.log('fileSize -> ', response.fileSize);
      //console.log('type -> ', response.type);
      //console.log('fileName -> ', response.fileName);
      //create composite file name 
      let x = "~/tmp/" + response.fileName;
      update_robot_uri(x);
      //refresh image on screen 
      let q = refresh;
      q++;
      setRefresh(q);
    });
  }

  const save_data = () => {
    let sql = ""; 
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
    
    if(teamFound) {
      //database update 
      sql = "Update PitScouting "; 
      sql += "set robot_weight = " + weight;
      sql += " ,robot_height = " + height; 
      sql += " ,drivetrain = " + drivetrain; 
      sql += " ,proglang = " + proglang; 
      sql += " ,left_start = + " + encodefromBoolean(leftstart); 
      sql += " ,center_start = " + encodefromBoolean(centerstart); 
      sql += " ,right_start = " + encodefromBoolean(rightstart);
      sql += " ,move_towardgoal = " + encodefromBoolean(towardgoal); 
      sql += " ,move_awaygoal = " + encodefromBoolean(awaygoal); 
      sql += " ,comments = '" + comments + "'"; 
      sql += " Where event_id = " + ffev + " and team_num = " + teamSelect + ";";
    }else {
      //database insert
      sql = "insert into PitScouting(event_id,team_num,robot_weight,robot_height,drivetrain,proglang,left_start,center_start,right_start,move_towardgoal,move_awaygoal,comments)";  
      sql += " values(" + ffev + ",";
      sql += teamSelect + "," + weight + "," + height + ",";
      sql += drivetrain + "," + proglang + "," + encodefromBoolean(leftstart) + "," + encodefromBoolean(centerstart) + "," + encodefromBoolean(rightstart) + ",";
      sql += encodefromBoolean(towardgoal) + "," + encodefromBoolean(awaygoal) + ","; 
      sql += "'" + comments + "'" + ");";  
    }

    //execute sql command 
    let parms = [];
    try {
        ExecuteCommand(sql,parms);
        saveOKAlert();
      } 
      catch (err) {
        saveFailedAlert(err);
      }
  }

  const getPitScoutingData = async() => {
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
    let sql1 = "SELECT * from Pitscouting ";
    sql1 += "Where event_id = ? and team_num = ? ";
    let teamno = teamSelect;
    let selectQuery = await ExecuteQuery(sql1,[ffev, teamno]);
    //test if any data was found 
    if(selectQuery.rows.length > 0) {
      //read sql data 
      for(let i=0;i<selectQuery.rows.length;i++) {
        setWeight(selectQuery.rows.item(i).robot_weight);
        setHeight(selectQuery.rows.item(i).robot_height);
        setDrivetrain(selectQuery.rows.item(i).drivetrain);
        setProglang(selectQuery.rows.item(i).proglang);
        setLeftstart(decodetoBoolean(selectQuery.rows.item(i).left_start));
        setCenterstart(decodetoBoolean(selectQuery.rows.item(i).center_start));
        setRightstart(decodetoBoolean(selectQuery.rows.item(i).right_start));
        setTowardgoal(decodetoBoolean(selectQuery.rows.item(i).move_towardgoal));
        setAwaygoal(decodetoBoolean(selectQuery.rows.item(i).move_awaygoal));
        setComments(selectQuery.rows.item(i).comments);
        setTeamFound(true);
      }
    } else {
      //clease screen
      setWeight("");
      setHeight("");
      setDrivetrain(0);
      setProglang(0);
      setLeftstart(false);
      setCenterstart(false);
      setRightstart(false);
      setTowardgoal(false);
      setAwaygoal(false);
      setComments("");
      setTeamFound(false);
    }  

  }

  //if team has changed - go get data from database and display it 
  if(teamSelect != lastteam) {
    getPitScoutingData(); 

    setLastteam(teamSelect);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
            
            <TeamPicker team={teamSelect} onChangeText={
                (teamSelect) => {
                  setTeamSelect(teamSelect);
                }
              }
            />   

      
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column'}}>
              
                <Text style={styles.TextHeading}>Robot Metrics</Text>
                <Textbox 
                  heading="Height:"
                  headstyle={styles.TextboxHeading}
                  keyboardType="numeric"
                  placeholder="Enter Height"
                  value={height.toString()}
                  onChangeText={
                      (height) => setHeight(height)
                  }
                  style={styles.textbox}>
                </Textbox> 
            
                <Textbox 
                  heading="Weight:"
                  headstyle={styles.TextboxHeading}
                  keyboardType="numeric"
                  placeholder="Enter Weight"
                  value={weight.toString()}
                  onChangeText={
                      (weight) => setWeight(weight)
                  }
                  style={styles.textbox}>
                </Textbox> 

                  <DrivetrainSelect drivetrain={drivetrain}
                    onChangeText={
                      (drivetrain) => setDrivetrain(drivetrain)
                  }
                  >
                  </DrivetrainSelect>
                  <ProgLangSelect proglang={proglang}
                    onChangeText={
                      (proglang) => setProglang(proglang)
                  }
                  >
                  </ProgLangSelect>
              
                

                </View>
                  <View style={styles.imagecontainer}>
                    <RobotThumbnail team={teamSelect} refresh={refresh}>
                    </RobotThumbnail>
                  </View>
             </View>
             <Text style={styles.TextHeading}>Robot Starting Position</Text>
             <View style={{flexDirection: 'row'}}>
                <ToggleSwitch 
                  heading="   Left:"
                  headstyle={styles.TextboxHeading}
                  value={leftstart}
                  onChangeText={
                    (leftstart) => setLeftstart(leftstart)
                  }
                />
                 <ToggleSwitch 
                  heading="Center:"
                  headstyle={styles.TextboxHeading}
                  value={centerstart}
                  onChangeText={
                    (centerstart) => setCenterstart(centerstart)
                  }
                />
                 <ToggleSwitch 
                  heading="Right:"
                  headstyle={styles.TextboxHeading}
                  value={rightstart}
                  onChangeText={
                    (rightstart) => setRightstart(rightstart)
                  }
                />
              </View>
              <Text style={styles.TextHeading}>Auton Movement</Text>
             <View style={{flexDirection: 'row'}}>
                <ToggleSwitch 
                  heading="   Toward Goal:"
                  headstyle={styles.TextboxHeading}
                  value={towardgoal}
                  onChangeText={
                    (towardgoal) => setTowardgoal(towardgoal)
                  }
                />
                 <ToggleSwitch 
                  heading="Away from Goal:"
                  headstyle={styles.TextboxHeading}
                  value={awaygoal}
                  onChangeText={
                    (awaygoal) => setAwaygoal(awaygoal)
                  }
                />
              </View>


             <View style={{flexDirection: 'row'}}>
               <Textbox 
                  heading="Comments:"
                  headstyle={styles.TextboxHeading}
                  keyboardType="default"
                  placeholder="Comments"
                  multiline={true}
                  numberOfLines={4}
                  value={comments}
                  onChangeText={
                      (comments) => setComments(comments)
                  }
                  style={styles.comments}>
                </Textbox> 
            </View>
            <View style={{flexDirection: 'row'}}>
            <ActionButton 
              title="Save Scouting Info" customClick={save_data} > 
            </ActionButton>
            <ActionButton 
              title="Pick Image" customClick={pick_image} > 
            </ActionButton>
            <ActionButton 
              title="Take Picture" customClick={take_picture} > 
            </ActionButton>
                  </View>
            </KeyboardAvoidingView>
          </ScrollView> 
          
      
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
  tinyLogo: {
    marginLeft:200,
    width: 250,
    height: 250,
  },
  TextHeading: {
    marginTop: 20,
    marginLeft:20,
    fontSize: 24,
    color: '#f05555',
    fontWeight: "600",
    marginBottom: 0,
  },
  TextboxHeading: {
    marginTop: 20,
    marginLeft:20,
    fontSize: 24,
  //  color: '#f05555',
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
  comments: {
    marginTop: 0,
    fontSize: 20, 
    padding: 10,
    width: 550,
    height:120,
}, 
imagecontainer: {
  position: "absolute",
  marginLeft:10,
  marginTop:20,
  left: 440,
  width: 300,
  height: 300,
}
});

export default PitScouting;