// ..components/TeamSelect.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';
  import PickerSelect, { defaultStyles } from 'react-native-picker-select';


const TeamSelect = (props) => {
    let [team, setTeam] = useState(0);
    let [firsttime, setFirstTime] = useState(true);
    let [teamdata,setTeamData] = useState([{label: "Team Name", value:0}]);

    
    //test to see if parent has passed a new team 
    if(props.team != team) {
        setTeam(props.team);
    };

    const updateTeam = (v) => {
        //console.log("Setting team= ",v);
        setTeam(v);
        props.onChangeText(v);
    }

    /*
    ** Go read Team table from SWAMP database  
    */     
    const getTeams = async() => {
        let sql1 = "SELECT team_num, team_name ";
        sql1 += "FROM Teams order by team_num; ";

        let selectQuery = await this.ExecuteQuery(sql1,[]);
        let d1 = [];
        let d2 = {label: "", value: 0}; 
        let firstTeam = 0;
        for (let i = 0; i < selectQuery.rows.length; i++) {
            d2 = {label: "", value: 0, key: 0}; 
            d2.label = selectQuery.rows.item(i).team_num + "-" + selectQuery.rows.item(i).team_name;
            d2.value = selectQuery.rows.item(i).team_num;
            d1.push(d2);
            //save the first team number in picker 
            if(firstTeam == 0) {
                firstTeam = selectQuery.rows.item(i).team_num;
            }
        }

        setTeamData(d1);

        //force selection to first team in list
        updateTeam(firstTeam);
    }  // end getTeams



    if(firsttime) {
        getTeams();
        setFirstTime(false);
    }

    let data = teamdata;

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.TextHeading}>Select Team:</Text>
            <PickerSelect 
                style={pickerSelectStyles}
                value={team}
                onValueChange={(value) =>
                    updateTeam(value)
                }
                   items={data}
                // items={[
                //     { label: "Didn't Attempt", value: 1 },
                //     { label: 'Attempted', value: 2 },
                //     { label: 'Completed', value: 3 },
                // ]}
            />
        </View>
    );
};

const pickerSelectStyles = StyleSheet.create({
inputIOS: {
    fontSize: 20,
    fontWeight: "400",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    marginLeft:20,
    marginTop:10,
    paddingRight: 30, // to ensure the text is never behind the icon
},
inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
},
});


const styles = StyleSheet.create({
    TextHeading: {
      marginTop: 15,
      marginLeft: 5,
      fontSize: 24,
      color: 'green',
      fontWeight: "600",
      marginBottom: 0,
    },
    text: {
      marginTop: 0,
      fontSize: 18, 
      padding: 10,
  }
  });


export default TeamSelect;