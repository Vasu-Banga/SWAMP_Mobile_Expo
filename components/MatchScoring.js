import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';

const MatchScoring = (props) => {
    
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
        <Text 
          style={styles.texthead}>
          ----Goals---- 
        </Text>
        <Text 
          style={styles.textheadvalue}>
          &nbsp;
        </Text>
        <Text 
          style={styles.textheadright}>
          ---Shooting---
        </Text>

      </View>
      <View style={{flexDirection: 'row'}}>
        <Text 
          style={styles.text}>
          Position: 
        </Text>
        <Text 
          style={styles.textvalue}>
          {props.goalPosition}
        </Text>
        <Text 
          style={styles.textright}>
          Position:
        </Text>
        <Text 
          style={styles.textrightvalue}>
          {props.robotPosition}
        </Text>
      </View>

      <View style={{flexDirection: 'row'}}>
        <Text 
          style={styles.text}>
          Auton Low:
        </Text>
        <Text 
          style={styles.textvalue}>
           {props.lowGoals}
        </Text>
        <Text 
          style={styles.textright}>
          Batter:
        </Text>
        <Text 
          style={styles.textrightvalue}>
          {props.batterShot}
        </Text>
      </View>

      <View style={{flexDirection: 'row'}}>
        <Text 
          style={styles.text}>
          Auton Outer:
        </Text>
        <Text 
          style={styles.textvalue}>
          {props.outerGoals}
        </Text>
        <Text 
          style={styles.textright}>
          Center:
        </Text>
        <Text 
          style={styles.textrightvalue}>
          {props.centerShot}
        </Text>
      </View>

      <View style={{flexDirection: 'row'}}>
        <Text 
          style={styles.text}>
          Auton Inner:
        </Text>
        <Text 
          style={styles.textvalue}>
          {props.innerGoals}
        </Text>
        <Text 
          style={styles.textright}>
          Field:
        </Text>
        <Text 
          style={styles.textrightvalue}>
          {props.fieldShot}
        </Text>
      </View>

      <View style={{flexDirection: 'row'}}>
      <Text 
          style={styles.text}>
          &nbsp;
        </Text>
        <Text 
          style={styles.textvalue}>
          &nbsp;
        </Text>
        <Text 
          style={styles.textright}>
          Trench:
        </Text>
        <Text 
          style={styles.textrightvalue}>
          {props.trenchShot}
        </Text>
      </View>

      <View style={{flexDirection: 'row'}}>
        <Text 
          style={styles.textright}>
          Other:
        </Text>
        <Text 
          style={styles.textrightvalue}>
          {props.otherShot}
        </Text>
      </View>
    </View>
    );
};

const styles = StyleSheet.create({
 
    container: {
      position: 'absolute',
      top: 20,
      bottom: 0,
      left:0, 
      right: 0,
  
    },
    texthead: {
      position: 'absolute',
      left: 10,
      color: '#111825',
      fontSize: 30,
      marginTop: 5,
      marginLeft: 5,
      marginRight: 15,
      fontWeight: "600",
    },
    textheadvalue: {
      color: '#0880fd',
      fontSize: 30,
      marginTop: 5,
      marginLeft: 180,
      //marginRight: 35,
      fontWeight: "600",
    },
    textheadright: {
      position: "absolute",
      left: 130,
      color: '#111825',
      fontSize: 30,
      marginTop: 5,
      marginLeft: 100,
      marginRight: 15,
      fontWeight: "600",
    },
    text: {
      position: 'absolute',
      left: 10,
      color: '#111825',
      fontSize: 22,
      marginTop: 5,
      marginLeft: 5,
      marginRight: 15,
      fontWeight: "500",
    },
    textvalue: {
      color: '#0880fd',
      fontSize: 22,
      marginTop: 5,
      marginLeft: 160,
      fontWeight: "600",
    },
    textright: {
      position: "absolute",
      left: 130,
      color: '#111825',
      fontSize: 22,
      marginTop: 5,
      marginLeft: 100,
      marginRight: 15,
      fontWeight: "500",
    },
    textrightvalue: {
      position: "absolute",
      left: 330,
      color: '#0880fd',
      fontSize: 22,
      marginTop: 5,
      fontWeight: "600",
    },
  });
  


export default MatchScoring;