import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './services/navigationService';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import { DataProvider } from './context/DataProvider';
import { NotificationProvider } from './context/NotificationContext';

import MainTabs from './components/MainTabs';

import { verifyOrRefreshTokens } from './services/api.js';
import AddPointForm from './screens/AddPointForm.js';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import ViewPointsScreen from './screens/ViewPointsScreen.js';
import PointDetailScreen from './screens/PointDetailScreen.js';
import AddCategoryForm from './screens/AddCategoryForm.js';

const Stack = createNativeStackNavigator();

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const init = async () => {
        const valid = await verifyOrRefreshTokens();
        setIsAuthenticated(valid);
        };
        init();
    }, []);

    if (isAuthenticated === null) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <NotificationProvider>
                    <DataProvider>  
                        <BottomSheetModalProvider>
                            <NavigationContainer ref={navigationRef}>
                                <Stack.Navigator screenOptions={{ headerShown: false }}>
                                {isAuthenticated ? (
                                    <>
                                    <Stack.Screen name="Main" component={MainTabs} />
                                    <Stack.Screen name="Login" component={LoginScreen} />
                                    </>
                                ) : (
                                    <>
                                    <Stack.Screen name="Login" component={LoginScreen} />
                                    <Stack.Screen name="Main" component={MainTabs} />
                                    </>
                                )}
                                <Stack.Screen name="Register" component={RegisterScreen} />
                                <Stack.Screen name="AddPointForm" component={AddPointForm} />
                                <Stack.Screen name="PointsList" component={ViewPointsScreen} />
                                <Stack.Screen name="PointDetail" component={PointDetailScreen} />
                                <Stack.Screen name="AddCategoryForm" component={AddCategoryForm} />
                                </Stack.Navigator>
                            </NavigationContainer>
                        </BottomSheetModalProvider>
                    </DataProvider>
                </NotificationProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
  );
}
