// ./components/AlliancePicklist1.js

import React, {useState} from "react";
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
 

const AlliancePicklist = (props) => {  

  //set state variables 
  let [tableHead,setTableHead] = useState(['Metric', 'Red-1', 'Red-2', 'Red-3', 'Total','Blue-1', 'Blue-2','Blue-3','Total']);
  let [widthArr,setWidthArr] = useState([150, 125, 125, 125]);
  let [scoredata,setScoreData] = useState([]);
  let [firsttime,setFirsttime] = useState(0); 
  let [action, setAction] = useState(0);
  let [lastaction, setLastAction] = useState(0);

  //test to see if parent has passed a new command 
  if(props.action != action) {
    setAction(props.action);
  };

 
  getPicklistTeams = async() => {
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
    /*
    ** Go read Picklist table 
    */       
    let sql1 = "Select list_id,team_num ";
    sql1 += " FROM Picklist ";
    sql1 += " Where event_id = ? and inalliance = 0";
    sql1 += " Order by list_id ASC, slot_id ASC;";
     
    let selectQuery = await this.ExecuteQuery(sql1,[ffev]);

    let teamarr1 = [];
    let teamarr2 = [];

    for (let i = 0; i < selectQuery.rows.length; i++) {
      if(selectQuery.rows.item(i).list_id == 1) {
        teamarr1.push([selectQuery.rows.item(i).team_num]); 
      } else {
        teamarr2.push([selectQuery.rows.item(i).team_num]); 
      }
    }
     
    formatDataTable(teamarr1,teamarr2);
    
  }

  formatDataTable = (teamarr1,teamarr2) => {
    //calculate the number of columns needed to 
    //display all teams no depending on which list is longer  
    let maxTeamCnt = teamarr1.length;
    if(teamarr2.length > maxTeamCnt) {
      maxTeamCnt = teamarr2.length;
    } 
    //console.log("TeamCnt=",maxTeamCnt);
    
    let teamcols = 3;
    let totalcols = (teamcols * 2) + 1; 
    let teamrows = Math.ceil(maxTeamCnt / teamcols);
    //console.log("teamrows=",teamrows);

    let th = [];
    let wid= [];
    for(let i=0;i<totalcols;i++) {
      if(i<teamcols) {
        th.push("1st Pick");
      } else {
        if(i==teamcols) {
          th.push("");
        } else {
          th.push("2nd Pick");
        }
      }
      wid.push(85);
    }

    //change table column headings to team numbers 
    setTableHead(th);
    setWidthArr(wid);

    let d1 = [];

    for(let i=0;i<teamrows;i++) {
        let d1r = [];
        let k=i;
        //display the first pick teams 
        for(let j=0;j<teamcols;j++) {
          if(k>=teamarr1.length) {
            d1r.push("");
          } else {
            let t=(k+1)+"-"+teamarr1[k];
            d1r.push(t);
          }
          k+=teamrows;
        }  // end for j (cols) 
        
        //handle blank column between picklists 
        d1r.push("");
        
        //display the second pick teams 
        k=i;
        for(let j=0;j<teamcols;j++) {
          if(k>=teamarr2.length) {
            d1r.push("");
          } else {
            let t1=(k+1)+"-"+teamarr2[k];
            d1r.push(t1);
          }
          k+=teamrows;
        }  // end for j (cols) 

        d1.push(d1r);
    } // end for i (rows)
    
    setScoreData(d1);
 
  } //end getTeamScores 
 
  if(firsttime == 0) {
    getPicklistTeams();
    setFirsttime(1)
  }

  if(action != lastaction) { 
    setLastAction(action);
    getPicklistTeams();
   
  }
  let data = scoredata;

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
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
      </ScrollView>
    </View> 
  );
  
} // end component 

export default AlliancePicklist;

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      padding: 16, 
      paddingTop: 10, 
      backgroundColor: '#ffffff' 
    },
    head: { 
      height: 40, 
      backgroundColor: '#C8CFEE', 
    },
    headtext: { 
      textAlign: 'center', 
      fontSize: 16,
      fontWeight: '600' 
    },
    text: { 
      textAlign: 'center', 
      fontWeight: '400', 
      fontSize: 16,
    },
    dataWrapper: { 
      marginTop: -1 
    },
    row: { 
      height: 25, 
      backgroundColor: '#F7F8FA' 
    }
  });