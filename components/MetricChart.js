// ../components/MetricChart.js

import React, {useState} from 'react';
import { View } from 'react-native'
import { BarChart, Grid, XAxis } from 'react-native-svg-charts'
import { Text } from 'react-native-svg';
import * as scale from 'd3-scale';

const MetricChart = (props) => {  
  //set state variables 
  let [metric,setMetric] = useState("1");
  let [lastmetric,setLastMetric] = useState(0);
  let [teamdata,setTeamData] = useState([{"team": 0, "score":0}]);
 

  const getMatchData = async() => {
    /*
    ** Go read MatchScouting table from SWAMP database  
    */      
    let sql1 = "";
    switch(metric) {
        case 1:     //best auton 
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", sum(ms.auton_motion_completed * 5) + sum(ms.auton_balls_low * 2)";
            sql1 += "+ sum(ms.auton_balls_outer * 4) + sum(ms.auton_balls_inner * 6) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
            break;
        case 2:     //best teleop 
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", sum(ms.tele_balls_low * 1)";
            sql1 += "+ sum(ms.tele_balls_outer * 2) + sum(ms.tele_balls_inner * 3) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
        case 3:     //best color wheel 
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", sum(ms.rotation_completed * 10)";
            sql1 += "+ sum(ms.position_completed * 20) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
        case 4:     //best climb
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", count(*) * 5 as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += " and ms.climb_completed > 0 "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
        case 5:     //best zone defense
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", count(*) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += " and ms.defense = 1 "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
            sql1 += "order by score desc;"
        case 6:     //best target defense
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", count(*) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += " and ms.defense = 2 "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
        case 7:     //best overall score - TO DO COMPLETE THIS 
            sql1 += "SELECT 0 as event_id, 0 as team_num,'' as team_name";
            sql1 += ", 0 as score ";
            sql1 += "FROM match_scouting ";
            sql1 += "Where ms.event_id = ? ;"
        case 8:     //best low goal score 
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", sum(ms.auton_balls_low * 2)";
            sql1 += "+ sum(ms.tele_balls_low * 1) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
        case 9:     //best High goal score 
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", sum(ms.auton_balls_outer * 4) + sum(ms.auton_balls_inner * 6)";
            sql1 += "+ sum(ms.tele_balls_outer * 4) + sum(ms.tele_balls_inner * 3) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
        case 10:     //best Inner goal score 
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", sum(ms.auton_balls_inner * 6) + sum(ms.tele_balls_inner * 3) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
        case 12:     //TBA CCWMS 
            sql1 += "SELECT event_id, team_num,calc_value as score ";
            sql1 += "FROM TBA_OPRS ";
            sql1 += "Where event_id = ? and type = 0 ";
            sql1 += "order by calc_value desc;"
        case 13:     //TBA DPRS 
            sql1 += "SELECT event_id, team_num,calc_value as score ";
            sql1 += "FROM TBA_OPRS ";
            sql1 += "Where event_id = ? and type = 1 ";
            sql1 += "order by calc_value desc;"
        case 14:     //TBA OPRS 
            sql1 += "SELECT event_id, team_num,calc_value as score ";
            sql1 += "FROM TBA_OPRS ";
            sql1 += "Where event_id = ? and type = 2 ";
            sql1 += "order by calc_value desc;"
        default:    //best teleop 
            sql1 += "SELECT ms.event_id, ms.team_num,t.team_name"
            sql1 += ", sum(ms.tele_balls_low * 1)";
            sql1 += "+ sum(ms.tele_balls_outer * 2) + sum(ms.tele_balls_inner * 3) as score ";
            sql1 += "FROM match_scouting as ms left outer join teams as t on ms.team_num = t.team_num ";
            sql1 += "Where ms.event_id = ? "
            sql1 += "group by ms.event_id, ms.team_num, t.team_name ";
            sql1 += "order by score desc;"
    }

    let selectQuery = await ExecuteQuery(sql1,[12]);

    let scoreTable = [];

    for (let i = 0; i < selectQuery.rows.length; i++) {
        if(i<20) {
            let d2 = {"team": 0, "score":0};
            d2.team = selectQuery.rows.item(i).team_num;
            if(metric == 12 || metric == 13 || metric == 14) {
                let s1 = Math.round(selectQuery.rows.item(i).score * 10) / 10;
                d2.score = s1;
            } else {
                d2.score = selectQuery.rows.item(i).score;
            }
            scoreTable.push(d2);
        }
    }

    //console.log("Metric=",metric);
    //console.log("Scoretable=",scoreTable);
    setTeamData(scoreTable); 
} // end getMatchData

  /* 
  ** Mainline 
  */ 

  //check to see if parent has passed a new parm 
  if(props.metric != metric) {
    setMetric(props.metric);
  }

  if(metric != lastmetric) {
    setLastMetric(metric); 
    getMatchData();
  }

  let data = [];
  let teams = []; 

  for (let i = 0; i < teamdata.length; i++) {
      data.push(teamdata[i].score);
      teams.push(teamdata[i].team);
  }

  //put out the value on top of each bar 
  const CUT_OFF = 20
  const Labels = ({ x, y, bandwidth, data }) => (
      data.map((value, index) => (
          <Text
              key={ index }
              x={ x(index) + (bandwidth / 2) }
              y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
              fontSize={ 14 }
              fill={ value >= CUT_OFF ? 'white' : 'black' }
              alignmentBaseline={ 'middle' }
              textAnchor={ 'middle' }
          >
              {value}
          </Text>
      ))
  )     


  return (
    <View>
      <View style={{ flexDirection: 'row', height: 300, paddingVertical: 16 }}>
        <BarChart
            style={{ flex: 1 }}
            data={data}
            svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
            contentInset={{ top: 10, bottom: 20 }}
            spacing={0.2} 
            gridMin={0}
        >
            <Grid direction={Grid.Direction.HORIZONTAL}/>
            <Labels/>

            <XAxis
                style={{ marginTop: 250}}
                data={data}
                formatLabel={(value, index) => teams[index]}
                contentInset={{ left: 18, right: 18 }}
                svg={{ fontSize: 13, fill: '#000000' }}/>
        </BarChart>
                
      </View>
    </View>
  )   //end return 

};

export default MetricChart;