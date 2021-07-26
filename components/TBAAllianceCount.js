//  ../components/TBAAllianceCount

import React, {Component} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';

class TBAAllianceCount extends Component{
    constructor(props) {
        super(props);
        this.state = {
          tableHead: ['Metric', ''],
          widthArr: [170, 70],
          team: 1,
          lastteam: 0,
          data: [],
          match: [],
          alliance: [],
          position: [],
        }
      }
 

  async getMatchSchedule() {
    /*
    ** Go read Matches table from SWAMP database  
    */   
       
    let sql1 = "SELECT * from Matches ";
    sql1 += "Where red_1 = ? or red_2 = ? or red_3 = ? or blue_1 = ? or blue_2 = ? or blue_3 = ? ";
    sql1 += " order by match_num; ";

    let m=[];
    let a=[];
    let p=[];
    //get Team number to select from state 
    let teamno = this.state.team;
    let selectQuery = await ExecuteQuery(sql1,[teamno,teamno,teamno,teamno,teamno,teamno]);
    for(let i=0;i<selectQuery.rows.length;i++) { 
      //push match number onto array 
      m.push(selectQuery.rows.item(i).match_num);
      if(selectQuery.rows.item(i).red_1 == teamno) {
        a.push("R");
        p.push(1);
      }
      if(selectQuery.rows.item(i).red_2 == teamno) {
        a.push("R");
        p.push(2);
      }
      if(selectQuery.rows.item(i).red_3 == teamno) {
        a.push("R");
        p.push(3);
      }
      if(selectQuery.rows.item(i).blue_1 == teamno) {
        a.push("B");
        p.push(4);
      }
      if(selectQuery.rows.item(i).blue_2 == teamno) {
        a.push("B");
        p.push(5);
      }
      if(selectQuery.rows.item(i).blue_3 == teamno) {
        a.push("B");
        p.push(6);
      }
    }
    //go get the TBA data 
    this.getTBAData(m,a,p,teamno); 
  } // end getMatchSchedule


  async getTBAData(m,a,p,teamno) {
    /*
    ** Go read TBA Data table from SWAMP database  
    */   
    let sql2 = "SELECT * from TBA_Data ";
    sql2 += " Where event_id = ? and "; 
    for(let i=0;i<m.length;i++) {
      if(i > 0 ) {
        sql2+= " or ";
      }
      sql2 += "match_num=" + m[i];
    }
    sql2 += " order by match_num; "

    let autlow = [];  //auton low count   
    let autout = [];  //auton outer count
    let autinn = [];  //auton inner count
    let tellow = [];  //teleop low count   
    let telout = [];  //teleop outer count
    let telinn = [];  //teleop inner count
    let rankto = [];  //ranking points total
    let foulct = [];  //foul count  
    let foultc = [];  //technical foul count  
    let matwon = [];  //match won or lost  

     //go get the Frog Force Event Key for DB insert  
     let ffev = FindSettingsKey("FFEvent");

    let selectQuery2 = await ExecuteQuery(sql2,[ffev]);
    for(let i=0;i<selectQuery2.rows.length;i++) { 
        switch(a[i]) {
            case "R":
                autlow.push(selectQuery2.rows.item(i).red_auton_low);
                autout.push(selectQuery2.rows.item(i).red_auton_outer);
                autinn.push(selectQuery2.rows.item(i).red_auton_inner);
                tellow.push(selectQuery2.rows.item(i).red_tele_low);
                telout.push(selectQuery2.rows.item(i).red_tele_outer);
                telinn.push(selectQuery2.rows.item(i).red_tele_inner);
                rankto.push(selectQuery2.rows.item(i).red_rp);
                foulct.push(selectQuery2.rows.item(i).red_foul_count);
                foultc.push(selectQuery2.rows.item(i).red_techfoul_count);
                if(selectQuery2.rows.item(i).red_score > selectQuery2.rows.item(i).blue_score) {
                    matwon.push('Won'); 
                } else {
                    if(selectQuery2.rows.item(i).red_score < selectQuery2.rows.item(i).blue_score) {
                        matwon.push('Lost');
                    } else {
                        matwon.push('Tie');
                    }
                }
                break;
            case "B":
                autlow.push(selectQuery2.rows.item(i).blue_auton_low);
                autout.push(selectQuery2.rows.item(i).blue_auton_outer);
                autinn.push(selectQuery2.rows.item(i).blue_auton_inner);
                tellow.push(selectQuery2.rows.item(i).blue_tele_low);
                telout.push(selectQuery2.rows.item(i).blue_tele_outer);
                telinn.push(selectQuery2.rows.item(i).blue_tele_inner);
                rankto.push(selectQuery2.rows.item(i).blue_rp);
                foulct.push(selectQuery2.rows.item(i).blue_foul_count);
                foultc.push(selectQuery2.rows.item(i).blue_techfoul_count);
                if(selectQuery2.rows.item(i).blue_score > selectQuery2.rows.item(i).red_score) {
                    matwon.push('Won'); 
                } else {
                    if(selectQuery2.rows.item(i).blue_score < selectQuery2.rows.item(i).red_score) {
                        matwon.push('Lost');
                    } else {
                        matwon.push('Tie');
                    }
                }
                break;
        }
    }
    this.calcStats(m,autlow,autout,autinn,tellow,telout,telinn,rankto,foulct,foultc,matwon,teamno);
  } // end getTBAData

  calcStats = (m,autlow,autout,autinn,tellow,telout,telinn,rankto,foulct,foultc,matwon,teamno) => {
    const data = [];
    let dataRow = [];
    let tblHead = ['Metric', ''];
    let tblColLen = [140, 45];
    let lastMatch = 0;
 
    let scoreCardTemplate = [
        ["Auton-Low",""],
        ["Auton-Outer",""],
        ["Auton-Inner",""],
        ["Teleop-Low",""],
        ["Teleop-Outer",""],
        ["Teleop-Inner",""],
        ["Total RP",""],
        ["Foul Count",""],
        ["Tech Foul Count",""],
        ["Match Won/Lost",""]
    ]
 
    //Extend scorecard template based on matches played 
    for(let i=0;i<scoreCardTemplate.length;i++){
        for(let j=0;j<m.length+2;j++) {
            scoreCardTemplate[i][j+2] = 0;
        }
    }

    let colidx = 2;
    for (let i = 0; i < m.length; i++) {
        //test for change in match no   
        if(lastMatch != m[i]) {
            let mx = "M-" + m[i];
            tblHead.push(mx);
            tblColLen.push(50);
            lastMatch = m[i];
        }
        
        let rowidx = 0;
        let scoreRow = "";
        //Calc Auton Low
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = autlow[i];
        //Calc Auton Outer
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = autout[i];
        //Calc Auton Inner
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = autinn[i];
        //Calc Teleop Low
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = tellow[i];
        //Calc Teleop Outer
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = telout[i];
        //Calc Teleop Inner
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = telinn[i];
        //Calc Ranking Points Total 
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = rankto[i];
        //Calc Foul Count Scoring 
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = foulct[i];
        //Calc TEchnical Foul  
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = foultc[i];
         //Calc Technical Foul  
         rowidx++; 
         scoreRow = scoreCardTemplate[rowidx];
         scoreRow[colidx] = matwon[i];
        //bump to next column (match)
        colidx++;
    }
       
    //send scorecard template to state data fro render 
    for(let i=0; i<scoreCardTemplate.length;i++) {
        dataRow=[];
        for(let j=0; j<m.length+2;j++) {
            dataRow.push(scoreCardTemplate[i][j]);
        }
        data.push(dataRow);
    }
    this.setState(state => ({data: data,tableHead: tblHead, widthArr: tblColLen, lastteam: teamno })); 
  }

 static getDerivedStateFromProps(props, state) {
  // Any time the current match changes,
  // Reset state to the props  match.
  if (props.team !== state.team) {
    return {
      team: props.team
    };
  }
  return null;
}

  render() {
    const prevstate = this.state;
    if(prevstate.team != prevstate.lastteam) {
      this.getMatchSchedule();
    }
    const state = this.state;
    const data = state.data;

    let dataRow = [];
    
    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              <Row data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                {
                  data.map((dataRow, index) => (
                    <Row
                      key={index}
                      data={dataRow}
                      widthArr={state.widthArr}
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
  }  //end render 

}

export default TBAAllianceCount;

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