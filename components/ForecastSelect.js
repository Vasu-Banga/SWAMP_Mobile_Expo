// ..components/ForecastSelect.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';
  import PickerSelect, { defaultStyles } from 'react-native-picker-select';

const ForecastSelect = (props) => {
    let [forecast, setforecast] = useState(0);
    
    //test to see if parent has passed a new forecast prop
    if(props.forecast != forecast) {
        setforecast(props.forecast);
    };

    const updateforecast = (v) => {
        //console.log("Setting forecast= ",v);
        setforecast(v);
        props.onChangeText(v);
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.TextHeading}>Forecast Metric: </Text>
            <PickerSelect 
                style={pickerSelectStyles}
                value={forecast}
                // onValueChange={(value) => console.log(value)}
                onValueChange={(value) =>
                    updateforecast(value)
                }
                items={[
                    { label: 'Best Match Played', value: 0 },
                    { label: 'Linear Regression Forecast', value: 1 },
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
      marginTop: 20,
      marginLeft: 25,
      fontSize: 20,
      color: 'red',
      fontWeight: "600",
      marginBottom: 0,
    },
    text: {
      marginTop: 0,
      fontSize: 18, 
      padding: 10,
  }
  });


export default ForecastSelect;