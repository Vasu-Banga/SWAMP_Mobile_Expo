// ../components/TeamPicker.js
//
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import { View} from "react-native";

const TeamPicker = (props) => {  
  //set state variables 
  let [team,setTeam] = useState(0);
  let [firsttime, setFirstTime] = useState(true);
  let [teamdata,setTeamData] = useState([{label: "Team Name", value:0}]);
  let [lastreload,setLastReload] = useState(0); 

  /*
  ** Go read Team table from SWAMP database  
  */     
  const getTeams = async() => {
    let sql1 = "SELECT team_num, team_name ";
    sql1 += "FROM Teams order by team_num; ";

    let selectQuery = await this.ExecuteQuery(sql1,[]);
    var rows = selectQuery.rows;
    let d1 = [];
    let d2 = {label: "", value: 0}; 
    let firstTeam = 0;
    for (let i = 0; i < rows.length; i++) {
        d2 = {label: "", value: 0, key: 0}; 
        d2.label = rows.item(i).team_num + "-" + rows.item(i).team_name;
        d2.value = rows.item(i).team_num;
        d1.push(d2);
        //save the first team number in picker 
        if(firstTeam == 0) {
            firstTeam = rows.item(i).team_num;
        }
    }

    setTeamData(d1);

    //force selection to first team in list
    updateTeam(firstTeam);
  }  // end getTeams

  //updates when user selects change in picker 
  const updateTeam = (team) => {
    //console.log("setting team=",team);
    setTeam(team);
    props.onChangeText(team);
  }

  //the reload property is used to force the picker to reload
  //to use just increment reload 
  if(props.reload != lastreload) {
    setLastReload(props.reload);
    setFirstTime(true);
  }

  if(firsttime) {
    getTeams();
    setFirstTime(false);
  }

  let data = teamdata;
   
  return (
    <View>
      <Picker
          selectedValue={team}
          onValueChange={(itemValue, itemIndex) =>
              updateTeam(itemValue)
          }>{
              data.map( (v) => {
              return <Picker.Item label={v.label} value={v.value} key={v.value}/>
                  })
          }
      </Picker>
    </View>
  )   //end return 

};

export default TeamPicker;