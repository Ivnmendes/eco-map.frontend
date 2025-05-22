import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Alert, } from 'react-native';

import { navigate } from '../services/navigationService';

export default function MapContainer({ region, mapRef, collectionPoints, filters }) {
    const [buttonPos, setButtonPos] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const markerRef = useRef(null);
    
    async function handleMapPress(event) {
        if (buttonPos !== null) {
            setButtonPos(null);
            setLatitude(null);
            setLongitude(null);
        } else {
            const coordinate = event.nativeEvent.coordinate;
            setLatitude(coordinate.latitude);
            setLongitude(coordinate.longitude);
            setButtonPos(coordinate);
        }
    }

    async function handleButtonPress() {
        try {
            navigate('AddPointForm', {
                latitude,
                longitude
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar o ponto');
            console.log(error)
        }
    }

    useEffect(() => {
        if (buttonPos && markerRef.current) {
            markerRef.current?.showCallout();
        }
    }, [buttonPos]);

    return (
    <View style={{ flex:1 }}>
        <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton={false}
            onPress={handleMapPress}
        >
            {collectionPoints.map(point => {
            const shouldDisplayMarker =
                filters.length === 0 || 
                point.types.every(type => filters.includes(type));
    
            if (!shouldDisplayMarker) return null;
    
            return (
                <Marker
                key={point.id}
                coordinate={{
                    latitude: Number(point.latitude),
                    longitude: Number(point.longitude),
                }}
                title={point.name}
                description={point.description}
                />
            );
            })}

            {buttonPos && (
                <Marker
                    coordinate={buttonPos}
                    ref={markerRef}
                    onPress={handleButtonPress}
                    image={require('../assets/custom-marker.png')}
                >
                </Marker>
            )}
        </MapView>
    </View>
    );
}

const styles = StyleSheet.create({
    ButtonMarker: {
        backgroundColor: 'green',
        height: 30,
        width: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',    
        elevation: 5,            
        shadowColor: '#000',     
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});