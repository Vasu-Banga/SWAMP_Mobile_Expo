// ./components/EventTBAPicker.js
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

//TBA Token 
const gblToken = "AmlQfa3QBCCadNWB4synlSoHpN3Rby971VVRCUOGlDXS2daf8p5zJV8MtWIdnjld";
const gblServer = "https://www.thebluealliance.com/api/v3/";

const EventTBAPicker = (props) => {  
  //set state variables 
  let [event,setEvent] = useState(0);
  let [lastevent,setLastEvent] = useState(-1);
  let [eventdata,setEventdata]=useState([{label: "", value:0, key: 0}]);

  // runs after the first render lifecycle - generally 1 time only 
  const getEvents = async () => {
    //get only the events that team 503 is signed up for 
    axios.get(gblServer + "team/frc503/events/2020", {
      headers: {
        'X-TBA-Auth-Key': gblToken,
        'User-Agent': 'Request'
      },
      json: true
    })
    .then(response => {
        let d1 = [];
        for(var i=0;i<response.data.length;i++) {
          let d2 = {label: "test", value: '', key:0};
          let n = response.data[i].name;
          let fixedn = n.replace("(Cancelled)","");
          //key is the year plus the event code-this is the event key for TBA
          d2.value = response.data[i].key;
          d2.key = i+1;
          //label is the text displayed in the dropdown-event_name 
          d2.label =  fixedn;
          d1.push(d2);
        }
        setEventdata(d1);
    });
  } // end getEvents


  //fires when user changes picker 
  const updateEvent = (event) => {
    setEvent(event);
    props.onChangeText(event);
  }

  if(event != lastevent) {
    getEvents();
    setLastEvent(event);
  }

  let data = eventdata;

  return (
    <Picker 
        selectedValue={event}
        onValueChange={(itemValue, itemIndex) =>
            updateEvent(itemValue)
        }>{
            data.map( (v) => {
                return <Picker.Item label={v.label} value={v.value} key={v.key}/>
            })
        }
    </Picker>
  )  // end return   

};
export default EventTBAPicker;

const styles = StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    TextHeading: {
      marginTop: 10,
      marginBottom: 0,
      fontSize: 28,
      fontWeight: "500",
      color: "blue",
    },
 
  });