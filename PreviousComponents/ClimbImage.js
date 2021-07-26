//  ./components/ClimbImage
import React, { useEffect, useState } from "react";
import {StyleSheet, Dimensions } from "react-native";
import ImageMapper from './ImageMapper';

//calc field mapping locations based on screen size 
const CalcFieldMap = (width,height,flip) => {
    let x = [0,0,0];
    let y = [0,0,0];
    let w = [0,0,0];
    let h = [0,0,0];
    
    if(width<=height){
      if(flip) {
        //portrait mode - standard view 
        x[0] = 550; //550
        y[0] = 0;
        w[0] = 100;
        h[0] = 135;

        x[1] = 550; //550
        y[1] = 135;
        w[1] = 100;
        h[1] = 135;

        x[2] = 660; //660
        y[2] = 90;
        w[2] = 90;
        h[2] = 90;
      
      } else {
         //portrait mode - fliped view
         x[0] = 550;
         y[0] = 0;
         w[0] = 90;
         h[0] = 90;

         x[1] = 550;
         y[1] = 135;
         w[1] = 100;
         h[1] = 135;

         x[2] = 660;
         y[2] = 90;
         w[2] = 90;
         h[2] = 90;
       
      }
    } else {
      if(flip) {
        //landscape mode - standard view 
        x[0] = 745;
        y[0] = 0;
        w[0] = 110;
        h[0] = 90;
      
        x[1] = 745;
        y[1] = 140;
        w[1] = 110;
        h[1] = 175;

        x[2] = 880;
        y[2] = 80;
        w[2] = 120;
        h[2] = 120;
      
      } else {
      //landscape mode - flipped view 
      x[0] = 745;
      y[0] = 0;
      w[0] = 100;
      h[0] = 130;
    
      x[1] = 745;
      y[1] = 140;
      w[1] = 110;
      h[1] = 175;

      x[2] = 880;
      y[2] = 80;
      w[2] = 120;
      h[2] = 120;
      
      }
    }
   
    let FieldMapping = [
      {
        id: '0',
        name: 'Bar Up',
        shape: 'rectangle',
        width: w[0],
        height: h[0],
        x1: x[0],
        y1: y[0],
        //prefill: '#cccccc',
        //fill: '#cccccc'
        //prefill: '#FFFF00',
        //fill: '#FFFF00'
      },
      {
        id: '1',
        name: 'Bar Down',
        shape: 'rectangle',
        width: w[1],
        height: h[1],
        x1: x[1],
        y1: y[1],
        //prefill: '#cccccc',   //grey
        //fill: '#cccccc'
        //prefill: '#FFFF00',  //yellow
        //fill: '#FFFF00'
      },
      {
        id: '2',
        name: 'Bar Level',
        shape: 'rectangle',
        width: w[2],
        height: h[2],
        x1: x[2],
        y1: y[2],
        //prefill: '#cccccc',
        //fill: '#cccccc'
        //prefill: '#FFFF00',
        //fill: '#FFFF00'
      },
    ]
    return FieldMapping;
}

const ClimbImage = (props) => { 
  //get screen width   
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  
  //Declare state variables
  const [flipField, setflipField] = useState(true);
  const [selectedAreaId, setSelectedAreaId] = useState(0);
  const [orientation, setOrientation] = useState("PORTRAIT");
  const [fieldWidth,setfieldWidth] = useState(width*1.0);
  const [imageHeight, setimageHeight] = useState(height*.48);
  const [fieldMap, setfieldMap] = useState(CalcFieldMap(width,height,false));
  const [imagename, setImageName] = useState(require("../images/endgame1.jpg"));
  const [lastimage, setLastimage] = useState(2);
  const [lastreset, setLastreset] = useState(0);

  //if props request field flip set switch in state accordingly 
  if(flipField != props.flipField) {
    setflipField(props.flipField);
    setfieldMap(CalcFieldMap(width,height,flipField));
  }

  //used to reset the bar image to level at a new match 
  if(props.reset != lastreset) {
    setImageName(require('../images/endgame1.jpg'));
    setLastimage(2); 
    setLastreset(props.reset);
  }

  const handle_barup_request = () => {
    //change the image based on button pressed and last state 
    let li = lastimage; 
    console.log("Bar up req. li=",li);
    switch(li) {
      case 0: //last image was up
        props.onChangeText("Bar Up"); 
        setLastimage(0); 
        break;
      case 1: // last image was down
        props.onChangeText("Level"); 
        setImageName(require('../images/endgame1.jpg'));
        setLastimage(2); 
        break;
      case 2: //last image was level 
        props.onChangeText("Bar Up"); 
        setImageName(require('../images/endgame2.jpg'));
        setLastimage(0); 
        break;
    }
  }

  const handle_bardown_request = () => {
    //change the image based on button pressed and last state 
    let li = lastimage; 
    switch(li) {
      case 0: //last image was up
        props.onChangeText("Level");
        setImageName(require('../images/endgame1.jpg'));
        setLastimage(2); 
        break;
      case 1: // last image was down
        props.onChangeText("Bar Down");
        setLastimage(1); 
        break;
      case 2: //last image was level 
        props.onChangeText("Bar Down"); 
        setImageName(require('../images/endgame3.jpg'));
        setLastimage(1); 
        break;
    }
  }

  //Field Map Area Handler 
  const fieldMapAreaClickHandler = async (item, idx, event) => {
      setSelectedAreaId(item.id);
      
      //item id is the button pressed 
      switch(item.id) {
        case "0":  // arrow up   
          handle_barup_request();
          break;
          
        case "1":  // arrow down
          handle_bardown_request();
          break;
      } 
    
    
  };

  //Screen Orientation Handler 
  useEffect(() => { 
    Dimensions.addEventListener('change',({window:{width,height}}) => {
      if(width<height) {
          if(orientation != "PORTRAIT") {
            setOrientation("PORTRAIT");
            setfieldWidth(width*1.0);
            setimageHeight(height*.48);
            setfieldMap(CalcFieldMap(width,height,!flipField));
          }  
      } else {
          if(orientation != "LANDSCAPE") {
            setOrientation("LANDSCAPE");
            setfieldWidth(width*1.0);
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
        imgSource={imagename}
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
  
export default ClimbImage;

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