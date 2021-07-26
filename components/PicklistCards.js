// ./components/PicklistCards.js

import React, { useState } from "react";
import { View, TouchableOpacity, Text,StyleSheet, Button} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";


//Picklist format 
const teamData = [
   //{key: 1, label:"Team 503",name: "Frog Force",rank: "1",record:"(12-0-0)"},
]

const PicklistCards = (props) => {
  const [data, setData] = useState(teamData);
  const [team, setTeam] = useState(0);
  const [firstTime, setFirstTime] = useState(0);
  const [picklist, setPicklist] = useState(1);
  const [action, setAction] = React.useState({id: 0,function: 0, picklist: 0, team:0});
  const [lastaction, setLastAction] = React.useState(-1);
  
  //test to see if parent has passed a new command 
  if(props.action != action) {
    setAction(props.action);
  };


  const handleAdd = async(t) => {
    /*
    ** Go read Team and Ranking Tables from SWAMP database  
    */   
    let teamno = t; 
    
    let d = data;
    //check to ensure team is not already in picklist 
      for(let i=0;i<d.length;i++) {
        if(d[i].key==teamno) {
          alert("Team already in Picklist!");
          return;
        }
      }

    let sql1 = "SELECT t.team_num, t.team_name, tr.rank, tr.won, tr.lost, tr.tie from Teams as t ";
    sql1 += " left outer join TBA_Rankings as tr on t.team_num = tr.team_num "; 
    sql1 += " Where t.team_num = ? ";
  
    let tn="";
    let rank="";
    let record=""; 
    try {
      let selectQuery = await this.ExecuteQuery(sql1,[teamno]);
  
      for(let i=0;i<selectQuery.rows.length;i++) {
        tn=selectQuery.rows.item(i).team_name;
        rank = selectQuery.rows.item(i).rank;
        record = "(" + selectQuery.rows.item(i).won + "-" + selectQuery.rows.item(i).lost + "-" + selectQuery.rows.item(i).tie + ")";
      }
    } catch (err) {
      alert("Team not Found!");
      return;
    }

    if(tn != "") {
      let key=teamno;
      let th="Team " + teamno;
      d.push({key: key, label: th, name: tn,rank: rank,record: record});
      setData(d);
    } else {
      alert("Team not Found!")
    }
    //this forces react to render the screen 
    setTeam(teamno);
  } // end getTeamData



  const handleSave = async (savepicklist) => {
    //go get the Frog Force Event Key for DB insert  
    let ffev = FindSettingsKey("FFEvent");

    //delete any existing data 
    ExecuteCommand("Delete from Picklist where event_ID > 0 and list_id = " + savepicklist+ ";");
    
    let d = data;
    let sqlInsert = "INSERT INTO Picklist(event_id, list_id, slot_id, team_num, team_name, rank,record,inalliance) VALUES "; 
    let parameters=[],qry="";
   
    //pass the current picklist and build insert commands 
    for(let i=0;i<d.length;i++) {
      qry += "(?,?,?,?,?,?,?,?)";
      parameters.push(ffev,savepicklist,i+1,parseInt(d[i].key),d[i].name,d[i].rank,d[i].record,0); 
      qry += ",";
    } // end for

    // If there is to anything to send to the database go do it!
    if (qry !="")  {  
      ExecuteQuery(sqlInsert + qry.slice(0,-1)+ ";",parameters);
    }  // end

    alert("Data Saved!");
  }

  const handleLoad = async (currpicklist) => {
    console.log("Loading from database, picklist=",currpicklist);
    let sql1 = "SELECT event_id,slot_id, team_num,team_name,rank,record from Picklist ";
    sql1 += " Where list_id = ? order by slot_id;";
    let d=[];

    try {
      let selectQuery = await this.ExecuteQuery(sql1,[currpicklist]);
      
      for(let i=0;i<selectQuery.rows.length;i++) {
        let d1 = {key: 1, label:"",name: "",rank: 0,record: ""};
        d1.key=selectQuery.rows.item(i).team_num; 
        d1.label="Team " +  selectQuery.rows.item(i).team_num; 
        d1.name=selectQuery.rows.item(i).team_name; 
        d1.rank=selectQuery.rows.item(i).rank;
        d1.record=selectQuery.rows.item(i).record;
        d.push(d1);
      }

      //put data into state
      setData(d);

    } catch (err) {
        alert("Error Getting Picklist!");
    }
  }

  const handleDelete = (delteam) => {
    // The user has pressed the "Delete" button
    let d = data;
    let d1 = [];   
    //find team in data to remove  
      for(let i=0;i<d.length;i++) {
        if(d[i].key != delteam) {
          d1.push(d[i]);
        }
      }
      setData(d1);
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 10,
          marginLeft: 10,
          marginRight: 10,
          height: 80,
         // width: 400,
          borderTopEndRadius: 10,
          borderTopLeftRadius:10, 
          borderTopRightRadius:10, 
          borderBottomLeftRadius: 10,
          borderBottomRightRadius:10, 
          backgroundColor: isActive ? "yellow" : colors.white,
        }}
        onLongPress={drag}
      >  
        <Text
          style={{
            fontWeight: "bold",
            color: colors.blurple,
            fontSize: 22, 
            marginTop:10,
            marginLeft:10,
          }}
        >
          {item.label} - {item.name}
        </Text> 
      
        <Text
          style={{
            fontWeight: "normal",
            color: colors.bay,
            fontSize: 16,  
            marginLeft: 14,
            marginTop: 14,
          }}
        >
          Rank: {item.rank}      Record (W-L-T): {item.record}
        </Text>
      </TouchableOpacity>
    );
  };

  //load the existing picklist table on the first time through   
   if(action.id != lastaction) {
      switch(action.function) {
        case 1:     //load picklist from database 
          handleLoad(action.picklist);
          break;
        case 2:     //add team to picklist 
          handleAdd(action.team);
          break;
        case 3:     //remove team from picklist 
          handleDelete(action.team);
          break;
        case 4:     //Save picklist 
          handleSave(action.picklist);
          break;
    }
     
     setLastAction(action.id);
   }

  return (
    <View style={{ flex: 1}}>
      <View height={600}>
        <DraggableFlatList 
          style={styles.picklist}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({ data }) => setData( data )}
        />
      </View>
  </View>
  );
}
 
export default PicklistCards;

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