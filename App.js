import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import MatchScoutSetup from "./pages/MatchScoutSetup";
import MatchScoutTabNav from "./navigation/MatchScoutTabNav";
import PitScouting from "./pages/PitScouting";
import MatchStratTabNav from "./navigation/MatchStratTabNav";
import Picklist from "./pages/Picklist";
import AllianceSelection from "./pages/AllianceSelection";
import Utilities from "./pages/Utilities";
import Download from "./pages/Download";
import ImportFromWeb from "./pages/ImportFromWeb";
import DatabaseInit from "./pages/DatabaseInit";
import TBAUpdate from "./pages/TBAUpdate";
import UploadViaQR from "./pages/UploadViaQR";
import ReadQR from "./pages/ReadQR";
import AnalyzeTabNav from "./navigation/AnalyzeTabNav";
import AllianceInit from "./pages/AllianceInit";
import Settings from "./pages/Settings";
import UploadToWeb from "./pages/UploadToWeb";
import TableMaintTabNav from "./navigation/TableMaintTabNav";
import DatabaseStatus from "./pages/DatabaseStatus";
import Test from "./pages/Test";
import Test2 from "./pages/Test2";
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
          screenOptions={{
            headerStyle: {
              backgroundColor: "#007200",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}>
            <Stack.Screen 
            name="Home"
            component={HomePage}
            options={{ title: 'Home' }}
          />  
             <Stack.Screen 
            name="About"
            component={AboutPage}
            options={{ title: 'About' }}
          /> 
          <Stack.Screen 
            name="MatchScouting"
            component={MatchScoutSetup}
            options={{ title: 'Match Scouting' }}
          />
          <Stack.Screen 
            name="MatchScoutTabNav"
            component={MatchScoutTabNav}
            options={{ title: 'Match Scouting' }}
          /> 
           <Stack.Screen 
            name="PitScouting"
            component={PitScouting}
            options={{ title: 'Pit Scouting' }}
          />   
          <Stack.Screen 
            name="MatchStratTabNav"
            component={MatchStratTabNav}
            options={{ title: 'Match Strategy' }}
          />   
          <Stack.Screen 
            name="Picklist"
            component={Picklist}
            options={{ title: 'Pick List' }}
          />   
           <Stack.Screen 
            name="AllianceSelection"
            component={AllianceSelection}
            options={{ title: 'Alliance Selection' }}
          />   
            <Stack.Screen 
            name="Utilities"
            component={Utilities}
            options={{ title: 'Utilities' }}
          />   
           <Stack.Screen 
            name="Download"
            component={Download}
            options={{ title: 'Download' }}
          />   
           <Stack.Screen 
            name="ImportFromWeb"
            component={ImportFromWeb}
            options={{ title: 'Import' }}
          />   
          <Stack.Screen 
            name="DatabaseInit"
            component={DatabaseInit}
            options={{ title: 'Initialize Database' }}
          />    
           <Stack.Screen 
            name="TBAUpdate"
            component={TBAUpdate}
            options={{ title: 'TBA Update' }}
          />    
           <Stack.Screen 
            name="UploadViaQR"
            component={UploadViaQR}
            options={{ title: 'Upload via QR Code' }}
          />    
            <Stack.Screen 
            name="ReadQR"
            component={ReadQR}
            options={{ title: 'Read QR via Camera' }}
            />
             <Stack.Screen 
            name="AnalyzeTabNav"
            component={AnalyzeTabNav}
            options={{ title: 'Analyze' }}
          />    
            <Stack.Screen 
            name="AllianceInit"
            component={AllianceInit}
            options={{ title: 'Alliance Initialize' }}
          />    
           <Stack.Screen 
            name="Settings"
            component={Settings}
            options={{ title: 'Settings' }}
          />    
            <Stack.Screen 
            name="UploadToWeb"
            component={UploadToWeb}
            options={{ title: 'Upload to Frog Force Website' }}
          />    
          <Stack.Screen 
            name="Test"
            component={Test}
            options={{ title: 'Test Page' }}
          />    
           <Stack.Screen 
            name="Test2"
            component={Test2}
            options={{ title: 'Test 2 Page' }}
          />  
          <Stack.Screen 
            name="TableMaintTabNav"
            component={TableMaintTabNav}
            options={{ title: 'Table Maintenance' }}
          />    
           <Stack.Screen 
            name="DatabaseStatus"
            component={DatabaseStatus}
            options={{ title: 'Database Status' }}
          />    
          </Stack.Navigator>
    </NavigationContainer>
  )

}

export default App;