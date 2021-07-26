// ./components/AllianceTeams.js

import React, {useState} from "react";
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';



const AllianceTeams = (props) => {  

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
 
  const getTeamsbyRank = async() => {
     //go get the Frog Force Event Key for DB insert  
     let ffev = FindSettingsKey("FFEvent");
    /*
    ** Go read Team Rank from TBA_Rankings table 
    */       
    let sql1 = "SELECT team_num,rank ";
    sql1 += " FROM Alliance_Teams ";
    sql1 += " Where event_id = ? and alliance_id = 0";
    sql1 += " Order by rank;";
     
    let selectQuery = await this.ExecuteQuery(sql1,[ffev]);

    let teamarr = [];
    let rankarr = [];

    for (let i = 0; i < selectQuery.rows.length; i++) {
      teamarr.push([selectQuery.rows.item(i).team_num]); 
      rankarr.push([selectQuery.rows.item(i).rank]);
    }
    //save list of teams for this match in state variables 
    getTeamsScores(teamarr,rankarr);
    
  }

const getTeamsScores = (teamarr,rankarr) => {
    //calculate the number of columns needed to display all teams 
    let maxTeamCnt = teamarr.length; 
    //console.log("TeamCnt=",maxTeamCnt);
    let teamcols = 8;
    let teamrows = Math.ceil(maxTeamCnt / teamcols);
    //console.log("teamrows=",teamrows);

    let th = [];
    let wid=[];
    for(let i=0;i<teamcols;i++) {
      th.push("");
      wid.push(85);
    }

    //change table column headings to team numbers 
    setTableHead(th);
    setWidthArr(wid);

    let d1 = [];

    for(let i=0;i<teamrows;i++) {
        let d1r = [];
        let k=i;
        for(j=0;j<teamcols;j++) {
          if(k>=maxTeamCnt) {
            d1r.push("");
          } else {
            let t = rankarr[k] + "-" + teamarr[k];
            d1r.push(t);
          }
          k+=teamrows;
        }  // end for j (cols)  
        d1.push(d1r);
    } // end for i (rows)
    
    setScoreData(d1);
 
  } //end getTeamScores 
 
  if(firsttime == 0) {
    getTeamsbyRank();
    setFirsttime(1)
  }

  if(action != lastaction) { 
    setLastAction(action);
    getTeamsbyRank();
   
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

export default AllianceTeams;

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