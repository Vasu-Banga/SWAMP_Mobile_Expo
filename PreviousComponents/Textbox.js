// ../components/Textbox.js

import React from 'react';
import { View,TextInput, Text, StyleSheet } from 'react-native';

const Textbox = (props) => {
  return (
   <View
      style={{
            flexDirection: 'row'
      }}>
        
      <Text style={props.headstyle}>{props.heading}</Text>
      <View
        style={{
          marginLeft: 35,
          marginRight: 35,
          marginTop: 10,
          borderColor: '#007FFF',
          borderWidth: 1,
        }}>
      

        <TextInput
          selectTextOnFocus={true}
          clearTextOnFocus={true}
          //clearButtonMode="always"
          underlineColorAndroid="transparent"
          placeholder={props.placeholder}
          placeholderTextColor="#007FFF"
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          returnKeyType={props.returnKeyType}
          numberOfLines={props.numberOfLines}
          multiline={props.multiline}
          onSubmitEditing={props.onSubmitEditing}
          style={props.style}
          blurOnSubmit={false}
          value={props.value}  
        />
      </View>
    </View>
  );
};

export default Textbox;