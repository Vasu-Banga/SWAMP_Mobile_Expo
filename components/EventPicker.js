// ../components/EventPicker.js
//
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import { View} from "react-native";

const EventPicker = (props) => {  
  //set state variables 
  let [event,setEvent] = useState(0);
  let [firsttime, setFirstTime] = useState(true);
  let [eventdata,setEventData] = useState([{label: "Event Name", value:0}]);
  let [lastreload,setLastReload] = useState(0); 

    /*
    ** Go read Event table from SWAMP database  
    */     
    const getEvents = async() => {
        let sql1 = "SELECT event_id, event_key, event_name ";
        sql1 += "FROM Events order by event_id; ";

        let selectQuery = await this.ExecuteQuery(sql1,[]);
        let d1 = [];
        let d2 = {label: "", value: 0}; 
        let firstEvent = 0;
        for (let i = 0; i < selectQuery.rows.length; i++) {
            d2 = {label: "", value: 0, key: 0}; 
            d2.label = selectQuery.rows.item(i).event_id + "-" + selectQuery.rows.item(i).event_name;
            d2.value = selectQuery.rows.item(i).event_id;
            d1.push(d2);
            //save the event key in picker 
            if(firstEvent == 0) {
                firstEvent = selectQuery.rows.item(i).event_id;
            }
        }

        setEventData(d1);

        //force selection to first event in list
        updateEvent(firstEvent);
    }  // end getEvents

    //updates when user selects change in picker 
    const updateEvent = (event) => {
        //console.log("setting event=",event);
        setEvent(event);
        props.onChangeText(event);
    }

  //the reload property is used to force the picker to reload
  //to use just increment reload 
  if(props.reload != lastreload) {
    setLastReload(props.reload);
    setFirstTime(true);
  }

  if(firsttime) {
    getEvents();
    setFirstTime(false);
  }

  let data = eventdata;
   
  return (
    <View>
      <Picker
          selectedValue={event}
          onValueChange={(itemValue, itemIndex) =>
              updateEvent(itemValue)
          }>{
              data.map( (v) => {
              return <Picker.Item label={v.label} value={v.value} key={v.value}/>
                  })
          }
      </Picker>
    </View>
  )   //end return 

};

export default EventPicker;