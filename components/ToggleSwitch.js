import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

const ToggleSwitch = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  //const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  //updates when user changes the button 
  updateSwitch = () => {
    let sw = !props.value; 
    //console.log("Toggling switch ...",sw);
    //return updated value to parent 
    props.onChangeText(sw);
}

  return (
    <View
        style={{
          flexDirection: 'row'
        }}>
      
      <Text
          style={props.headstyle}
        >
          {props.heading}
        </Text>    
        <View  style={styles.container}>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            // onValueChange={toggleSwitch}
            onValueChange={updateSwitch}
            //value={isEnabled}
            value={props.value}
          />

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    paddingTop:20
  }
});

export default ToggleSwitch;