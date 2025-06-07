import React, { createContext, useState, useEffect } from 'react';

import { NotificationContext } from './NotificationContext';
import { fetchCollectionTypes as fetchCollectionTypesApi, fetchUserData as fetchUserDataApi, fetchCollectionPoints as fetchCollectionPointsApi } from '../services/api';

export const DataContext = createContext();

export function DataProvider({ children }) {
    const [collectionTypes, setCollectionTypes] = useState(null);
    const [collectionPoints, setCollectionPoints] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    async function loadInitialData() {
        if (initialDataLoaded) return;

        await fetchCollectionTypes();

        await fetchUserData();
        setInitialDataLoaded(true);
    }

    async function fetchCollectionPoints(active) {
        try {
            const data = await fetchCollectionPointsApi(active);
            setCollectionPoints(data);
        } catch (error) {
            showNotification("error", "Erro interno ao carregar pontos de coleta");
        }
    }

    async function fetchCollectionTypes() {
        try {
            const data = await fetchCollectionTypesApi();
            setCollectionTypes(data);
        } catch (error) {
            showNotification("error", "Erro interno ao carregar tipos de coleta");
        }
    }

    async function fetchUserData() {
        try {
            const data = await fetchUserDataApi();
            setUserDetails(data);
        } catch (error) {
            showNotification("error", "Erro interno ao carregar detalhes do usuário");
        }
    }

    async function clearContextData() {
        setCollectionTypes(null);
        setCollectionPoints(null);
        setUserDetails(null);
        setInitialDataLoaded(false);
    }

    return (
        <DataContext.Provider
        value={{
            collectionTypes,
            collectionPoints,
            fetchCollectionPoints,
            userDetails,
            loadInitialData,
            fetchCollectionTypes,
            fetchUserData,
            clearContextData,
        }}
        >
            {children}
        </DataContext.Provider>
    );
}
