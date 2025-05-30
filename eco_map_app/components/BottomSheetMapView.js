import React, { useContext, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { DataContext } from '../context/DataContext';

export default function BottomSheetMapView({ selectedMarker, setSelectedMarker, collectionPoints, bottomSheetRef, navigate }) {
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    const { collectionTypes } = useContext(DataContext);
    const handleSheetChanges = (index) => {
        if (index === -1) {
            setSelectedMarker(null);
        }
    };

    const displayedTypes = useMemo(() => {
        if (!selectedMarker || !Array.isArray(selectedMarker.types) || !Array.isArray(collectionTypes)) {
            return 'Carregando tipos...';
        }
        if (selectedMarker.types.length === 0) {
            return 'Não especificado';
        }
        return selectedMarker.types
            .map(typeId => {
                const type = collectionTypes.find(t => t.id === typeId);
                return type ? type.name : null;
            })
            .filter(Boolean) 
            .join(', ');
    }, [selectedMarker, collectionTypes]);

    if (!selectedMarker) {
        return null;
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1} 
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            style={styles.bottomSheetContainer}
            handleIndicatorStyle={styles.handleIndicator} 
            backgroundStyle={styles.bottomSheetBackground}
        >
            <BottomSheetView style={styles.bottomSheetContentContainer}>
                <Text style={styles.markerTitle}>{selectedMarker.name || 'Ponto de Coleta'}</Text>
                <Text style={styles.markerAddress}>{selectedMarker.address || 'Endereço não disponível'}</Text>
                <TouchableOpacity 
                    style={styles.detailsButton}
                    onPress={() => {
                        navigate('PointDetails', { pointId: selectedMarker.id });
                        bottomSheetRef.current?.close();
                    }}
                >
                    <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    bottomSheetContainer: { 
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3, 
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        
        elevation: 20,
    },
    bottomSheetBackground: { 
        borderColor: '#888',
        borderWidth: 1,
        backgroundColor: '#f8f4f4', 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20,
    },
    handleIndicator: {
        backgroundColor: '#E0E0E0',
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    bottomSheetContentContainer: {
        flex: 1,
        padding: 20,
    },
    markerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    markerAddress: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 8,
    },
    markerTypes: {
        fontSize: 14,
        marginBottom: 16,
    },
    detailsButton: {
        backgroundColor: 'green',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    detailsButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
