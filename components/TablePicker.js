// ../components/TablePicker.js
//
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import { View} from "react-native";

const TablePicker = (props) => {  
  //set state variables 
  let [metric,setMetric] = useState(1);
  let [metricdata,setMetricData] = useState([
       {label:"Events",value:1}
      ,{label:"Teams",value:2}
      ,{label:"Match Schedule",value:3}
      ,{label:"Pit Scout",value:4}
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

export default TablePicker;
