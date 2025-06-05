import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { fetchCollectionTypes, fetchUserData, fetchCollectionPoints as fetchCollectionPointsApi } from '../services/api';

export const DataContext = createContext();

export function DataProvider({ children }) {
    const [collectionTypes, setCollectionTypes] = useState(null);
    const [collectionPoints, setCollectionPoints] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    async function loadInitialData() {
        if (initialDataLoaded) return;
        try {
            const data = await fetchCollectionTypes();
            setCollectionTypes(data);

            const userData = await fetchUserData();
            setUserDetails(userData);
            setInitialDataLoaded(true);
        } catch (error) {
            console.log(error.request);
            Alert.alert('Erro', 'Erro interno ao carregar categorias');
        }
    }

    async function fetchCollectionPoints(params) {
        try {
            const data = await fetchCollectionPointsApi(params);
            setCollectionPoints(data);
        } catch (error) {
            Alert.alert("Erro", "Erro interno ao carregar pontos de coleta");
            console.log(error.response)
        }
    }

    return (
        <DataContext.Provider
        value={{
            collectionTypes,
            collectionPoints,
            fetchCollectionPoints,
            userDetails,
            loadInitialData
        }}
        >
            {children}
        </DataContext.Provider>
    );
}
