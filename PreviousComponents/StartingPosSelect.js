// ..components/StartingPosSelect.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';
  import PickerSelect, { defaultStyles } from 'react-native-picker-select';

const StartingPosSelect = (props) => {
    let [startingpos, setStartingpos] = useState(0);
    
    //test to see if parent has passed a new drivetrain  
    if(props.startingpos != startingpos) {
        setStartingpos(props.startingpos);
    };

    const updateStartingPos = (v) => {
        //console.log("Setting starting Position = ",v);
        setStartingpos(v);
        props.onChangeText(v);
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.TextHeading}>Start:</Text>
            <PickerSelect 
                style={pickerSelectStyles}
                value={startingpos}
                // onValueChange={(value) => console.log(value)}
                onValueChange={(value) =>
                    updateStartingPos(value)
                }
                items={[
                    { label: 'Unknown', value: 0 },
                    { label: 'Left', value: 1 },
                    { label: 'Center', value: 2 },
                    { label: 'Right', value: 3 },
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


export default StartingPosSelect;