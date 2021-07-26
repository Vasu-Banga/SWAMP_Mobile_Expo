// ./pages/ActivityIndicator.js

import React, {useState} from "react";
import { View, SafeAreaView, StyleSheet, Button, Text, ActivityIndicator} from "react-native";

const Spinner = (props) => {
    const [stopIndicator,setStopIndicator] = useState(true); 
    const [loading, setLoading] = useState(false);
    
    //test to see if parent has passed a new command 
    if(props.loading != loading) {
        setLoading(props.loading);
    };

  

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };
    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator
              //visibility of Overlay Loading Spinner
              visible={loading}
              //Text with the Spinner
              textContent={'Loading...'}
              //Text style of the Spinner Text
              textStyle={styles.spinnerTextStyle}
            />
          ) : (
            <>
              <Text style={{ textAlign: 'center', fontSize: 2 }}>
              &nbsp;
              </Text>
            </>
          )}
        </View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create ({
    container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       marginTop: 0
    },
    activityIndicator: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       height: 40
    }
 })

export default Spinner;