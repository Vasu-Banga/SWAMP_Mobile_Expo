//../components/RobotThumbnail.js

//note this does not work yet 
//images must be loaded statically using a require statement 
//as we do not know the filename of all images to create a static export 
//we can not have dynamic robot images 
//the exception is a URI which you can load dynamically 
//however this means that all the tablets have to be connect to the internet at all times 
// to be resolved later 

import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
  } from 'react-native';


  /**
* Execute sql queries
* 
* @param sql
* @param params
* 
* @returns {resolve} results
*/
ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
    global.db.transaction((trans) => {
    trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
    },
        (error) => {
            reject(error);
        });
    });
  });

const RobotThumbnail = (props) => {
    let [imagename, setImagename] = useState("../images/no_photo_available.jpg");
    let [team, setTeam] = useState(0);
    let [lastteam, setLastTeam] = useState(-1);
    let [refresh,setRefresh] = useState(-1);
    let [lastrefresh, setLastRefresh] =useState(-1);

    //test to see if parent has passed a new team number  
    if(props.team != team) {
        setTeam(props.team);
    };

    //if the team is the same but we want to refresh the image 
    //set the refresh counter up by 1 and you get a refresh  
    if(props.refresh != refresh) {
        setRefresh(props.refresh);
    };

    //get robot image uri from swamp database 
    const get_team_uri = async () => {
        let sql = "Select robot_uri from teams "; 
        sql += " Where team_num = ?; ";
        let uri = ""; 

        let selectQuery = await this.ExecuteQuery(sql, [team]);
        //test if any data was found 
        if(selectQuery.rows.length > 0) {
            //read sql data 
            for(let i=0;i<selectQuery.rows.length;i++) {
                uri = selectQuery.rows.item(i).robot_uri;
            }
            //console.log("URI FOUND in TEAMS==",uri);
        }
        if(uri==""||uri==null) {
              //if imagename blank force to no photo image 
              setImagename("../images/no_photo_available.jpg");
              //console.log("No Robot URI found for team=",team);
        }   else {
           // let x = "~/tmp/" + uri;
            setImagename(uri);
            //console.log("Setting URI found in DB");
            //console.log("URI Length",uri.length);
        }
   
    }

    //Mainline routine 
    if(team != lastteam) {
        get_team_uri();
        setLastTeam(team);
    }

    if(refresh != lastrefresh) {
        get_team_uri();
        setLastRefresh(refresh);
    }
     
   //console.log("Imagename=",imagename);
    if(imagename == "../images/no_photo_available.jpg") {
        return (
            <Image
                source={require('../images/no_photo_available.jpg')}
            />
        );          
    } else {
        return (
            <Image
                source={{uri: imagename}}
                resizeMode='contain'
                style={styles.imageBox}
        />
        );  
    }
};

export default RobotThumbnail;

const styles = StyleSheet.create({

  imagecontainer: {
    position: "absolute",
    marginLeft:10,
    marginTop:20,
    left: 440,
    width: 300,
    height: 300,
  }, 
  imageBox: {
    width: 256,
    height: 256
  }
  });