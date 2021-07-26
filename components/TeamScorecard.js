
import React, {useState} from 'react';
import { StyleSheet, ScrollView,View } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';

const TeamScorecard = (props) => {  
  //set state variables 
  let [tableHead,setTableHead] = useState(['Metric', 'Points']);
  let [widthArr,setWidthArr] = useState([170, 70]);
  let [team,setTeam] = useState(1);
  let [lastteam,setLastTeam] = useState(0);
  let [dataarr,setDataArr] = useState([]);

  const getMatchData = async() => {
    /*
    ** Go read Matches table from SWAMP database  
    */   
 
    let sql1 = "SELECT * from Match_Scouting ";
    sql1 += "Where event_id = ? and team_num = ?;";

    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
    let teamno = team;
    let selectQuery = await ExecuteQuery(sql1,[ffev,teamno]);
    //var rows = selectQuery.rows;

    calcStats(selectQuery.rows,teamno);
  } // end getMatchData

  calcStats = (rows,teamno) => {
    const data = [];
    let dataRow = [];
    let tblHead = ['Metric', 'Points'];
    let tblColLen = [140, 45];
    let lastMatch = 0;
    let scoreCardTemplate = [
      ["Auton Move Init",5],
      ["Auton Lower Goal",2],
      ["Auton Outer Goal",4],
      ["Auton Inner Goal",6],
      ["Auton Sub-Total",""],
      ["Teleop Lower Goal",1],
      ["Teleop Outer Goal",2],
      ["Teleop Inner Goal",3],
      ["Teleop Sub-Total",""],
      ["Rotation Control",10],
      ["Position Control",20],
      ["Color Whl Sub-Total",""],
      ["End Game Park",5],
      ["End Game Hang",25],
      ["End Game Level",5],
      ["End Game Sub-Total",""],
      ["Grand Total",""]
   ]
 
    //Extend scorecard template based on matches played 
    for(let i=0;i<scoreCardTemplate.length;i++){
        for(let j=0;j<rows.length+2;j++) {
            scoreCardTemplate[i][j+2] = 0;
        }
    }

    let colidx = 2;
    for (let i = 0; i < rows.length; i++) {
        //test for change in match no   
        if(lastMatch != rows.item(i).match_num) {
            let m = "M-" + rows.item(i).match_num;
            tblHead.push(m);
            tblColLen.push(50);
            lastMatch = rows.item(i).match_num;
        }
        
        let rowidx = 0;
        let scoreRow = "";
        //Calc Move Init Score 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * rows.item(i).auton_motion_completed;
        let t1 = scoreRow[colidx];
        //Calc Auton Low Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * rows.item(i).auton_balls_low;
        let t2 = scoreRow[colidx];
        //Calc Auton Outer Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * rows.item(i).auton_balls_outer;
        let t3 = scoreRow[colidx];
        //Calc Auton Inner Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * rows.item(i).auton_balls_inner;
        let t4 = scoreRow[colidx];
        //calc Auton Subtotal 
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = t1+t2+t3+t4;
        //Calc Teleop Low Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * rows.item(i).tele_balls_low;
        let t5 = scoreRow[colidx];
        //Calc Teleop Outer Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * rows.item(i).tele_balls_outer;
        let t6 = scoreRow[colidx];
        //Calc Teleop Inner Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * rows.item(i).tele_balls_inner;
        let t7 = scoreRow[colidx];
        //calc Teleop Subtotal 
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = t5+t6+t7;
        
        //Calc Color Wheel Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        if(rows.item(i).rotation_challenge_completed > 0) {
          scoreRow[colidx] = scoreRow[1]; 
        }
        let t8 = scoreRow[colidx];
        //Calc Color Wheel Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        if(rows.item(i).position_completed > 0) {
          scoreRow[colidx] = scoreRow[1];
        }
        let t9 = scoreRow[colidx];
        //calc Color Wheel Subtotal 
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = t8+t9;
        //Calc Park Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        let t10 = 0;
        scoreRow[colidx] = scoreRow[1] * rows.item(i).park_completed;
        t10 = scoreRow[colidx];
        //calc Climb score  
        let t11 = 0;
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * rows.item(i).climb_completed;
        t11 = scoreRow[colidx];
        //calc Level score  
        let t12 = 0;
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        if(rows.item(i).switch_level == 2)
          scoreRow[colidx] = scoreRow[1];
          t12 = scoreRow[colidx];
        //calc END GAME TOTAL   
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = t10+t11+t12;
        //calc grand total  
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = t1+t2+t3+t4+t5+t6+t7+t8+t9+t10+t11+t12;
        //bump to next column (match)
        colidx++;
    }
       
    //send scorecard template to state data fro render 
    for(let i=0; i<scoreCardTemplate.length;i++) {
        dataRow=[];
        for(let j=0; j<rows.length+2;j++) {
            dataRow.push(scoreCardTemplate[i][j]);
        }
        data.push(dataRow);
    }
    
    setDataArr(data); 
    setTableHead(tblHead);
    setWidthArr(tblColLen);
  }

  if(props.team != team) {
    setTeam(props.team);
  }

  if(team != lastteam) {
    getMatchData(); 
    setLastTeam(team);
  }

  let data = dataarr;
  let dataRow = [];

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
  );
};
export default TeamScorecard;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 10, 
    backgroundColor: '#ffffff' 
  },
  head: { 
    height: 50, 
    backgroundColor: '#78C5EF', 
  },
  text: { 
    textAlign: 'center', 
    fontWeight: '500' 
  },
  dataWrapper: { 
    marginTop: -1 
  },
  row: { 
    height: 30, 
    backgroundColor: '#F7F8FA' 
  }
});