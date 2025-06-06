import React, { useContext, useMemo } from 'react';
import { Image, View, StyleSheet, Text, ActivityIndicator, FlatList, ScrollView, SafeAreaView } from 'react-native'; 

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

export default function PointDetailScreen({ route }) {
    const { point } = route.params;

    const { collectionTypes } = useContext(DataContext);
    
    const { address, isLoading: isAddressLoading } = useReverseGeocode(
        point?.latitude,
        point?.longitude
    );

    const displayedTypes = useMemo(() => {
        if (!point || !Array.isArray(point.types) || !Array.isArray(collectionTypes?.results)) {
            return <Text style={styles.typesLabel}>Carregando tipos...</Text>;
        }
        if (point.types.length === 0) {
            return <Text style={styles.typesLabel}>Não especificado</Text>;
        }
        const foundTypes = point.types
            .map(typeId => collectionTypes.results.find(t => t.id === typeId))
            .filter(Boolean);
        return foundTypes.map(type => (
            <Text key={type.id} style={styles.markerTypeChip}>
                {type.name}
            </Text>
        ));
    }, [point, collectionTypes]);

    const displayOperatingHours = useMemo(() => {
        const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

        if (!point || !point.operating_hours) {
            return <Text style={styles.typesLabel}>Horário não disponível</Text>;
        }
        const operatingHours = point.operating_hours;
        if (Array.isArray(operatingHours) && operatingHours.length > 0) {
            return operatingHours.map((day) => (
                <View key={day.day_of_week} style={styles.dayContainer} >
                    <Text style={styles.dayText}>
                        {days[day.day_of_week - 1]}:
                    </Text>
                    <Text style={styles.hourText}>
                        {day.opening_time.slice(0, 5)}
                    </Text>
                    <Text style={styles.hourSeparator}> - </Text>
                    <Text style={styles.hourText}>
                        {day.closing_time.slice(0, 5)}
                    </Text>
                </View>
            ));
        } else {
            return <Text style={styles.typesLabel}>Horário não disponível</Text>;
        }
    }, [point]);  

    if (!point) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Nenhum ponto selecionado.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
                <Text style={styles.markerTitle}>{point.name || 'Ponto de Coleta'}</Text>
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
                <View style={{ height: 210, marginBottom: 16 }}>
                    <FlatList
                        data={point.images || []}
                        renderItem={({ item, index }) => (
                            <View style={{ marginRight: index === point.images.length - 1 ? 0 : 10 }}>
                                <Image source={{ uri: item.image }} style={styles.pointImage} />
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 20 }}
                        removeClippedSubviews={false}
                    />
                </View>
                <View style={styles.separator}/>
                <View style={styles.opratingHoursContainer}>
                    <Text style={styles.typesLabel}>Horário de Funcionamento:</Text>
                    {displayOperatingHours}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f4f4', 
        paddingTop: '15%',
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
        width: 366,
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
    opratingHoursContainer: {
        marginBottom: 20,
    },
    dayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        paddingLeft: 5,
    },
    dayText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        width: 80,
        marginRight: 5,
    },
    hourText: {
        fontSize: 16,
        color: '#555',
        backgroundColor: '#c0c0c0',
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    hourSeparator: {
        fontSize: 16,
        color: '#555',
        marginHorizontal: 5,
    },
});