//    ../components/ScoutPicker.js

import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import { View} from "react-native";

const ScoutPicker = (props) => {  
  //set state variables 
  let [scout,setScout] = useState("Scout1");
  let [scoutdata,setScoutData] = useState([
       {label:"Scout 1",value:"Scout1"}
      ,{label:"Scout 2",value:"Scout2"}
      ,{label:"Scout 3",value:"Scout3"}
      ,{label:"Scout 4",value:"Scout4"}
      ,{label:"Scout 5",value:"Scout5"}
      ,{label:"Scout 6",value:"Scout6"}
    ]);

  //updates when user selects change in picker 
  const updateScout = (scout) => {
    //console.log("setting scout=",scout);
    setScout(scout);
    props.onChangeText(scout);
}

  let data = scoutdata;
       
  return (
    <View>
      <Picker
          selectedValue={scout}
          onValueChange={(itemValue, itemIndex) =>
              updateScout(itemValue)
          }>{
              data.map( (v) => {
              return <Picker.Item label={v.label} value={v.value} key={v.value}/>
                  })
          }
      </Picker>
    </View>
  )   //end return 

};

export default ScoutPicker;