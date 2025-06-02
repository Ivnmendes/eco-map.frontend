// src/hooks/useReverseGeocode.js

import { useState, useEffect } from 'react';
import { getCache, setCache } from '../services/geocodeService';
import { reverseGeocodeApi } from '../services/ecoPointService';

export const useReverseGeocode = (latitude, longitude) => {
    const [address, setAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!latitude || !longitude) {
        setAddress(null);
        return;
        }

        const fetchAddress = async () => {
        setIsLoading(true);
        setError(null);
        
        const cacheKey = `address_${latitude}_${longitude}`;

        try {
            const cachedAddress = await getCache(cacheKey);

            if (cachedAddress) {
                setAddress(cachedAddress);
            } else {
                const newAddress = await reverseGeocodeApi(latitude, longitude);
                setAddress(newAddress);
                await setCache(cacheKey, newAddress);
            }
        } catch (err) {
            console.error('Erro na geocodificação:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
        };

        fetchAddress();
    }, [latitude, longitude]);

    return { address, isLoading, error };
};