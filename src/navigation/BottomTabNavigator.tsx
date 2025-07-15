import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TopTabNavigator from './TopTabNavigator';
import MapScreen from '../screens/map';
import LoveAlarmScreen from '../screens/loveAlarm';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ route }: { route: any }) {
  const { user } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Love Alarm') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
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
      <Tab.Screen name="Love Alarm" component={LoveAlarmScreen} initialParams={{ user }} />
      <Tab.Screen name="Map" component={MapScreen} initialParams={{ user }} />
      <Tab.Screen name="Pairing" component={TopTabNavigator} initialParams={{ user }} />
    </Tab.Navigator>
  );
}
