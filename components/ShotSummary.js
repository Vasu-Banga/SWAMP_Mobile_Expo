// ..components/ShotSummary.js

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
  } from 'react-native';
import { 
    Table, 
    TableWrapper,
    Row, 
  } from 'react-native-table-component';

const ShotSummary = (props) => {
    let [scoredata, setScoredata] = useState([]);
    let [tableHead,setTableHead] = useState(['', 'Low', 'Outer', 'Inner', 'Total',' ','Batter','Center','Field','Trench','Other']);
    let [widthArr,setWidthArr] = useState([90, 65, 65, 65,65,30,70,70,70,70,70]);
    
    //test to see if parent has passed a new climb prop
    if(props.data != scoredata) {
        setScoredata(props.data);
    };

    let data = [];
    data = scoredata;

    return (
        <View>
        <Table borderStyle={{borderColor: '#C1C0B9'}}>
          <Row data={tableHead} widthArr={widthArr} style={styles.head} textStyle={styles.headtext}/>
        </Table>
        <ScrollView style={styles.dataWrapper}>
          <Table borderStyle={{borderColor: '#C1C0B9'}}>
            {
              data.map((data, index) => (
                <Row
                  key={index}
                  data={data}
                  widthArr={widthArr}
                  style={[styles.row, index%2 && {backgroundColor: '#ffffff'}]}
                  textStyle={styles.text}
                />
              ))
            }
          </Table>
        </ScrollView>
    </View>
    );
};

export default ShotSummary;

const styles = StyleSheet.create({
dataWrapper: { 
    marginTop: -1 
},
row: { 
    height: 25, 
    backgroundColor: '#F7F8FA' 
},
text: { 
    fontSize: 22,
    textAlign: 'center', 
    fontWeight: '500',
    color: '#0880fd',
    },
head: { 
    top:10,
    bottom:10,
    height: 45, 
    backgroundColor: '#C8CFEE', 
},
    headtext: { 
    textAlign: 'center', 
    fontSize: 20,
    fontWeight: '600' 
},

  });