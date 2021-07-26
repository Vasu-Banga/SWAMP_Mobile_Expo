// ./components/AllianceSelect.js

import React, {useState} from "react";
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';

const AllianceSelect = (props) => {  

  //set state variables 
  let [tableHead,setTableHead] = useState(['Metric', 'Red-1', 'Red-2', 'Red-3', 'Total','Blue-1', 'Blue-2','Blue-3','Total']);
  let [widthArr,setWidthArr] = useState([150, 125, 125, 125]);
  let [action,setAction] = useState(0);
  let [lastaction,setLastAction] = useState(0);
  let [scoredata,setScoreData] = useState([]);
  let [firsttime,setFirsttime] = useState(0); 

  //test to see if parent has passed a new command 
  if(props.action != action) {
    setAction(props.action);
  };
 
  const getTeamsbyRank = async() => {
    /*
    ** Go read Team Rank from TBA_Rankings table 
    */       
    let sql1 = "SELECT alliance_id,pick_num,team_num ";
    sql1 += " FROM Alliance_Teams ";
    sql1 += " Where alliance_id > 0 ";
    sql1 += " Order by alliance_id,pick_num;";
     
    let selectQuery = await this.ExecuteQuery(sql1,[]);

    //initialize 2d alliance array 
    let alliancearr = [];
    for (let i = 0; i < 8; i++) {
        alliancearr.push(["","",""]);
    }

    let a = 0;  //alliance
    let p = 0;  //pick 
    //pass SQL data and put into array by alliance ID 
    for (let k = 0; k < selectQuery.rows.length; k++) {
      a = selectQuery.rows.item(k).alliance_id - 1;
      p = selectQuery.rows.item(k).pick_num-1;
      alliancearr[a][p] = selectQuery.rows.item(k).team_num; 
    }
    //save list of teams for this match in state variables 
    formatDisplay(alliancearr);
  }

  const formatDisplay = (alliancearr) => {
    //change table column headings to team numbers 
    setTableHead(["Alliance","Captain","First Pick","Second Pick"]);

    let d1 = [];

    for(let i=0;i<8;i++) {
        let d1r = [];
        let a=i+1;
        let h = "Alliance " + a;
        d1r.push(a,alliancearr[i][0], alliancearr[i][1],alliancearr[i][2]);
        d1.push(d1r);
    } // end for 
    
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

  //test if any updating to the table needs to be done 

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

export default AllianceSelect;

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