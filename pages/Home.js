// ./pages/Home.js

import React from "react";
import { View, Button, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import MenuButton from "../components/MenuButton";
import PageFooter from "../components/PageFooter";
import * as SQLite from 'expo-sqlite';

//Open the database once for all components 
global.db = SQLite.openDatabase(
  { name: 'Swamp.db' },
    () => { console.log("Database Opened")}, 
    error => {
      console.log("Database Open Error: "+ error);
    }
  );

/*************************************************
 * Define Global Functions that can be called by  
 * any component 
 **************************************************/

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
    console.log("Home:DB Query: " + sql.substring(0,30) + "--Completed!");
      resolve(results);
  },
      (error) => {
          reject(error);
      });
  });
});

/**
* Await promise return of sql queries
* 
* @param sql
* @param params
* 
* @returns {resolve} results
*/
ExecuteCommand = async(sql) => {
  try {
    let nonReturnQry = await ExecuteQuery(sql,[]);
    console.log("Home:DB Cmd: " + sql.substring(0,30) + "--Completed!");
  } catch(err) {
    console.log("Error in Settings:ExecuteCommand: "+ sql + " " + err.message);
  }
}

/** 
* Find value in global settings array for a given key
* 
* @param searchKey
* 
* @returns value of key 
*/
FindSettingsKey = (searchKey) => {
  let s = global.settings;
  let retval = "";
  for(var i=0;i<s.length;i++) {
    if(s[i].key == searchKey) {
      retval = s[i].value;
    }
  }
  return retval;
}


const Home = ({ navigation }) => {
 
  //load settings array from database 
  const loadSettings = async() => {
    console.log("Loading Global Settings from DB...");
    let sql1 = "Select key,val from Settings; ";
    let setarr = []; 
    let selectQuery = ExecuteQuery(sql1,[]);
    console.log(selectQuery.rows)
    for (let i = 0; i < selectQuery.rows.length; i++) {
      setarr.push({"key": selectQuery.rows.item(i).key,"value": selectQuery.rows.item(i).val});
    }
    //load a global variable for all pages to use 
    console.log("Global Settings Initializing...")
    global.settings = setarr;
    console.log("Global Settings Initialized")
    
  } 

  loadSettings();
  
  const GotoMatchScout = () => {
  navigation.navigate("MatchScoutTabNav");
  }

  const GotoAbout = () => {
    navigation.navigate("About");
  }

  const GotoPitScouting = () => {
    navigation.navigate("PitScouting");
  }

  const GotoMatchStrategy = () => {
  //  navigation.navigate("MatchStrategy");
    navigation.navigate("MatchStratTabNav");
  }

  const GotoPicklist = () => {
    navigation.navigate("Picklist");
  }

  const GotoAllianceSelection = () => {
    navigation.navigate("AllianceSelection");
  }

  const GotoUtilities = () => {
    navigation.navigate("Utilities");
  }

  const GotoAnalyze = () => {
    navigation.navigate("AnalyzeTabNav");
  }

  const GotoTest = () => {
    navigation.navigate("Test");
  }

  const GotoTest2 = () => {
    navigation.navigate("Test2");
  }

  const GotoSettings = () => {
    navigation.navigate("Settings");
  }

  return (
    <View style={{flex:1, backgroundColor: 'white'}} >
      <KeyboardAvoidingView 
        behavior="padding"
        style={{flex:1, justifyContent: "space-between"}} 
        >
          <View style={styles.Newsbox}>
            <Text style={styles.TextHeading}>
              Welcome the SWAMP Scouting !!!!(Mobile Version) 
            </Text>

            <Text style={styles.TextNormal}>
            
            </Text>
            <Text> &nbsp;</Text>
          </View> 

          <View style={styles.Menubox}>
            <MenuButton title="About" customClick={GotoAbout}  />
            <MenuButton title="Pit Scouting" customClick={GotoPitScouting} />
            <MenuButton title="Match Scouting" customClick={GotoMatchScout} />
            <MenuButton title="Match Strategy" customClick={GotoMatchStrategy} />
            <MenuButton title="Analyze Team Performance" customClick={GotoAnalyze} />
            <MenuButton title="Create Picklist" customClick={GotoPicklist} />
            <MenuButton title="Alliance Selection" customClick={GotoAllianceSelection} />
            <MenuButton title="Utilities" customClick={GotoUtilities} />
            <MenuButton title="Settings" customClick={GotoSettings} />
            <MenuButton title="Test" customClick={GotoTest} />
            <MenuButton title="Test 2" customClick={GotoTest2} />
          </View>
      </KeyboardAvoidingView> 

     <PageFooter></PageFooter>
    </View>

  );
};

const styles = StyleSheet.create({
  Newsbox: {
    marginTop: 20,
    marginLeft:20,
    marginRight:20,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderColor: "#007200",
    borderWidth: 2,
  },
  TextHeading: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 20,
  },
  TextNormal: {
    fontSize: 20,
    fontWeight: "300",
    textAlign: "left",
  },
  Menubox: {
     marginBottom: 250,
  },
});

export default Home;