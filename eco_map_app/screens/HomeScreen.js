import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

import { DataContext } from '../context/DataContext';
import CollectionTypeCarousel from '../components/CollectionTypeCarousel';
import MapContainer from '../components/MapContainer';
import FloatingButtons from '../components/FloatingButtons';
import { reload } from 'expo-router/build/global-state/routing';

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
    const { collectionPoints, fetchCollectionPoints, collectionTypes, loadInitialData, userDetails } = useContext(DataContext);
    const isFirstLoad = useRef(true);
    const [selectedCategoryTypes, setSelectedCategoryTypes] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            if (isFirstLoad.current) {
                loadInitialData();
                isFirstLoad.current = false;
            }
        }, [])
    );

    async function reloadFetchCollectionPoints() {
        setLoadingPoints(true);
        await fetchCollectionPoints(isAdmin);
        setLoadingPoints(false);
    }

    useEffect(() => {
        reloadFetchCollectionPoints(!isAdmin);
    }, [isAdmin]);

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
            navigation.navigate('AddPointForm', {});
        } catch {
            Alert.alert('Erro', 'Não foi possível obter a localização');
        } finally {
            setLoadingLocation(false);
        }
    }

    async function handleUpdateLocation() {
        setLoadingLocation(true);
        try {
            if (!hasPermission) {
                Alert.alert('Permissão não concedida');
                setLoadingLocation(false);
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
            };
            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 500);
        } catch {
            Alert.alert('Erro', 'Não foi possível obter a localização');
        } finally {
            setLoadingLocation(false);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <CollectionTypeCarousel
                collectionTypes={collectionTypes?.results || []}
                selectedCategoryTypes={selectedCategoryTypes}
                setSelectedCategoryTypes={setSelectedCategoryTypes}
            />

            <MapContainer
                region={region}
                mapRef={mapRef}
                collectionPoints={collectionPoints?.results || []}
                filters={selectedCategoryTypes}
                collectionTypes={collectionTypes}
                isAdmin={isAdmin}
            />

            <FloatingButtons
                loadingLocation={loadingLocation}
                loadingPoints={loadingPoints}
                onUpdateLocation={handleUpdateLocation}
                onReloadPoints={reloadFetchCollectionPoints}
                onAddPoint={handleAddPoint}
                isStaff={userDetails?.is_staff}
                setIsAdmin={setIsAdmin}
                isAdmin={isAdmin}
            />
        </View>
    );
}
