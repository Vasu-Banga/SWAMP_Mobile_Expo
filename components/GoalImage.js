//  ./components/GoalImage

import React, { useEffect, useState } from "react";
import {StyleSheet, Dimensions } from "react-native";
import ImageMapper from './ImageMapper';

const GoalImage = (props) => {
  //get screen width   
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  //calc field mapping locations based on screen size 
  const CalcGoalMap = (width,height) => {
    let x = [0,0];
    let y = [0,0];
    let w = [0,0];
    let h = [0,0];

    if(width<=height){
      //portrait mode
      //TODO charge hardcoded positions to percent of height/width
      x[0]= 27;
      y[0] = 380;
      w[0] = 130;
      h[0] = 35; 

      x[1]= 57;
      y[1] = 58;
      w[1] = 20;
      h[1] = 20;  
    } else {
      //landscape mode 
      x[0]= 38;
      y[0] = 470;
      w[0] = 170;
      h[0] = 40;
  
      x[1]= 88;
      y[1] = 58;
      w[1] = 20;
      h[1] = 20; 
    }
  const GoalMapping = [
    {
      id: '0',
      name: 'Low',
      shape: 'rectangle',
      width: w[0],
      height: h[0],
      x1: x[0],
      y1: y[0],
      prefill: '#7fff00',
      fill: '#7fff00'
    },
    {
      id: '1',
      name: 'Outer',
      shape: 'circle',
      width: w[1],
      height: h[1],
      x1: x[1],
      y1: y[1],
      radius: 75,
      prefill: 'red',
      fill: 'red'
    },
  ]

  return GoalMapping;
  }

  let gm = CalcGoalMap(width,height);

  //Declare state variables
  const [selectedGoalAreaId, setSelectedGoalAreaId] = useState(0);
  const [goalPosition, setgoalPosition] = useState([]);
  const [orientation, setOrientation] = useState("PORTRAIT");
  const [goalWidth,setgoalWidth] = useState(width*.25);
  const [imageHeight, setimageHeight] = useState(height*.48);
  
  const [goalMap, setgoalMap] = useState(gm);
  
  const imageGoalSource = require("../images/goal.jpg");

  //Goal Map Area Handler 
  const goalMapAreaClickHandler = async (item, idx, event) => {
    setSelectedGoalAreaId(item.id);
    props.onChangeText(item.name);
    //setgoalPosition(item.name);
  
  };

  //Screen Orientation Handler 
  useEffect(() => { 
    Dimensions.addEventListener('change',({window:{width,height}}) => {
      if(width<height) {
        if(orientation != "PORTRAIT") {
          setOrientation("PORTRAIT");
          setgoalWidth(width*.25);
          setimageHeight(height*.48);
          let g2 = CalcGoalMap(width,height);
          setgoalMap(g2);
        }  
      } else {
        if(orientation != "LANDSCAPE") {
          setOrientation("LANDSCAPE");
          setgoalWidth(width*.25);
          setimageHeight(height*.75);
          let g1 = CalcGoalMap(width,height);
          setgoalMap(g1);
        }
      }
    });
  });


  return (
    <ImageMapper
      imgHeight={imageHeight}
      imgWidth={goalWidth}
      imgLeft={10}
      imgSource={imageGoalSource}
      imgMap={goalMap}
      onPress={
          (item, idx, event) => 
          goalMapAreaClickHandler(item, idx, event)
      }
      containerStyle={styles.goal}
      selectedGoalAreaId={selectedGoalAreaId}
    />
  );
};

export default GoalImage;

const styles = StyleSheet.create({
  goal: {
    position: 'absolute',
    top: 5,
    bottom: 0,
    right: 0, 
    marginTop:10,
    resizeMode: 'contain',
    marginBottom:10,
  },
});