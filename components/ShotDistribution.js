// ..components/ShotDistribution.js

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
  } from 'react-native';
import { 
    Table, 
    TableWrapper,
    Row, 
  } from 'react-native-table-component';

const ShotDistribution = (props) => {
    let [team, setTeam] = useState(0);
    let [lastteam, setLastTeam] = useState(-1);
    let [scoredata, setScoredata] = useState([0,0,0,0,0,0]);
    let [tableHead,setTableHead] = useState(['Batter', 'Center', 'Trench', 'Floor', 'Truss','Total']);
    let [widthArr,setWidthArr] = useState([120,120,120,120,120,120]);
    

    const formatpct = (n,total) => {
      let ret = "" 
      let p=Math.round((n/total)*100);
      ret =n + " (" +  p + "%)";
      return ret;
    }

    const calc_statistics = async () => {
        //go get the Frog Force Event Key for DB insert  
        let ffev = FindSettingsKey("FFEvent");

        let sql1 = "Select match_num, floor_shot, batter_shot, trench_shot, truss_shot, center_shot ";
        sql1+= " From Match_Scouting ";
        sql1+= " Where event_id = ? and team_num = ?";
        let selectQuery = await ExecuteQuery(sql1,[ffev,team]);
        let total_floor_shot = 0;
        let total_batter_shot = 0; 
        let total_trench_shot = 0;
        let total_truss_shot = 0; 
        let total_center_shot = 0;
       
        for (let i = 0; i < selectQuery.rows.length; i++) {
            total_floor_shot += selectQuery.rows.item(i).floor_shot;
            total_batter_shot += selectQuery.rows.item(i).batter_shot;
            total_trench_shot += selectQuery.rows.item(i).trench_shot;
            total_truss_shot += selectQuery.rows.item(i).truss_shot;
            total_center_shot += selectQuery.rows.item(i).center_shot;
        }
        let total_shots = total_floor_shot + total_batter_shot + total_trench_shot + total_truss_shot + total_center_shot;
        let d=[];

        d.push(formatpct(total_batter_shot,total_shots));
        d.push(formatpct(total_center_shot,total_shots));
        d.push(formatpct(total_trench_shot,total_shots));
        d.push(formatpct(total_floor_shot,total_shots));
        d.push(formatpct(total_truss_shot,total_shots));
        d.push(formatpct(total_shots,total_shots));
        setScoredata([d]);
    }

    //test to see if parent has passed a new team prop
    if(props.team != team) {
        setTeam(props.team);
    };

    if(team != lastteam) {
        calc_statistics(); 
        setLastTeam(team);
    }

 //   let data = [[0,0,0,0,0,0]];
    let data = scoredata;

    return (
        <View>
        <Table borderStyle={{borderColor: '#C1C0B9'}}>
          <Row data={tableHead} widthArr={widthArr} style={styles.head} textStyle={styles.headtext}/>
        </Table>
        <ScrollView style={styles.dataWrapper}>
          <Table borderStyle={{borderColor: '#C1C0B9'}}>
            {
              data.map((data, index) => (
                <Row
                  key={index}
                  data={data}
                  widthArr={widthArr}
                  style={[styles.row, index%2 && {backgroundColor: '#ffffff'}]}
                  textStyle={styles.text}
                />
              ))
            }
          </Table>
        </ScrollView>
    </View>
    );
};

export default ShotDistribution;

const styles = StyleSheet.create({
dataWrapper: { 
    marginTop: -1 
},
row: { 
    height: 25, 
    backgroundColor: '#F7F8FA' 
},
text: { 
    fontSize: 22,
    textAlign: 'center', 
    fontWeight: '500',
    color: '#0880fd',
    },
head: { 
    top:10,
    bottom:10,
    height: 45, 
    backgroundColor: '#C8CFEE', 
},
    headtext: { 
    textAlign: 'center', 
    fontSize: 20,
    fontWeight: '600' 
},

  });