import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PairingScreen from '../screens/pairing';
import ChatScreen from '../screens/chat';
import ProfileScreen from '../screens/ProfileScreen';
import { NavigatorScreenParams } from '@react-navigation/native';

export type TopTabParamList = {
  Pairing: { user: any };
  Chat: { user: any; chatroomId?: number };
  Profile: { user: any };
};

const Tab = createMaterialTopTabNavigator<TopTabParamList>();

export default function TopTabNavigator({ route }: { route: any }) {
  const { user } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen name="Pairing" component={PairingScreen} initialParams={{ user }} />
      <Tab.Screen name="Chat" component={ChatScreen} initialParams={{ user }} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ user }} />
    </Tab.Navigator>
  );
}
