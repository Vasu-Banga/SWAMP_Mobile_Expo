// ./components/ScorecardSum.js

import React, {useState} from "react";
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';

const ScorecardSum = (props) => {  

  //set state variables 
  let [tableHead,setTableHead] = useState(['Metric', 'Red-1', 'Red-2', 'Red-3', 'Total','Blue-1', 'Blue-2','Blue-3','Total']);
  let [widthArr,setWidthArr] = useState([170, 70, 70, 70, 70, 70,70,70,70]);
  let [match,setMatch] = useState(0);
  let [scoredata,setScoreData] = useState([]);
  let [lastmatch,setLastMatch] = useState(1);
  let [forecast,setForecast] = useState(0);
  let [lastforecast, setLastForecast] = useState(0);

  if(props.match != match) {
    setMatch(props.match);
  };

  if(props.forecast != forecast) {
    setForecast(props.forecast);
  }
  
  getTeamsbyMatch = async(matchno) => {
    /*
    ** Go read Matches table from SWAMP database  
    */       
    let sql1 = "SELECT match_num,red_1 as red_1,red_2 as red_2,red_3 as red_3";
    sql1 += ",blue_1 as blue_1,blue_2 as blue_2,blue_3 as blue_3";
    sql1 += " FROM matches ";
    sql1 += " Where match_num = ?;";
    
    //get match number to display from state 
    let selectQuery = await ExecuteQuery(sql1,[matchno]);

    let teamarr = [];

    for (let i = 0; i < selectQuery.rows.length; i++) {
      teamarr.push(selectQuery.rows.item(i).red_1,selectQuery.rows.item(i).red_2,selectQuery.rows.item(i).red_3,selectQuery.rows.item(i).blue_1,selectQuery.rows.item(i).blue_2,selectQuery.rows.item(i).blue_3); 
    }
    //pass list of teams for this match to next function 
    getTeamScores(teamarr);
    
  }

  getTeamScores = async(matchteams) => {
    /*
    ** Go read Scouting Observations for a requested teams
    */       
    let sql1 = "SELECT team_num,match_num,auton_motion,auton_balls_low,auton_balls_outer,auton_balls_inner";
    sql1 += ",tele_balls_low,tele_balls_outer,tele_balls_inner";
    sql1 += ",rotation_challenge,position_challenge,ending_pos,switch_level,auton_motion_completed,rotation_completed,position_completed,climb_completed,park_completed";
    sql1 += " FROM Match_Scouting ";
    sql1 += " Where team_num in (?,?,?,?,?,?);";
    
    let scoreQuery = await this.ExecuteQuery(sql1,[matchteams[0],matchteams[1],matchteams[2],matchteams[3],matchteams[4],matchteams[5]]);
    
    let j = 0;
    //init values for single match score
    let autonmatchscore = 0; 
    let teleopmatchscore = 0;
    let controlpanmatchscore = 0;
    let endgamematchscore = 0;

    //init tables for displaying team values 
    let autondisplayscore = [0,0,0,0,0,0];
    let teleopdisplayscore = [0,0,0,0,0,0];
    let controlpandisplayscore = [0,0,0,0,0,0];
    let endgamedisplayscore = [0,0,0,0,0,0];

    //init tables for match teams-all match scores 
    let autonAllMatchScore = [[],[],[],[],[],[]];
    let teleopAllMatchScore = [[],[],[],[],[],[]];
    let controlpanAllMatchScore = [[],[],[],[],[],[]];
    let endgameAllMatchScore = [[],[],[],[],[],[]];

    //calculate the score for each match in result set 
    for (let i = 0; i < scoreQuery.rows.length; i++) {
      //clear match scores 
      autonmatchscore = 0;
      teleopmatchscore = 0;
      controlpanmatchscore = 0;
      endgamematchscore = 0;
      
      //calc auton scores 
      autonmatchscore += scoreQuery.rows.item(i).auton_motion_completed * 5;
      autonmatchscore += scoreQuery.rows.item(i).auton_balls_low * 2;
      autonmatchscore += scoreQuery.rows.item(i).auton_balls_outer * 4;
      autonmatchscore += scoreQuery.rows.item(i).auton_balls_inner * 6;
      
      //calc teleop scores 
      teleopmatchscore += scoreQuery.rows.item(i).tele_balls_low * 1;
      teleopmatchscore += scoreQuery.rows.item(i).tele_balls_outer * 2;
      teleopmatchscore += scoreQuery.rows.item(i).tele_balls_inner * 3;

      //calc control panel scores 
      if(scoreQuery.rows.item(i).rotation_completed == 1) {
        controlpanmatchscore += 10;
      }

      if(scoreQuery.rows.item(i).position_completed == 1) {
        controlpanmatchscore += 20;
      }

      //calc end game scores 
      if(scoreQuery.rows.item(i).park_completed == 1) {
        endgamematchscore += 5;
      } else {
          if(scoreQuery.rows.item(i).climb_completed == 1) {
            endgamematchscore += 25;
          }
      }
      if(scoreQuery.rows.item(i).switch_level == 2) {
        endgamematchscore += 5;
      }

      //find index of team this score is for 
      for (j=0; j< matchteams.length;j++){
        if(matchteams[j] == scoreQuery.rows.item(i).team_num) {
          break;
        }
      }
      
      //calculate the total score for the match
      let matchtotalscore = autonmatchscore+teleopmatchscore+controlpanmatchscore+endgamematchscore;
      //for this team dtermine thier current best total score 
      let besttotalscore = autondisplayscore[j]+teleopdisplayscore[j]+controlpandisplayscore[j]+endgamedisplayscore[j];

      //if the match score is better than the current best score-update the best score with new values 
      if(matchtotalscore > besttotalscore) {
        autondisplayscore[j] = autonmatchscore;
        teleopdisplayscore[j] = teleopmatchscore;
        controlpandisplayscore[j] = controlpanmatchscore;
        endgamedisplayscore[j] = endgamematchscore;
      }

      //add match score to AllMatch score table for this team 
      autonAllMatchScore[j].push(autonmatchscore);
      teleopAllMatchScore[j].push(teleopmatchscore);
      controlpanAllMatchScore[j].push(controlpanmatchscore);
      endgameAllMatchScore[j].push(endgamematchscore);

    } // end for
    //if forecast metric is linear regression - go calculate it  
    if(forecast > 0) {
      autondisplayscore = calcStatictics(autonAllMatchScore);
      teleopdisplayscore = calcStatictics(teleopAllMatchScore);
      controlpandisplayscore = calcStatictics(controlpanAllMatchScore);
      endgamedisplayscore = calcStatictics(endgameAllMatchScore);
    }

    buildTable(matchteams,autondisplayscore,teleopdisplayscore,controlpandisplayscore,endgamedisplayscore);
  } // end getTeamScores
   


  buildTable = (matchteams,autondisplayscore,teleopdisplayscore,controlpandisplayscore,endgamedisplayscore) => {
    /*
    ** Build datatable for display    
    */     
  
    //change table column headings to team numbers 
    setTableHead(['Metric', matchteams[0], matchteams[1], matchteams[2], 'Total',matchteams[3], matchteams[4],matchteams[5],'Total']);

    let d1 = [];
    let d1r = [];

    d1r.push("Auton");
    d1r.push(autondisplayscore[0]);
    d1r.push(autondisplayscore[1]);
    d1r.push(autondisplayscore[2]);
    d1r.push(autondisplayscore[0]+autondisplayscore[1]+autondisplayscore[2]);
    d1r.push(autondisplayscore[3]);
    d1r.push(autondisplayscore[4]);
    d1r.push(autondisplayscore[5]);
    d1r.push(autondisplayscore[3]+autondisplayscore[4]+autondisplayscore[5]);
    d1.push(d1r);

    d1r=[];
    d1r.push("Teleop");
    d1r.push(teleopdisplayscore[0]);
    d1r.push(teleopdisplayscore[1]);
    d1r.push(teleopdisplayscore[2]);
    d1r.push(teleopdisplayscore[0]+teleopdisplayscore[1]+teleopdisplayscore[2]);
    d1r.push(teleopdisplayscore[3]);
    d1r.push(teleopdisplayscore[4]);
    d1r.push(teleopdisplayscore[5]);
    d1r.push(teleopdisplayscore[3]+teleopdisplayscore[4]+teleopdisplayscore[5]); 
    d1.push(d1r);

    d1r = [];
    d1r.push("Control Panel");
    d1r.push(controlpandisplayscore[0]);
    d1r.push(controlpandisplayscore[1]);
    d1r.push(controlpandisplayscore[2]);
    d1r.push(controlpandisplayscore[0]+controlpandisplayscore[1]+controlpandisplayscore[2]);
    d1r.push(controlpandisplayscore[3]);
    d1r.push(controlpandisplayscore[4]);
    d1r.push(controlpandisplayscore[5]);
    d1r.push(controlpandisplayscore[3]+controlpandisplayscore[4]+controlpandisplayscore[5]);
    d1.push(d1r);
      
    d1r = [];
    d1r.push("End Game");
    d1r.push(endgamedisplayscore[0]);
    d1r.push(endgamedisplayscore[1]);
    d1r.push(endgamedisplayscore[2]);
    d1r.push(endgamedisplayscore[0]+endgamedisplayscore[1]+endgamedisplayscore[2]);
    d1r.push(endgamedisplayscore[3]);
    d1r.push(endgamedisplayscore[4]);
    d1r.push(endgamedisplayscore[5]);
    d1r.push(endgamedisplayscore[3]+endgamedisplayscore[4]+endgamedisplayscore[5]);
    d1.push(d1r);
      
    d1r = [];
    d1r.push("");
    d1r.push('');
    d1r.push("");
    d1r.push("");
    d1r.push(" ");
    d1r.push('');
    d1r.push("");
    d1r.push("");
    d1r.push(" ");
    d1.push(d1r);

    //calculate totals 
    let gt = [0,0,0,0,0,0];
    for (let k=0; k< matchteams.length;k++){
      gt[k] = autondisplayscore[k] + teleopdisplayscore[k] + controlpandisplayscore[k] + endgamedisplayscore[k];
    }

    d1r = [];
    d1r.push("Grand Total");
    d1r.push(gt[0]);
    d1r.push(gt[1]);
    d1r.push(gt[2]);
    d1r.push(gt[0]+gt[1]+gt[2]);
    d1r.push(gt[3]);
    d1r.push(gt[4]);
    d1r.push(gt[5]);
    d1r.push(gt[3]+gt[4]+gt[5]);
    d1.push(d1r);

    setScoreData(d1);
  } // end buildTable 


  calcStatictics = (teamScoreArr) => {
  /*
  ** calculate linear regression value for a given score array
  ** inoput is a 2-d array 6-teams and all thier match scores  
  ** in effect predict what the next score will be 
  */
    let retarr = [0,0,0,0,0,0];
    let teamIndex = 0;
    //loop trough each of the 6 teams submitted 
    teamScoreArr.forEach(teamrow => {
      let known_y = teamrow;
      let known_x = [];
      for(let i=0;i<teamrow.length;i++){
        known_x.push(i+1);
      }
      //call linear regression routine 
      let lr = linearRegression(known_y, known_x);
      //console.log("slope=",lr.slope);
      //console.log("intercept=",lr.intercept);
      //console.log("r2=",lr.r2);
      //predict next score 
      let prediction = lr.intercept + ((teamrow.length+1) * lr.slope);
      retarr[teamIndex] = Math.ceil(prediction); //round up to next integer  
      teamIndex++;
    });


    return retarr;
  }

  linearRegression = (y,x) =>{
    /*
    ** calculate linear regression 
    */

    let lr = {};
    let n = y.length;
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let sum_yy = 0;

    for (let i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}


  /*
  ** Mainline routine 
  */

  if(match != lastmatch || forecast != lastforecast) {
    setLastMatch(match);
    setLastForecast(forecast);
    getTeamsbyMatch(match);
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

export default ScorecardSum;

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      padding: 16, 
      paddingTop: 20, 
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