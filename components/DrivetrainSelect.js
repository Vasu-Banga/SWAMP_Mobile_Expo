import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';
  import PickerSelect, { defaultStyles } from 'react-native-picker-select';

const DrivetrainSelect = (props) => {
    let [drivetrain, setDrivetrain] = useState(0);
    
    //test to see if parent has passed a new drivetrain  
    if(props.drivetrain != drivetrain) {
        setDrivetrain(props.drivetrain);
    };

    const updateDrivetrain = (v) => {
        //console.log("Setting drivetrain = ",v);
        setDrivetrain(v);
        props.onChangeText(v);
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.TextHeading}>Drivetrain:</Text>
            <PickerSelect 
                style={pickerSelectStyles}
                value={drivetrain}
                // onValueChange={(value) => console.log(value)}
                onValueChange={(value) =>
                    updateDrivetrain(value)
                }
                items={[
                    { label: 'Unknown', value: 0 },
                    { label: 'Tank', value: 1 },
                    { label: 'Meccanum', value: 2 },
                    { label: 'Swerve', value: 3 },
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
      marginLeft:20,
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


export default DrivetrainSelect;