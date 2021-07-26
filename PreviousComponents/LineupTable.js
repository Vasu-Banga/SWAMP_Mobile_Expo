// ../components/LineupTable.js
//
import React, {useState} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';

const LineupTable = (props) => {  
  //set state variables 
  let [tableHead,setTableHead] = useState(['Team', 'Position', 'Rank', '', 'Team', 'Position', 'Rank']);
  let [widthArr,setWidth] = useState([220, 60, 50, 40, 220, 60, 50]);
  let [redTeams, setRedTeams] = useState(["","",""]);
  let [blueTeams, setBlueTeams] = useState(["","",""]);
  let [rankings,setRankings] = useState([0,0,0,0,0,0]);
  let [match,setMatch]=useState(1);
  let [lastmatch,setLastmatch]=useState(0);

  const getMatchData = async() => {
    /*
    ** Go read Matches table from SWAMP database  
    */       
    let sql1 = "SELECT matches.match_num,matches.red_1 as red_1,t1.team_name as red_1_teamname";
    sql1 += ",matches.red_2 as red_2,t2.team_name as red_2_teamname ";
    sql1 += ",matches.red_3 as red_3,t3.team_name as red_3_teamname ";
    sql1 += ",matches.blue_1 as blue_1,t4.team_name as blue_1_teamname ";
    sql1 += ",matches.blue_2 as blue_2,t5.team_name as blue_2_teamname ";
    sql1 += ",matches.blue_3 as blue_3,t6.team_name as blue_3_teamname ";
    sql1 += "FROM matches left outer join teams as t1 on matches.red_1 = t1.team_num ";
    sql1 += "left outer join teams as t2 on matches.red_2 = t2.team_num ";
    sql1 += "left outer join teams as t3 on matches.red_3 = t3.team_num ";
    sql1 += "left outer join teams as t4 on matches.blue_1 = t4.team_num ";
    sql1 += "left outer join teams as t5 on matches.blue_2 = t5.team_num ";
    sql1 += "left outer join teams as t6 on matches.blue_3 = t6.team_num ";
    sql1 += "Where match_num = ?;";

    //get match number to display from state 
    let matchno = match;
    let selectQuery = await ExecuteQuery(sql1,[matchno]);

    let red = [];
    let blue = [];
    let teams=[];

    for (let i = 0; i < selectQuery.rows.length; i++) {
      teams.push(selectQuery.rows.item(i).red_1,selectQuery.rows.item(i).red_2,selectQuery.rows.item(i).red_3,selectQuery.rows.item(i).blue_1,selectQuery.rows.item(i).blue_2,selectQuery.rows.item(i).blue_3);
      red.push(selectQuery.rows.item(i).red_1+"-"+selectQuery.rows.item(i).red_1_teamname,selectQuery.rows.item(i).red_2+"-"+selectQuery.rows.item(i).red_2_teamname,selectQuery.rows.item(i).red_3+"-"+selectQuery.rows.item(i).red_3_teamname);
      blue.push(selectQuery.rows.item(i).blue_1+"-"+selectQuery.rows.item(i).blue_1_teamname,selectQuery.rows.item(i).blue_2+"-"+selectQuery.rows.item(i).blue_2_teamname,selectQuery.rows.item(i).blue_3+"-"+selectQuery.rows.item(i).blue_3_teamname); 
    }

    setRedTeams(red);
    setBlueTeams(blue);

    getRankData(teams);
  } // end getMatchData



  getRankData = async(teamsarr) => {
     //go get the Frog Force Event Key for DB insert  
     let ffev = FindSettingsKey("FFEvent");
      /*
      ** Go read TBA Ranking for requested teams  
      */       
    let sql2 = "SELECT team_num, rank FROM TBA_Rankings ";
    sql2 += " Where event_id = ? and team_num in (?,?,?,?,?,?);";
    let selectQuery2 = await ExecuteQuery(sql2,[ffev,teamsarr[0],teamsarr[1],teamsarr[2],teamsarr[3],teamsarr[4],teamsarr[5]]);

    let rankings=[0,0,0,0,0,0];

    let j=0;
    for (let i = 0; i < selectQuery2.rows.length; i++) { 
      //find index team number in array 
      for(j=0;j<teamsarr.length;j++) {
        if(selectQuery2.rows.item(i).team_num == teamsarr[j]) {
          break;
        } 
      }
      rankings[j] = selectQuery2.rows.item(i).rank;
    }  
    
    setRankings(rankings); 
  } // end getRankingData

  const formatrow = (a,b,c,d,e,f) => {
    let dataRow = [];
    dataRow.push(a);
    dataRow.push(b);
    dataRow.push(c);
    dataRow.push(" ");
    dataRow.push(d);
    dataRow.push(e);
    dataRow.push(f);
    return dataRow;
  }

  if (props.match !== match) {
    setMatch(props.match);
  };

  if(match != lastmatch) {
    getMatchData();
    setLastmatch(match);
  }
 
  let data = [];
  let r = redTeams;
  let b = blueTeams;
  let rank = rankings; 
      
  data.push(formatrow(r[0],'Red-1',rank[0],b[0],'Blue-1',rank[3]));
  data.push(formatrow(r[1],'Red-2',rank[1],b[1],'Blue-2',rank[4]));
  data.push(formatrow(r[2],'Red-3',rank[2],b[2],'Blue-3',rank[5]));
       
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{borderColor: '#C1C0B9'}}>
            <Row data={tableHead} widthArr={widthArr} style={styles.head} textStyle={styles.text}/>
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              {
                data.map((dataRow, index) => (
                  <Row
                    key={index}
                    data={dataRow}
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
  )   //end return 

};

export default LineupTable;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#ffffff' 
  },
  head: { 
    height: 50, 
    backgroundColor: '#78C5EF', 
  },
  text: { 
    textAlign: 'center',
    fontSize: 16, 
    fontWeight: '500' 
  },
  dataWrapper: { 
    marginTop: -1 
  },
  row: { 
    height: 35, 
    backgroundColor: '#F7F8FA' 
  }
});