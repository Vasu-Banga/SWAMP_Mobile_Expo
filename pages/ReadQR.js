// ./pages/ReadQR.js
import React, { PureComponent } from 'react';
import { Alert, AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

class ReadQR extends PureComponent {  
  constructor(props) {
    super(props);
  } 

  state = {
    barcode: "",
  };


  onBarCodeRead = (e) => {
    s = this.state.barcode;
    if(s != e.data) {
      //console.log("Barcode value is:"+e.data);
      this.setState({barcode: e.data});
      let cnt = this.process_Barcode(e.data); 
      Alert.alert("Barcode Found","Barcode read! " + cnt + " Records loaded into database!");
    }
  }

  //take barcode data and load the database 
  process_Barcode = (bc) => {
    let indvRecord = "";
    let delim = "|";
    let eor = "~";
    let workchar = ""
    let reccnt = 0;
    for(let i=0;i<bc.length;i++) {
      workchar = bc.substr(i,1); 
      if(workchar == eor) {
        this.process_record(indvRecord); 
        indvRecord = "";
        reccnt++; 
      } else {
        indvRecord += workchar;
      }
    }
    return reccnt; 
  }

  process_record(rec) {
    let reclen = rec.length;
    let recidx = 0;
    let event_id = this.extract_field(rec,recidx);
    recidx+= event_id.length + 1;
    let match_num = this.extract_field(rec,recidx); 
    recidx+= match_num.length + 1;
    let team_num = this.extract_field(rec,recidx);
    recidx+= team_num.length + 1;
    let scoutnum = this.extract_field(rec,recidx);
    recidx+= scoutnum.length + 1;
    let stationnum = this.extract_field(rec,recidx);
    recidx+= stationnum.length + 1;
    let starting_pos = this.extract_field(rec,recidx);
    recidx+= starting_pos.length + 1;
    let ball_preloads = this.extract_field(rec,recidx);
    recidx+= ball_preloads.length + 1;
    let auton_motion = this.extract_field(rec,recidx);
    recidx+= auton_motion.length + 1;
    let auton_balls_low = this.extract_field(rec,recidx);
    recidx+= auton_balls_low.length + 1;
    let auton_balls_outer = this.extract_field(rec,recidx);
    recidx+= auton_balls_outer.length + 1;
    let auton_balls_inner = this.extract_field(rec,recidx);
    recidx+= auton_balls_inner.length + 1;
    let tele_cycle_count = this.extract_field(rec,recidx);
    recidx+= tele_cycle_count.length + 1;
    let tele_balls_low = this.extract_field(rec,recidx);
    recidx+= tele_balls_low.length + 1;
    let tele_balls_outer = this.extract_field(rec,recidx);
    recidx+= tele_balls_outer.length + 1;
    let tele_balls_inner = this.extract_field(rec,recidx);
    recidx+= tele_balls_inner.length + 1;
    let floor_shot = this.extract_field(rec,recidx);
    recidx+= floor_shot.length + 1;
    let batter_shot = this.extract_field(rec,recidx);
    recidx+= batter_shot.length + 1;
    let trench_shot = this.extract_field(rec,recidx);
    recidx+= trench_shot.length + 1;
    let truss_shot = this.extract_field(rec,recidx);
    recidx+= truss_shot.length + 1;
    let center_shot = this.extract_field(rec,recidx);
    recidx+= center_shot.length + 1;
    let ending_pos = this.extract_field(rec,recidx);
    recidx+= ending_pos.length + 1;
    let switch_level = this.extract_field(rec,recidx);
    recidx+= switch_level.length + 1;
    let rotation_challenge = this.extract_field(rec,recidx);
    recidx+= rotation_challenge.length + 1;
    let position_challenge = this.extract_field(rec,recidx);
    recidx+= position_challenge.length + 1;
    let defense = this.extract_field(rec,recidx);
    recidx+= defense.length + 1;

    let sql1="Insert or Replace into Match_Scouting(event_id,match_num,team_num,scoutnum,stationnum,starting_pos,ball_preloads,";
    sql1 += "auton_motion,auton_balls_low,auton_balls_outer,auton_balls_inner,tele_cycle_count,tele_balls_low,tele_balls_outer,";
    sql1 += "tele_balls_inner,floor_shot,batter_shot,trench_shot,truss_shot,center_shot,ending_pos,switch_level,rotation_challenge,position_challenge,defense) ";
    sql1 += "Values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);" 
    
    // ******************
    //  force event_id = 99 to not pollute existing data 
    // ******************

    event_id = 99; 

    let parms=[event_id,match_num,team_num,scoutnum,stationnum,starting_pos,ball_preloads,auton_motion,auton_balls_low,auton_balls_outer,auton_balls_inner,tele_cycle_count,tele_balls_low,tele_balls_outer,tele_balls_inner,floor_shot,batter_shot,trench_shot,truss_shot,center_shot,ending_pos,switch_level,rotation_challenge,position_challenge,defense];
    //console.log("sql=",sql1);
    //console.log("parms=",parms);
    ExecuteCommand(sql1,parms); 
  }

  extract_field(data,recidx ) {
    let ret = ""; 
    let wc = ""; 
    let delim = "|";
    for(var i=recidx;i<data.length;i++) {
      wc = data.substr(i,1);
      if(wc==delim) {
        break;
      } else {
        ret+=wc;   //append char to return string 
      }
    }
    return ret;
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead = {this.onBarCodeRead}
        />
      
      </View>
    );
  }



 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default ReadQR;