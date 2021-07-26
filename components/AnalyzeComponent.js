// ../components/AnalyzeComponent.js

import React, {useState} from 'react';
import { Dimensions, View } from 'react-native'
// import { BarChart, Grid, XAxis } from 'react-native-svg-charts'
import {LineChart, Path, Grid, XAxis, YAxis} from 'react-native-svg-charts';
import { Text } from 'react-native-svg';
import * as scale from 'd3-scale';

const linearRegression = (y,x) =>{
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



const AnalyzeComponent = (props) => {  
  //set state variables 
  let [metric,setMetric] = useState(1);
  let [lastmetric,setLastMetric] = useState(0);
  let [team, setTeam] = useState(0); 
  let [lastTeam, setLastTeam] = useState(0);
  let [teamdata,setTeamData] = useState([{"match": 0, "score":0}]);
 
 


  const getMatchData = async() => {
    /*
    ** Go read MatchScouting table from SWAMP database  
    */      
    let sql1 = "";
    //console.log("metric",metric);
    switch(metric) {
        case 1:     //auton 
            sql1 += "SELECT ms.event_id, ms.match_num, ms.team_num,t.team_name"
            sql1 += ", (ms.auton_motion_completed * 5 + ms.auton_balls_low * 2";
            sql1 += "+ ms.auton_balls_outer * 4 + ms.auton_balls_inner * 6) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "; 
            sql1 += " and ms.team_num = ? ";
            sql1 += " order by ms.match_num ";
            break;
        case 2:     //teleop 
             sql1 += "SELECT ms.event_id, ms.match_num, ms.team_num,t.team_name"
             sql1 += ", (ms.tele_balls_low * 1 ";
             sql1 += "+ ms.tele_balls_outer * 2 + ms.tele_balls_inner * 3) as score ";
             sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
             sql1 += "Where ms.event_id = ? "
             sql1 += " and ms.team_num = ? ";
             sql1 += " order by ms.match_num ";
             break;
        case 3:     //color wheel 
            sql1 += "SELECT ms.event_id, ms.match_num,ms.team_num,t.team_name"
            sql1 += ", (ms.rotation_completed * 10 ";
            sql1 += "+ ms.position_completed * 20) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += " and ms.team_num = ? ";
            sql1 += " order by ms.match_num ";
            break;
         case 4:     // end game
            sql1 += "SELECT ms.event_id, ms.match_num,ms.team_num,t.team_name"
            sql1 += ", (ms.park_completed * 5 + ms.climb_completed * 25) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += " and ms.team_num = ? ";
            sql1 += " order by ms.match_num ";
            break;
        case 5:     //total score
          sql1 += "SELECT ms.event_id, ms.match_num, ms.team_num,t.team_name"
          sql1 += ", (ms.auton_motion_completed * 5 + ms.auton_balls_low * 2";
          sql1 += "+ ms.auton_balls_outer * 4 + ms.auton_balls_inner * 6 ";
          sql1 += "+ ms.tele_balls_low * 1 ";
          sql1 += "+ ms.tele_balls_outer * 2 + ms.tele_balls_inner * 3 ";
          sql1 += "+ ms.rotation_completed * 10 ";
          sql1 += "+ ms.position_completed * 20 ";
          sql1 += "+ ms.park_completed * 5 + ms.climb_completed * 25) as score ";
          sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
          sql1 += "Where ms.event_id = ? "; 
          sql1 += " and ms.team_num = ? ";
          sql1 += " order by ms.match_num ";
          break;
    
    }

    //console.log("SQL=",sql1);
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");
    
    let selectQuery = await ExecuteQuery(sql1,[ffev, team]);

    let scoreTable = [];

    for (let i = 0; i < selectQuery.rows.length; i++) {
        if(i<20) {
            let d2 = {"match": 0, "score":0};
            d2.match = selectQuery.rows.item(i).match_num;
            d2.score = selectQuery.rows.item(i).score;
            scoreTable.push(d2);
        }
    }
    setTeamData(scoreTable); 
} // end getMatchData

  /* 
  ** Mainline 
  */ 

  //check to see if parent has passed a new parm 
  if(props.metric != metric) {
    setMetric(props.metric);
  }

  if(props.team != team) {
    setTeam(props.team);
  }

  if(metric != lastmetric || team != lastTeam) {
    setLastMetric(metric); 
    setLastTeam(team);
    getMatchData();
  }

  let data1= [];
  let matches = []; 
  let data2 = [];

  for (let i = 0; i < teamdata.length; i++) {
      data1.push(teamdata[i].score);
      matches.push(teamdata[i].match);
  }

  //calculate trend line 
  let known_y = data1;
  let known_x = [];
  for(let i=0;i<data1.length;i++){
    known_x.push(i+1);
  }
  
  //call linear regression routine 
  let lr = linearRegression(known_y, known_x);
    //console.log("slope=",lr.slope);
    //console.log("intercept=",lr.intercept);
    //console.log("r2=",lr.r2);
  for(let i=0; i<data1.length;i++) {
    data2.push(lr.intercept + ((i+1) * lr.slope));
  }
   
//console.log("teamdata",teamdata);
//console.log("match:",matches);
//console.log("data1:",data1);
//console.log("data2:",data2);

let tickcount = matches.length+2;
const data = [
  {
    data: data1, 
    svg: {stroke: '#8800cc',strokeWidth:5},
  },
  {
    data: data2, 
    svg: {stroke: 'red',strokeWidth:3, strokeDasharray:'7,7'}
  },
]
    
  return (
    <View>
      <View style={{ flexDirection: 'row', height: 300, paddingVertical: 16 }}>

        <YAxis 
          data={data1}
          contentInset={{top:20, bottom:20}}
          svg={{
            fill: 'black',
            fontsize:12,
          }}
          formatLabel={(value) => value+'    '}
        />

        <LineChart 
         style={{ flex: 1 }}
         data={data}
         contentInset={{top:20, bottom:20, left:10, right:10}}
         gridMin={0}
         > 
         <Grid />
         <XAxis
                style={{ marginTop: 255, marginRight: -10, marginHorizontal: -0}}
                 data={matches}
                formatLabel={(value, index) => matches[index]}
                numberOfTicks={tickcount}
                contentInset={{left:10, right:-60}}
                labelStyle={{color: 'black'}}
                //svg={{rotation: 30}}
                // svg={{fontSize: 1024/55, fill: '#3A8F98'}}
                svg={{ fontSize: 12, fill: 'black' }}
                />
        </LineChart>

      </View>
    </View>
  )   //end return 

};


export default AnalyzeComponent;