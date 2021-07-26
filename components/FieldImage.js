//  ./components/FieldImage
import React, { useEffect, useState } from "react";
import {StyleSheet, Dimensions } from "react-native";
import ImageMapper from './ImageMapper';
 
//calc field mapping locations based on screen size 
const CalcFieldMap = (width,height,flip) => {
  let x = [0,0,0,0];
  let y = [0,0,0,0];
  let w = [0,0,0,0];
  let h = [0,0,0,0];
  
  if(width<=height){
    if(flip) {
      //portrait mode - standard view 
      x[0] = width*.5443;
      y[0] = height*.3027;
      w[0] = width*.1120;
      h[0] = height*.0560;
    
      x[1] = width *.3855;
      y[1] = height * .2706;
      w[1] = width * .1862;
      h[1] = height * .1270;
    
      x[2] = width * .0521;
      y[2] = height * .3877;
      w[2] = width * .2344;
      h[2] = height * .0684;
    
      x[3] = width * .2930;
      y[3] = height * .0997;
      w[3] = width * .1524;
      h[3] = height * .1680;
    } else {
      //portrait mode - fliped view 
      x[0] = 63;
      y[0] = 123;
      w[0] = 70;
      h[0] = 60;
    
      x[1] = 133;
      y[1] = 88;
      w[1] = width * .1862;
      h[1] = height * .1270;
    
      x[2] = 350;
      y[2] = 25;
      w[2] = width * .2344;
      h[2] = height * .0684;
    
      x[3] = 232;
      y[3] = 220;
      w[3] = width * .1524;
      h[3] = height * .1680;
    }
  } else {
    if(flip) {
      //landscape mode - standard view 
      x[0] = width*.5469;
      y[0] = height*.4714;
      w[0] = width*.0864;
      h[0] = height*.08996;
    
      x[1] = width *.3868;
      y[1] = height * .4219;
      w[1] = width *.1602;
      h[1] = height * .1940;
    
      x[2] = width * .0518;
      y[2] = height * .6094;
      w[2] = width * .2471;
      h[2] = height * .1042;
    
      x[3] = width * .3040;
      y[3] = height * .1594;
      w[3] = width * .1309;
      h[3] = height * .2566;
    } else {
    //landscape mode - flipped view 
      x[0] = 123;
      y[0] = 145;
      w[0] = 80;
      h[0] = height*.08996;
    
      x[1] = 204;
      y[1] = 106;
      w[1] = width *.1602;
      h[1] = height * .1940;
    
      x[2] = 457;
      y[2] = 33;
      w[2] = width * .2471;
      h[2] = height * .1042;
    
      x[3] = 318;
      y[3] = 258;
      w[3] = width * .1309;
      h[3] = height * .2566;
    }
  }

  let FieldMapping = [
    {
      id: '0',
      name: 'Batter',
      shape: 'rectangle',
      width: w[0],
      height: h[0],
      x1: x[0],
      y1: y[0],
      prefill: 'blue',
      fill: 'blue'
    },
    {
      id: '1',
      name: 'Center',
      shape: 'rectangle',
      width: w[1],
      height: h[1],
      x1: x[1],
      y1: y[1],
      prefill: '#5692b9',
      fill: '#5692b9'
    },
    {
      id: '2',
      name: 'Trench',
      shape: 'rectangle',
      width: w[2],
      height: h[2],
      x1: x[2],
      y1: y[2],
      prefill: '#4184b0',
      fill: '#4184b0'
    },
    {
      id: '3',
      name: 'Field',
      shape: 'rectangle',
      width: w[3],
      height: h[3],
      x1: x[3],
      y1: y[3],
      prefill: '#708090',
      fill: '#708090'
    },
  ]
  return FieldMapping;
}

const FieldImage = (props) => { 
  //get screen width   
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  
  //Declare state variables
  const [flipField, setflipField] = useState(true);
  const [selectedAreaId, setSelectedAreaId] = useState(0);
  const [orientation, setOrientation] = useState("PORTRAIT");
  const [fieldWidth,setfieldWidth] = useState(width*.75);
  const [imageHeight, setimageHeight] = useState(height*.48);
  const [fieldMap, setfieldMap] = useState(CalcFieldMap(width,height,false));



  //if props request field flip set switch in state accordingly 
  if(flipField != props.flipField) {
    setflipField(props.flipField);
    setfieldMap(CalcFieldMap(width,height,flipField));
  }

  let imageFieldSource = ""; 
  if(flipField) {
    imageFieldSource = require('../images/FlipField.jpg');
  } else {
    imageFieldSource = require('../images/Field.jpg');
  }

  //Field Map Area Handler 
  const fieldMapAreaClickHandler = async (item, idx, event) => {
      setSelectedAreaId(item.id);
      props.onChangeText(item.name);
  };

  //Screen Orientation Handler 
  useEffect(() => { 
    Dimensions.addEventListener('change',({window:{width,height}}) => {
      if(width<height) {
          if(orientation != "PORTRAIT") {
            setOrientation("PORTRAIT");
            setfieldWidth(width*.75);
            setimageHeight(height*.48);
            setfieldMap(CalcFieldMap(width,height,!flipField));
          }  
      } else {
          if(orientation != "LANDSCAPE") {
            setOrientation("LANDSCAPE");
            setfieldWidth(width*.75);
            setimageHeight(height*.75);
            //let f1 = CalcFieldMap(width,height,!flipField);
            setfieldMap(CalcFieldMap(width,height,!flipField));
          }
      }
    });  // End Dimensions 
  });

  return (
    <ImageMapper
        imgHeight={imageHeight}
        imgWidth={fieldWidth}
        imgLeft={0}
        imgSource={imageFieldSource}
        imgMap={fieldMap}
        onPress={
        (item, idx, event) => 
            fieldMapAreaClickHandler(item, idx, event)
        }
        containerStyle={styles.field}
        selectedAreaId={selectedAreaId}
    />
  );
};
  
export default FieldImage;

const styles = StyleSheet.create({

    field: {
      position: 'relative',
      top: 5,
      bottom: 0, 
      right: 0,
      resizeMode: 'contain',
      marginTop:10,
      marginBottom:10,
    },
 
});