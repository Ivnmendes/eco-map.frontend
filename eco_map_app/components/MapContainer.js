import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function MapContainer({ region, mapRef, collectionPoints }) {
    return (
        <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton={false}
        >
            {collectionPoints.map(point => (
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
    );
}
