import React, { useContext, useMemo, useState } from 'react';
import { Image, View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetFlatList, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

import { DataContext } from '../context/DataProvider';
import { useReverseGeocode } from '../hooks/useReverseGeocode';
import { changeStatusCollectionPoint } from '../services/api'; 
import { NotificationContext } from '../context/NotificationContext';
import ImageViewerModal from './ImageViewerModal'; 

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

export default function BottomSheetMapView({ selectedMarker, setSelectedMarker, bottomSheetRef, active }) {
    const snapPoints = useMemo(() => ['50%', '87%'], []);
    const { collectionTypes } = useContext(DataContext);
    const { showNotification } = useContext(NotificationContext);
    const { bottom: safeAreaBottom } = useSafeAreaInsets();
    
    const [actionLoading, setActionLoading] = useState(null);
    const [isImageViewerVisible, setImageViewerVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const { address, isLoading: isAddressLoading } = useReverseGeocode(
        selectedMarker?.latitude,
        selectedMarker?.longitude
    );
    
    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setImageViewerVisible(true);
    };

    const displayedTypes = useMemo(() => {
        if (!selectedMarker || !Array.isArray(selectedMarker.types) || !Array.isArray(collectionTypes?.results)) {
            return <Text>Carregando...</Text>;
        }
        const foundTypes = selectedMarker.types
            .map(typeId => collectionTypes.results.find(t => t.id === typeId))
            .filter(Boolean);
        return foundTypes.map(type => (
            <Text key={type.id} style={styles.markerTypeChip}>{type.name}</Text>
        ));
    }, [selectedMarker, collectionTypes]);

    const displayOperatingHours = useMemo(() => {
        if (!selectedMarker?.operating_hours?.length) {
            return <Text style={styles.noDataText}>Horário não disponível</Text>;
        }
        const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
        return selectedMarker.operating_hours.map((day) => (
            <View key={day.day_of_week} style={styles.dayContainer}>
                <Text style={styles.dayText}>{days[day.day_of_week - 1]}:</Text>
                <Text style={styles.hourText}>{day.opening_time.slice(0, 5)} - {day.closing_time.slice(0, 5)}</Text>
            </View>
        ));
    }, [selectedMarker]);  

    function handleSheetChanges(index) {
        if (index === -1) {
            setSelectedMarker(null);
        }
    };

    const handleAction = async (approve) => {
        const actionType = approve ? 'accept' : 'refuse';
        setActionLoading(actionType);
        try {
            await changeStatusCollectionPoint(selectedMarker.id, approve);
            showNotification('success', `Ponto ${approve ? 'aprovado' : 'recusado'} com sucesso.`);
            bottomSheetRef.current?.close();
        } catch (error) {
            showNotification('error', `Erro ao ${actionType === 'accept' ? 'aceitar' : 'recusar'} o ponto.`);
        } finally {
            setActionLoading(null);
        }
    }

    if (!selectedMarker) {
        return null;
    }

    return (
        <>
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
                    <Text style={styles.markerTitle}>{selectedMarker.name}</Text>
                    
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="location-outline" size={20} color="#333" />
                            <Text style={styles.sectionTitle}>Endereço</Text>
                        </View>
                        {isAddressLoading ? (
                            <ActivityIndicator size="small" color="#555" />
                        ) : (
                            <Text style={styles.addressText}>{formatAddress(address)}</Text>
                        )}
                    </View>
                    
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="information-circle-outline" size={20} color="#333" />
                            <Text style={styles.sectionTitle}>Descrição</Text>
                        </View>
                        <Text style={styles.addressText}>
                            {selectedMarker.description || 'Nenhuma descrição disponível.'}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="pricetags-outline" size={18} color="#333" />
                            <Text style={styles.sectionTitle}>Tipos</Text>
                        </View>
                        <View style={styles.markerTypesView}>{displayedTypes}</View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="image-outline" size={18} color="#333" />
                            <Text style={styles.sectionTitle}>Galeria</Text>
                        </View>
                        <BottomSheetFlatList
                            data={selectedMarker.images || []}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => openImageViewer(index)}>
                                    <Image source={{ uri: item.image }} style={styles.pointImage} />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            ListEmptyComponent={<Text style={styles.noDataText}>Nenhuma imagem.</Text>}
                        />
                    </View>
                
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="time-outline" size={20} color="#333" />
                            <Text style={styles.sectionTitle}>Funcionamento</Text>
                        </View>
                        {displayOperatingHours}
                    </View>
                    
                    {active && (
                        <View style={styles.buttonsView}>
                            <TouchableOpacity style={[styles.button, styles.refuseButton]} onPress={() => handleAction(false)} disabled={!!actionLoading}>
                                {actionLoading === 'refuse' ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Recusar</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAction(true)} disabled={!!actionLoading}>
                                {actionLoading === 'accept' ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Aceitar</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                </BottomSheetScrollView>
            </BottomSheetModal>
            <ImageViewerModal
                images={selectedMarker.images}
                initialIndex={selectedImageIndex}
                isVisible={isImageViewerVisible}
                onClose={() => setImageViewerVisible(false)}
            />
        </>
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
        backgroundColor: '#256D5B',
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    scrollViewContentContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    markerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    section: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    addressText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
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
        backgroundColor: '#E8F5E9',
        color: '#256D5B',
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    pointImage: {
        width: 150,
        height: 110,
        borderRadius: 10,
        marginRight: 10,
        backgroundColor: '#e0e0e0',
    },
    noDataText: {
        fontSize: 15,
        color: '#888',
        fontStyle: 'italic',
    },
    dayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dayText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        width: 40,
    },
    hourText: {
        fontSize: 15,
        color: '#555',
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    acceptButton: {
        backgroundColor: '#256D5B',
    },
    refuseButton: {
        backgroundColor: '#A4243B',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});