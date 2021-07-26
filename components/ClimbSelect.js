// ..components/ClimbSelect.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';
  import PickerSelect, { defaultStyles } from 'react-native-picker-select';

const ClimbSelect = (props) => {
    let [climb, setclimb] = useState(0);
    
    //test to see if parent has passed a new climb prop
    if(props.climb != climb) {
        setclimb(props.climb);
    };

    const updateclimb = (v) => {
        //console.log("Setting climb= ",v);
        setclimb(v);
        props.onChangeText(v);
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.TextHeading}>Climb:</Text>
            <PickerSelect 
                style={pickerSelectStyles}
                value={climb}
                // onValueChange={(value) => console.log(value)}
                onValueChange={(value) =>
                    updateclimb(value)
                }
                items={[
                    { label: 'Nothing', value: 0 },
                    { label: 'Parked', value: 1 },
                    { label: 'Climbed High Side', value: 2 },
                    { label: 'Climbed Low Side', value: 3 },
                    { label: 'Climbed Center', value: 4 },
                ]}
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


export default ClimbSelect;