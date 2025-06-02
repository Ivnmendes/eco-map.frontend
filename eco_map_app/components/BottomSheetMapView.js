import React, { useContext, useMemo } from 'react';
import { Image, View, StyleSheet, Text, ActivityIndicator } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { DataContext } from '../context/DataContext';
import { useReverseGeocode } from '../hooks/useReverseGeocode';

function formatAddress(addressObject) {
    if (!addressObject) return 'Endereço não disponível';

    const { street, number, neighborhood, city, state, postcode } = addressObject;
    let addressParts = [];
    if (street) addressParts.push(`${street}${number ? ' ' + number : ' S/nº'}`);
    if (neighborhood) addressParts.push(neighborhood);
    
    let cityStateZip = [];
    if (city) cityStateZip.push(city);
    if (state) cityStateZip.push(state);
    if (postcode) cityStateZip.push("\n" + postcode);

    if (cityStateZip.length > 0) {
        addressParts.push(cityStateZip.join(city && state ? ' - ' : ', '));
    }
    
    return addressParts.join(', \n');
};

export default function BottomSheetMapView({ selectedMarker, setSelectedMarker, bottomSheetRef }) {
    const snapPoints = useMemo(() => ['50%', '88%'], []);
    const { collectionTypes } = useContext(DataContext);
    const { bottom: safeAreaBottom } = useSafeAreaInsets();

    const { address, isLoading: isAddressLoading } = useReverseGeocode(
        selectedMarker?.latitude,
        selectedMarker?.longitude
    );

    const displayedTypes = useMemo(() => {
        if (!selectedMarker || !Array.isArray(selectedMarker.types) || !Array.isArray(collectionTypes?.results)) {
            return <Text style={styles.typesLabel}>Carregando tipos...</Text>;
        }
        if (selectedMarker.types.length === 0) {
            return <Text style={styles.typesLabel}>Não especificado</Text>;
        }
        const foundTypes = selectedMarker.types
            .map(typeId => collectionTypes.results.find(t => t.id === typeId))
            .filter(Boolean);
        return foundTypes.map(type => (
            <Text key={type.id} style={styles.markerTypeChip}>
                {type.name}
            </Text>
        ));
    }, [selectedMarker, collectionTypes]);

    function handleSheetChanges(index) {
        if (index === -1) {
            setSelectedMarker(null);
        }
    };

    if (!selectedMarker) {
        return null;
    }

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0} 
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            handleIndicatorStyle={styles.handleIndicator} 
            backgroundStyle={styles.bottomSheetBackground}
            bottomInset={safeAreaBottom}
        >
            <BottomSheetScrollView contentContainerStyle={styles.scrollViewContentContainer}>
                <Text style={styles.markerTitle}>{selectedMarker.name || 'Ponto de Coleta'}</Text>
                <View style={styles.addressContainer}>
                    {isAddressLoading ? (
                        <ActivityIndicator size="small" color="#555" />
                    ) : (
                        <Text style={styles.markerAddress}>
                            {formatAddress(address)}
                        </Text>
                    )}
                </View>
                <View style={styles.separator}/>
                <View style={styles.typesContainer}>
                    <Text style={styles.typesLabel}>Tipos:</Text>
                    <View style={styles.markerTypesView}>
                        {displayedTypes}
                    </View>
                </View>
                <View style={styles.separator}/>
                <Image source={ require('../assets/coletaseletiva-cke.webp') } style={styles.pointImage} resizeMode='cover'/>
                <View style={styles.separator}/>
                <View style={styles.opratingHoursContainer}>
                    <Text style={styles.typesLabel}>Horário de Funcionamento:</Text>
                </View>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    bottomSheetBackground: { 
        borderColor: '#888',
        borderWidth: 1,
        backgroundColor: '#f8f4f4', 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20,
    },
    handleIndicator: {
        backgroundColor: 'green',
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center', 
        marginVertical: 8,   
    },
    scrollViewContentContainer: {
        paddingHorizontal: 20, 
        paddingTop: 10,
        paddingBottom: 40,
    },
    markerTitle: {
        fontSize: 20, 
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    addressContainer: {
        minHeight: 20, 
    },
    markerAddress: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 8,
    },
    typesContainer: {
        marginBottom: 5,
    },
    typesLabel: {
        fontSize: 16, 
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    markerTypesView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    markerTypeChip: {
        fontSize: 14,
        marginBottom: 8, 
        marginRight: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: 'green',
        color: 'white',
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    pointImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
        backgroundColor: '#e0e0e0',
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
        marginBottom: 13,
    },
});