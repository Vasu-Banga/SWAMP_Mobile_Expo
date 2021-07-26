// ./navigation/AnalyzeTabNav.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Analyze from "../pages/Analyze";
import AnalyzeDetails from "../pages/AnalyzeDetails";
import TeamDetails from "../pages/TeamDetails";
import TeamTBA from "../pages/TeamTBA";

// import TeamTBA from "../pages/TeamTBA";

const Tab = createBottomTabNavigator();

const AnalyzeTabNav = () => {
  return (
    <Tab.Navigator >
      <Tab.Screen name="All Teams Summary" component={Analyze} />
      <Tab.Screen name="Team Performance" component={AnalyzeDetails} />
      <Tab.Screen name="Team Details" component={TeamDetails} />
      <Tab.Screen name="Team TBA" component={TeamTBA} />
    </Tab.Navigator>
  );
};

export default AnalyzeTabNav;