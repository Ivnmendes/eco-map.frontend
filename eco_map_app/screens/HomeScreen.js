import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import { getAccessToken } from '../utils/auth';
import { API_URL } from '../constants';

export default function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [region, setRegion] = useState({
        latitude: -29.7137724,
        longitude: -53.7162037,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          setHasPermission(status === 'granted');
          if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Permissão para acessar localização é necessária.');
          }
        })();
    }, []);

    const mapRef = useRef(null);

    async function updateLocation() {
        setLoadingLocation(true);

        try {
            if (!hasPermission) {
                Alert.alert('Permissão não concedida');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low
            });
            const newRegion = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }

            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 500);

            setLoadingLocation(false)
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível obter a localização');
        }
    }
    
    return (
        <View style={{ flex: 1}}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                initialRegion={region}
            />
            <TouchableOpacity style={styles.floatingButton} onPress={ updateLocation } disabled={loadingLocation}>
                {loadingLocation ? (
                    <ActivityIndicator size="small" color="#fff" />
                    ) : (
                    <Ionicons name="locate-outline" size={28} color="#fff" />
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 140,
        right: 20,
        backgroundColor: 'green',
        width: 56,
        height: 56,
        borderRadius: 28, 
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,  
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
});