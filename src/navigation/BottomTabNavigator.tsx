import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TopTabNavigator from './TopTabNavigator';
import SettingsScreen from '../screens/settings';
import LoveAlarmScreen from '../screens/loveAlarm';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Love Alarm') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Pairing') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
      })}
    >
      <Tab.Screen name="Love Alarm" component={LoveAlarmScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Pairing" component={TopTabNavigator} />
    </Tab.Navigator>
  );
}
