import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import InfoScreen from '../screens/InfoScreen';
import ViewPointsScreen from '../screens/ViewPointsScreen';

const Tab = createBottomTabNavigator();

const screenIcons = {
  Informações: { focused: 'information-circle', unfocused: 'information-circle-outline' },
  Home: { focused: 'map', unfocused: 'map-outline' },
  'Meus Pontos': { focused: 'location', unfocused: 'location-outline'},
  Conta: { focused: 'person-circle', unfocused: 'person-circle-outline' },
};

export default function MainTabs() {
  const { bottom: safeAreaBottom } = useSafeAreaInsets(); 

  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#C8E6C9', 
        tabBarStyle: {
          backgroundColor: '#256D5B',
          borderTopWidth: 0,
          height: 60 + safeAreaBottom,
          paddingBottom: safeAreaBottom, 
          paddingTop: 10,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = screenIcons[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName} size={focused ? size + 4 : size} color={color} />;
        },
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen name="Informações" component={InfoScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Meus Pontos" component={ViewPointsScreen} />
      <Tab.Screen name="Conta" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
    tabBarLabel: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 5, 
    },
});
