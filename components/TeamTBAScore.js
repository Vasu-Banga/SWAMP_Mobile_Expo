import React, {Component} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';

class TeamTBAScore extends Component{
    constructor(props) {
        super(props);
        this.state = {
          tableHead: ['Metric', 'Points'],
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

    let ami = []; 
    let egp = [];
    let egh = [];

    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");

    let selectQuery2 = await ExecuteQuery(sql2,[ffev]);
    for(let i=0;i<selectQuery2.rows.length;i++) { 
      switch(p[i]) {
        case 1:
          ami.push(this.testForTwo(selectQuery2.rows.item(i).red_1_moved));
          egp.push(this.testForTwo(selectQuery2.rows.item(i).red_1_climbed));
          egh.push(this.testForThree(selectQuery2.rows.item(i).red_1_climbed));
          break;
        case 2:
          ami.push(this.testForTwo(selectQuery2.rows.item(i).red_2_moved));
          egp.push(this.testForTwo(selectQuery2.rows.item(i).red_2_climbed));;
          egh.push(this.testForThree(selectQuery2.rows.item(i).red_2_climbed));
          break;
        case 3:
          ami.push(this.testForTwo(selectQuery2.rows.item(i).red_3_moved));
          egp.push(this.testForTwo(selectQuery2.rows.item(i).red_3_climbed));
          egh.push(this.testForThree(selectQuery2.rows.item(i).red_3_climbed));
          break;
        case 4:
          ami.push(this.testForTwo(selectQuery2.rows.item(i).blue_1_moved));
          egp.push(this.testForTwo(selectQuery2.rows.item(i).blue_1_climbed));
          egh.push(this.testForThree(selectQuery2.rows.item(i).blue_1_climbed));
          break;
        case 5:
          ami.push(this.testForTwo(selectQuery2.rows.item(i).blue_2_moved));
          egp.push(this.testForTwo(selectQuery2.rows.item(i).blue_2_climbed));
          egh.push(this.testForThree(selectQuery2.rows.item(i).blue_2_climbed));
          break; 
        case 6:
          ami.push(this.testForTwo(selectQuery2.rows.item(i).blue_3_moved));
          egp.push(this.testForTwo(selectQuery2.rows.item(i).blue_3_climbed));
          egh.push(this.testForThree(selectQuery2.rows.item(i).blue_3_climbed));
          break; 
      }
    }
    this.calcStats(m,ami,egp,egh,teamno);
  } // end componentDidMount

  //function to test input value for a 2 if found return 1 else 0 
  testForTwo = (a) => {
    let r = 0;
    if(a==2) {
      r=1;
    }
    return r;
  }

 //function to test input value for a 3 if found return 1 else 0 
 testForThree = (a) => {
  let r = 0;
  if(a==3) {
    r=1;
  }
  return r;
}


  calcStats = (m,ami,egp,egh,teamno) => {
    const data = [];
    let dataRow = [];
    let tblHead = ['Metric', 'Points'];
    let tblColLen = [140, 45];
    let lastMatch = 0;
 
    let scoreCardTemplate = [
        ["Auton Move Init",5],
        ["End Game Park",5],
        ["End Game Hang",25],
        ["Grand Total"," "]
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
        //Calc Move Init Score 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * ami[i];
        let t1 = scoreRow[colidx];
        //Calc Park Score
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * egp[i];
        let t10 = scoreRow[colidx];
        //calc Climb score  
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = scoreRow[1] * egh[i];
        let t11 = scoreRow[colidx];
        //calc grand total  
        rowidx++; 
        scoreRow = scoreCardTemplate[rowidx];
        scoreRow[colidx] = t1+t10+t11;
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

export default TeamTBAScore;

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