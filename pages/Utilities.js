// ./pages/Utilities.js

import React from "react";
import { View, Button, Text, StyleSheet,KeyboardAvoidingView } from "react-native";
import MenuButton from "../components/MenuButton";
import PageFooter from "../components/PageFooter";

const Utilities = ({ navigation }) => {
  
  const GotoDownload = () => {
  navigation.navigate("Download");
  }

  const GotoImportFromWeb = () => {
    navigation.navigate("ImportFromWeb");
  }

  const GotoDatabaseInit = () => {
    navigation.navigate("DatabaseInit");
  }

  const GotoTBAUpdate = () => {
    navigation.navigate("TBAUpdate");
  }

  const GotoUploadViaQR = () => {
    navigation.navigate("UploadViaQR");
  }

  const GotoUploadViaWeb = () => {
    navigation.navigate("UploadToWeb");
  }

  const GotoReadQR = () => {
    navigation.navigate("ReadQR");
  }

  const GotoInitAlliance = () => {
    navigation.navigate("AllianceInit");
  }

  const GotoTableMaint = () => {
    navigation.navigate("TableMaintTabNav");
  }

  const GotoDatabaseStatus = () => {
    navigation.navigate("DatabaseStatus");
  }

  return (

    <View style={{flex:1, backgroundColor: 'white'}} >
      <KeyboardAvoidingView 
        behavior="padding"
        style={{flex:1, justifyContent: "space-between"}} 
      >
          <View>
            <View style={styles.Newsbox}>
              <Text style={styles.TextHeading}>
                Select the Utility you would like to run:
              </Text>
            </View> 

            <View style={styles.Menubox}>
              <MenuButton title="Initialize Empty Database" customClick={GotoDatabaseInit}  />
              <MenuButton title="Download (Events, Teams, Match Schedule) from TBA" customClick={GotoDownload}  />
              <MenuButton title="Import Scouting Observations from FF Website" customClick={GotoImportFromWeb} />
              <MenuButton title="Get Updates from TBA as Event Progresses (Scores, Rankings, OPRS)" customClick={GotoTBAUpdate} />
              <MenuButton title="Upload Scouting Observations via QR Code" customClick={GotoUploadViaQR} />
              <MenuButton title="Upload Scouting Observations to FF Website" customClick={GotoUploadViaWeb} />
              <MenuButton title="Read QR Code using Camera (Load data into database)" customClick={GotoReadQR} />
              <MenuButton title="Initialize Alliance Selection Tables" customClick={GotoInitAlliance} />
              <MenuButton title="Table Maintenance" customClick={GotoTableMaint} />
              <MenuButton title="Database Status" customClick={GotoDatabaseStatus} />
            </View>
          </View>
        </KeyboardAvoidingView> 

        <PageFooter></PageFooter>
    </View>

  );
};

const styles = StyleSheet.create({
  Newsbox: {
   // flex: 1,
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
     position: "relative",
     marginTop: 50,
   },
});

export default Utilities;