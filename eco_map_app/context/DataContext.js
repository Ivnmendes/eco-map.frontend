import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { Alert } from 'react-native';
import { getAccessToken } from '../utils/auth';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [collectionTypes, setCollectionTypes] = useState(null);
  const [collectionPoints, setCollectionPoints] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    async function loadCollectionTypes() {
      try {
        const access = await getAccessToken();

        const { data } = await axios.get(
            `${API_URL}/eco-points/collection-type/`,
            {  
                headers: {
                    Authorization: `Bearer ${access}`
                },
            }
        );
        setCollectionTypes(data);

        const userData = await axios.get(
          `${API_URL}/accounts/me/`,
          {  
              headers: {
                  Authorization: `Bearer ${access}`
              },
          }
        );
        setUserDetails(userData);
      } catch (error) {
        console.log(error.response)
        Alert.alert("Erro", "Erro interno ao carregar categorias");
      }
    }
    loadCollectionTypes();
  }, []);

  async function fetchCollectionPoints(params) {
    try {
        const access = await getAccessToken();

        const { data } = await axios.get(
            `${API_URL}/eco-points/collection-point/`,
            { 
                params, 
                headers: {
                    Authorization: `Bearer ${access}`
                },
            }
        );
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
        userDetails
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
