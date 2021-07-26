import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AboutPage from "./pages/About";
import MatchScoutSetup from "./pages/MatchScoutSetup";
import MatchScoutTabNav from "./navigation/MatchScoutTabNav";
import PitScouting from "./pages/PitScouting";
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
          </Stack.Navigator>
    </NavigationContainer>
  )

}

export default App;