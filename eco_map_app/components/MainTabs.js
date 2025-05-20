import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import TesteScreen from '../screens/TesteScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
    
          if (route.name === 'Home') {
            iconName = 'map-outline';
          } else if (route.name === 'Account') {
            iconName = 'person-circle-outline';
          } else if (route.name === 'Teste') {
            iconName = 'ios-list';
          }
    
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#9c9a9a',
        tabBarStyle: { 
          position: 'absolute',
          height: 120,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: 'green',
          borderTopWidth: 1,
          borderTopColor: '#ccc', 
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 30,
        }
      })}
    >
      <Tab.Screen name="Teste" component={TesteScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}