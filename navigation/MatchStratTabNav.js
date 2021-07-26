// ./navigation/MatchStratTabNav.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MatchStrategy from "../pages/MatchStrategy";
import TeamDetails from "../pages/TeamDetails";
import TeamTBA from "../pages/TeamTBA";
import AnalyzeDetails from "../pages/AnalyzeDetails";

const Tab = createBottomTabNavigator();

const MatchStratTabNav = () => {
  return (
    <Tab.Navigator >
      <Tab.Screen name="Summary" component={MatchStrategy} />
      <Tab.Screen name="Performance" component={AnalyzeDetails} />
      <Tab.Screen name="Team Details" component={TeamDetails} />
      <Tab.Screen name="Team TBA" component={TeamTBA} />
    </Tab.Navigator>
  );
};

export default MatchStratTabNav;