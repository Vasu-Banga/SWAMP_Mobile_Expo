import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';

const MatchPicker = (props) => {  
  //set state variables 
  let [match,setMatch] = useState(1);
  let [firsttime,setFirstTime] = useState(true);
  let [matchdata,setMatchData] = useState([{label: "Match-1", value:1},{label:"Match-2",value:2},{label:"Match-3",value:3}]);
  let [lastreload,setLastReload] = useState(0); 


  const getMatchData = async() => {
    /*
    ** Go read Matches table from SWAMP database  
    */       
    let selectQuery = await ExecuteQuery("SELECT match_num FROM Matches",[]);

    let d1 = [];
    let firstMatch = 0;
    for (let i = 0; i < selectQuery.rows.length; i++) {
        let match = selectQuery.rows.item(i).match_num;
        let d2 = {label: "", value: 0}; 
        d2.label = "Match-"+match;
        d2.value = match;
        d1.push(d2);    
        //save the first match number in picker 
        if(firstMatch == 0) {
            firstMatch = selectQuery.rows.item(i).match_num;
        }
    }

    setMatchData(d1); 
    //force selection to first match in list
    updateMatch(firstMatch);

  } // end getMatchData

  //updates when user selects change in picker 
  const updateMatch = (match) => {
    //console.log("setting match=",match);
    setMatch(match);
    props.onChangeText(match);
}

  //the reload property is used to force the picker to reload
  //to use just increment 
  if(props.reload != lastreload) {
    setLastReload(props.reload);
    setFirstTime(true);
  }

  if(firsttime) {
    getMatchData();
    setFirstTime(false);
  }

  let data = matchdata;
       
  return (
    <Picker
        selectedValue={match}
        onValueChange={(itemValue, itemIndex) =>
            updateMatch(itemValue)
        }>{
            data.map( (v) => {
            return <Picker.Item label={v.label} value={v.value} key={v.value} />
                })
        }
    </Picker>
  )   //end return 

};

export default MatchPicker;
