// ./components/Test2.js

import React, {useState} from "react";
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';

const Test2 = (props) => {  

  //set state variables 
  let [tableHead,setTableHead] = useState(['Table', 'Rows', 'Comments']);
  let [widthArr,setWidthArr] = useState([150, 100, 500]);
  let [scoredata,setScoreData] = useState([]);
  let [firsttime,setFirsttime] = useState(0); 
 
  const getDatabaseStatus = async() => {
    /*
    ** Go read SWAMP tables and extract relevant dataTeam Rank from TBA_Rankings table 
    */       
     
    let d1 = [];
    let comment = "";
    let evtkey = ""; 
    let evtname = "";  
    let evtid = 0; 

    //Events
    let sql1 = "SELECT * from Events ";
    let selectQuery = await this.ExecuteQuery(sql1,[]);

    //pass SQL data and extract event data put 
    for (let i = 0; i < selectQuery.rows.length; i++) {
      evtid = selectQuery.rows.item(i).event_id;
      evtkey = selectQuery.rows.item(i).event_key;
      evtname = selectQuery.rows.item(i).event_name;
    }
    
    comment = "("+evtid+")" + evtkey + "-"+evtname;
    d1.push(["Events",selectQuery.rows.length,comment]);
    

    //Teams
    let sql2 = "SELECT * from Teams ";
    let selectQuery2 = await this.ExecuteQuery(sql2,[]);
    comment = "";
    d1.push(["Teams",selectQuery2.rows.length,comment]);
    
    //Matches
    let sql3 = "SELECT * from Matches ";
    let selectQuery3 = await this.ExecuteQuery(sql3,[]);
    comment = "";
    d1.push(["Matches",selectQuery3.rows.length,comment]);
    
    //Match Scouting
    let sql4 = "SELECT event_id, count(*) as obscount,max(match_num) as maxmatch from Match_Scouting group by event_id";
    let selectQuery4 = await this.ExecuteQuery(sql4,[]);
    
    //pass SQL data and extract row ecount by event id 
    for (let i = 0; i < selectQuery4.rows.length; i++) {
      comment = "Observations for event id=" + selectQuery4.rows.item(i).event_id + "   Last match="+selectQuery4.rows.item(i).maxmatch ;
      d1.push(["Scouting Obs",selectQuery4.rows.item(i).obscount,comment]);
    }
    
    //TBA Data
    let sql5 = "SELECT event_id, count(*) as tbacount,max(match_num) as maxmatch from TBA_Data group by event_id ";
    let selectQuery5 = await this.ExecuteQuery(sql5,[]);
    
    //pass SQL data and extract row ecount by event id 
    for (let i = 0; i < selectQuery5.rows.length; i++) {
      comment = "Observations for event id=" + selectQuery5.rows.item(i).event_id + "   Last match="+selectQuery5.rows.item(i).maxmatch ;
      d1.push(["TBA Match Results",selectQuery5.rows.item(i).tbacount,comment]);
    }

    
    
    
 
    setScoreData(d1);

  } //end getDatabaseStatus 
 

  /*********
   * Mainline 
   */
  if(firsttime == 0) {
    getDatabaseStatus();
    setFirsttime(1)
  }

  let data = scoredata;
//let data=[["Test",99,"xxxxxx"]];

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

export default Test2;

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