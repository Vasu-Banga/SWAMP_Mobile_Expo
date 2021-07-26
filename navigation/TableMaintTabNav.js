// ./navigation/TableMaintTabNav.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import TabEvent from "../pages/TabEvent";
import TabMatch from "../pages/TabMatch";
import TabTeam from "../pages/TabTeam";

const Tab = createBottomTabNavigator();

const TableMaintTabNav = () => {
  return (
    <Tab.Navigator >
        <Tab.Screen name="Events" component={TabEvent} />
        <Tab.Screen name="Teams" component={TabTeam} />
        <Tab.Screen name="Match Schedule" component={TabMatch} />
 
    </Tab.Navigator>
  );
};

export default TableMaintTabNav;