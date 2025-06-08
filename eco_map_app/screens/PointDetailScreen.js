import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Image, View, StyleSheet, Text, ActivityIndicator, ScrollView, FlatList, TouchableOpacity } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { DataContext } from '../context/DataProvider';
import { useReverseGeocode } from '../hooks/useReverseGeocode';
import { getPointDetails, deletePoint } from '../services/ecoPointService';
import { NotificationContext } from '../context/NotificationContext';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ImageViewerModal from '../components/ImageViewerModal';

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

export default function PointDetailScreen({ route, navigation }) {
    const { pointId } = route.params;
    const { collectionTypes } = useContext(DataContext);
    const { showNotification } = useContext(NotificationContext);

    const [point, setPoint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isImageViewerVisible, setImageViewerVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    const { address, isLoading: isAddressLoading } = useReverseGeocode(point?.latitude, point?.longitude);

    useEffect(() => {
        const loadPoint = async () => {
            if (!pointId) {
                showNotification('error', 'ID do ponto não fornecido.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await getPointDetails(pointId);
                setPoint(data);
            } catch (error) {
                showNotification('error', 'Falha ao carregar detalhes do ponto.');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        loadPoint();
    }, [pointId]);

    const handleDelete = async () => {
        setIsDeleteModalVisible(false);
        try {
            await deletePoint(point.id);
            showNotification('success', 'Ponto deletado com sucesso.');
            navigation.goBack();
        } catch (error) {
            showNotification('error', 'Falha ao deletar o ponto.');
        }
    };

    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setImageViewerVisible(true);
    };

    const displayedTypes = useMemo(() => {
        if (!point || !Array.isArray(point.types) || !Array.isArray(collectionTypes?.results)) return null;
        const foundTypes = point.types
            .map(typeId => collectionTypes.results.find(t => t.id === typeId))
            .filter(Boolean);
        return foundTypes.map(type => (
            <Text key={type.id} style={styles.markerTypeChip}>{type.name}</Text>
        ));
    }, [point, collectionTypes]);

    const displayOperatingHours = useMemo(() => {
        if (!point?.operating_hours?.length) {
            return <Text style={styles.noDataText}>Horário não disponível</Text>;
        }
        const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
        return point.operating_hours.map((day) => (
            <View key={day.day_of_week} style={styles.dayContainer}>
                <Text style={styles.dayText}>{days[day.day_of_week - 1]}:</Text>
                <Text style={styles.hourText}>{day.opening_time.slice(0, 5)} - {day.closing_time.slice(0, 5)}</Text>
            </View>
        ));
    }, [point]);  

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#256D5B" />
            </SafeAreaView>
        );
    }

    if (!point) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>Ponto não encontrado.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
                <Text style={styles.markerTitle}>{point.name}</Text>
                
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location-outline" size={22} color="#333" />
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
                        <Ionicons name="information-circle-outline" size={22} color="#333" />
                        <Text style={styles.sectionTitle}>Descrição</Text>
                    </View>
                    <Text style={styles.descriptionText}>{point.description || 'Nenhuma descrição fornecida.'}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="pricetags-outline" size={20} color="#333" />
                        <Text style={styles.sectionTitle}>Tipos Aceitos</Text>
                    </View>
                    <View style={styles.markerTypesView}>{displayedTypes}</View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="image-outline" size={20} color="#333" />
                        <Text style={styles.sectionTitle}>Galeria</Text>
                    </View>
                    <FlatList
                        data={point.images || []}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => openImageViewer(index)}>
                                <Image source={{ uri: item.image }} style={styles.pointImage} />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<Text style={styles.noDataText}>Nenhuma imagem disponível.</Text>}
                    />
                </View>
                
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="time-outline" size={22} color="#333" />
                        <Text style={styles.sectionTitle}>Horário de Funcionamento</Text>
                    </View>
                    {displayOperatingHours}
                </View>

                 <TouchableOpacity style={styles.deleteButton} onPress={() => setIsDeleteModalVisible(true)}>
                    <Ionicons name="trash-outline" size={18} color="#FFF" />
                    <Text style={styles.deleteButtonText}>Deletar Ponto de Coleta</Text>
                </TouchableOpacity>

            </ScrollView>
            <DeleteConfirmationModal
                isVisible={isDeleteModalVisible}
                onClose={() => setIsDeleteModalVisible(false)}
                onConfirm={handleDelete}
                pointName={point.name}
            />
            <ImageViewerModal
                images={point.images}
                initialIndex={selectedImageIndex}
                isVisible={isImageViewerVisible}
                onClose={() => setImageViewerVisible(false)}
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContentContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    markerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    addressText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    descriptionText: {
        fontSize: 16,
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
        width: 200,
        height: 150,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        width: 50,
    },
    hourText: {
        fontSize: 16,
        color: '#555',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DC3545',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});