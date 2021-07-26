// ./pages/Picklist.js

import React, { Component } from "react";
import { View, TouchableOpacity, Text,StyleSheet, Button} from "react-native";
import ActionButton from '../components/ActionButton';
import Dialog from "react-native-dialog";
import PicklistPicker from "../components/PicklistPicker";
import PicklistCards from "../components/PicklistCards";


const Picklist = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [visibleDelete, setVisibleDelete] = React.useState(false);
  const [team, setTeam] = React.useState(0);
  const [firstTime, setFirstTime] = React.useState(0);
  const [picklist, setPicklist] = React.useState(1);
  const [action, setAction] = React.useState({id: 0,function: 1, picklist: 0, team:0});
  const [lastpicklist, setLastPicklist] = React.useState(1);


  const showDialog = () => {
    setVisible(true);
  };

  const showDeleteDialog = () => {
    setVisibleDelete(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDeleteCancel = () => {
    setVisibleDelete(false);
  };

  const handleAdd = () => {
    // The user has pressed the "Add" button
    let t1=parseInt(team);
    let a1 = action.id + 1;
    setAction({id: a1,function: 2, picklist: picklist, team:t1});
    setVisible(false);
  };

  const handleDelete = () => {
    // The user has pressed the "Delete" button  
    let t1=parseInt(team);
    let a1 = action.id + 1;
    setAction({id: a1,function: 3, picklist: picklist, team:t1});
    setVisibleDelete(false);
  };

  const handleSave = () => {
    // The user has pressed the "Save" button  
    let a1 = action.id + 1;
    setAction({id: a1,function: 4, picklist: picklist, team:0});
  };



  //load the existing picklist table on the first time through   
  if(firstTime == 0) {
    setAction({id: 1,function: 1, picklist: picklist, team:0});
    setFirstTime(1);
  }

  if(picklist != lastpicklist) {
    let a1 = action.id + 1;
    setAction({id: a1,function: 1, picklist: picklist, team:0});
    setLastPicklist(picklist);
  }

  return (
    <View style={{ flex: 1}}>
      <Text style={styles.titleText}>Select Pick List to work on: </Text>   
      <PicklistPicker onChangeText={
            (picklist) => {
                setPicklist(picklist);
            }
        }
      />

      <Text style={styles.headText}>Change the team order of your Pick List</Text>   
      
      <PicklistCards action={action}>

      </PicklistCards>

      <View style={{flexDirection: 'row', justifyContent: "center",alignItems: "center", textAlign: "center"}}>
        <ActionButton 
            title="Add Team" customClick={showDialog} > 
        </ActionButton>
        <ActionButton 
            title="Remove Team" customClick={showDeleteDialog} > 
        </ActionButton>
        <ActionButton 
            title="Save Pick List" customClick={handleSave} > 
        </ActionButton>
      </View>

      <View style={styles.container}>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Add Team to Picklist</Dialog.Title>
          <Dialog.Input label="Team Number:" 
            onChangeText={(team) => {setTeam(team)}}>
          </Dialog.Input>
            <Dialog.Description>
            Please enter the team number
          </Dialog.Description>
        
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Add" onPress={handleAdd} />
        </Dialog.Container>

        <Dialog.Container visible={visibleDelete}>
          <Dialog.Title>Remove Team from Picklist</Dialog.Title>
          <Dialog.Input label="Team Number:" 
            onChangeText={(team) => {setTeam(team)}}>
          </Dialog.Input>
            <Dialog.Description>
            Please enter the team number
          </Dialog.Description>
        
          <Dialog.Button label="Cancel" onPress={handleDeleteCancel} />
          <Dialog.Button label="Delete" onPress={handleDelete} />
        </Dialog.Container>
    </View>

  </View>
  );
}
 
export default Picklist;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 22,
    marginTop: 0,
    marginBottom:0,
  },

  headText: {
    fontSize: 22,
    marginTop: 0,
    marginBottom:0,
  },
  picklist: {
    flex: 1,
    position: "relative",
  }
});

const colors = {
  bay: '#747d8c',
  black: '#000000',
  blurple: '#4834d4',
  deepComaru: '#30336b',
  exodusFruit: '#686de0',
  fallingStar: '#FAFAFA',
  officer: '#2C3A47',
  wildWatermelon: '#ff6b81',
  white: '#FFFFFF'
}