// ./navigation/MatchScoutTabNav.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//import { MainStackNavigator,MatchScoutingStackNavigator } from "./StackNavigator";
import MatchScoutSetup from "../pages/MatchScoutSetup";
import Auton from "../pages/Auton";
import Teleop from "../pages/Teleop";
import Endgame from "../pages/Endgame";
import Submit from "../pages/Submit";

const Tab = createBottomTabNavigator();

const MatchScoutTabNav = (navigation) => {
  return (
      <Tab.Navigator >
        <Tab.Screen name="Setup" component={MatchScoutSetup} />
        <Tab.Screen name="Auton" component={Auton} />
        <Tab.Screen name="Teleop" component={Teleop} />
        <Tab.Screen name="Endgame" component={Endgame} />
        <Tab.Screen name="Submit" component={Submit} /> 
      </Tab.Navigator>
  );
};

export default MatchScoutTabNav;