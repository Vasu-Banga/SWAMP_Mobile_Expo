//  ../components/ProgLangSelect.js

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';
  import PickerSelect, { defaultStyles } from 'react-native-picker-select';

const ProgLangSelect = (props) => {
    let [proglang, setProglang] = useState(0);
    
    //test to see if parent has passed a new proglang  
    if(props.proglang != proglang) {
        setProglang(props.proglang);
    };

    const updateproglang = (v) => {
        //console.log("Setting proglang = ",v);
        setProglang(v);
        props.onChangeText(v);
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.TextHeading}>Programming:</Text>
            <PickerSelect 
                style={pickerSelectStyles}
                value={proglang}
                // onValueChange={(value) => console.log(value)}
                onValueChange={(value) =>
                    updateproglang(value)
                }
                items={[
                    { label: 'Unknown', value: 0 },
                    { label: 'Java', value: 1 },
                    { label: 'C++', value: 2 },
                    { label: 'LabView', value: 3 },
                    { label: 'Python', value: 4 },
                    { label: 'Other', value: 5 },
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


export default ProgLangSelect;