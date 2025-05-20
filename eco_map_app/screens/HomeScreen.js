import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { getAccessToken } from '../utils/auth';
import { API_URL } from '../constants';

import { DataContext } from '../context/DataContext'

export default function HomeScreen({ navigation }) {
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [loadingPoints, setLoadingPoints] = useState(false);
    const [region, setRegion] = useState({
        latitude: -29.7137724,
        longitude: -53.7162037,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [hasPermission, setHasPermission] = useState(false);
    const { collectionPoints, fetchCollectionPoints, collectionTypes } = useContext(DataContext);

    async function reloadFetchCollectionPoints() {
        setLoadingPoints(true);

        await fetchCollectionPoints();

        setLoadingPoints(false);
    }

    useEffect(() => {
        reloadFetchCollectionPoints();
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          setHasPermission(status === 'granted');
          if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Permissão para acessar localização é necessária.');
          }
        })();
    }, []);

    const mapRef = useRef(null);

    async function handleAddPoint() {
        try {
            setLoadingLocation(true);
            if (!hasPermission) {
                Alert.alert('Permissão não concedida');
                setLoadingLocation(false);
                return;
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

            navigation.navigate('AddPointForm', {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            });
        } catch (error) {
            setLoadingLocation(false);
            Alert.alert('Erro', 'Não foi possível obter a localização');
        }
    }

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
            >
                {collectionPoints && collectionPoints.results && collectionPoints.results.map(point => (
                    <Marker
                        key={point.id}
                        coordinate={{
                            latitude: Number(point.latitude),
                            longitude: Number(point.longitude)
                        }}
                        title={point.name}
                        description={point.description}
                    />
                ))}
            </MapView>
            <TouchableOpacity style={styles.floatingButton} onPress={ updateLocation } disabled={ loadingLocation }>
                {loadingLocation ? (
                    <ActivityIndicator size="small" color="#fff" />
                    ) : (
                    <Ionicons name="locate-outline" size={28} color="#fff" />
                )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.floatingButton, styles.floatingButtonReload]} onPress={ reloadFetchCollectionPoints } disabled={loadingPoints}>
                {loadingPoints ? (
                    <ActivityIndicator size="small" color="#fff" />
                    ) : (
                    <Ionicons name="reload-outline" size={28} color="#fff" />
                )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.floatingButton, styles.floatingButtonAdd]} onPress={ handleAddPoint }>
                <Ionicons name="add-circle-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.floatingButton, styles.floatingButtonFilter]} onPress={ () => {} }>
                <Ionicons name="filter-circle-outline" size={28} color="#fff" />
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
      floatingButtonReload: {
        bottom: 220,
      },
      floatingButtonAdd: {
        bottom: 300,
      }, 
      floatingButtonFilter: {
        bottom: 380
      }
});