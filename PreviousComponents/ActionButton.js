// ./screens/components/actionButton.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ActionButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={props.customClick}>
      <Text style={styles.text}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#f05555',  //red
   // backgroundColor: '#007200',  // green 
    
    color: '#ffffff',
    padding: 10,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
  },
  text: {
    fontSize: 24,
    fontWeight: "400",
    color: '#ffffff',
  },
});

export default ActionButton;