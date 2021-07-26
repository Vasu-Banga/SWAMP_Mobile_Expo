// ..components/AutonMotionSelect.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';
  import PickerSelect, { defaultStyles } from 'react-native-picker-select';

const AutonMotionSelect = (props) => {
    let [autonmotion, setautonmotion] = useState(0);
    
    //test to see if parent has passed a new drivetrain  
    if(props.autonmotion != autonmotion) {
        setautonmotion(props.autonmotion);
    };

    const updateautonmotion = (v) => {
        //console.log("Setting auton motion= ",v);
        setautonmotion(v);
        props.onChangeText(v);
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.TextHeading}>Motion:</Text>
            <PickerSelect 
                style={pickerSelectStyles}
                value={autonmotion}
                // onValueChange={(value) => console.log(value)}
                onValueChange={(value) =>
                    updateautonmotion(value)
                }
                items={[
                    { label: "Didn't Move", value: 0 },
                    { label: 'Towards Driver', value: 1 },
                    { label: 'Towards Trench', value: 2 },
                    { label: 'Towads Truss', value: 3 },
                    { label: 'Other', value: 4 },
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


export default AutonMotionSelect;