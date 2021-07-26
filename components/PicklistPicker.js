// ../components/PicklistPicker.js
//
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import { View} from "react-native";

const PicklistPicker = (props) => {  
  //set state variables 
  let [metric,setMetric] = useState(1);
  let [metricdata,setMetricData] = useState([
      {label:"First Pick",value:1},
      {label:"Second Pick",value:2}
    ]);

  //updates when user selects change in picker 
  const updateMetric = (metric) => {
    //console.log("setting match=",match);
    setMetric(metric);
    props.onChangeText(metric);
}

  let data = metricdata;
       
  return (
    <View>
      <Picker
          selectedValue={metric}
          onValueChange={(itemValue, itemIndex) =>
              updateMetric(itemValue)
          }>{
              data.map( (v) => {
              return <Picker.Item label={v.label} value={v.value} key={v.value}/>
                  })
          }
      </Picker>
    </View>
  )   //end return 

};

export default PicklistPicker;
