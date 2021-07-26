//  ../components/MetricPicker.js

import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import { View} from "react-native";

const MetricPicker = (props) => {  
  //set state variables 
  let [metric,setMetric] = useState(1);
  let [firsttime,setFirstTime] = useState(true);
  let [metricdata,setMetricData] = useState([
       {label:"Best Auton",value:1}
      ,{label:"Best Teleop",value:2}
      ,{label:"Best Color Wheel",value:3}
      ,{label:"Best Climb",value:4}
      ,{label:"Best Zone Defense",value:5}
      ,{label:"Best Target Defense",value:6}
      ,{label:"Best Overall Score (Future)",value:7}
      ,{label:"Best Low Goal Score",value:8}
      ,{label:"Best High Goal Score",value:9}
      ,{label:"Best Inner Goal Score",value:10}
      ,{label:"Best Batter Score",value:11}
      ,{label:"Best TBA-Contribution to Winning Margin (CCWMS)",value:12}
      ,{label:"Best TBA-DPRS",value:13}
      ,{label:"Best TBA-Offensive Power Rating(OPR)",value:14}
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

export default MetricPicker;