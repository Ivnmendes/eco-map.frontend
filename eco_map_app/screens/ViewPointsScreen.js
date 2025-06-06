import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';

import { getUserCollectionPoints, deletePoint } from '../services/ecoPointService';

const PointItem = ({ point, navigation, onDelete }) => (
    <View style={styles.pointContainer}>
        <View style={styles.pointField}>
            <Text style={styles.pointName}>{point.name}</Text>
        </View>
        <View style={styles.pointField}>
            <Text style={styles.pointDescription}>{point.description}</Text>
        </View>
        <View style={styles.pointField}>
            <TouchableOpacity style={styles.buttonPoint} onPress={() => navigation.navigate('PointDetail', { point: point })}>
                <Text style={styles.viewDetails}>Ver detalhes</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.pointField}>
            <TouchableOpacity style={[styles.buttonPoint, {backgroundColor: 'red'}]} onPress={() => onDelete(point)}>
                <Text style={styles.viewDetails}>Deletar ponto</Text>
            </TouchableOpacity>
        </View>
    </View>
);


export default function ViewPointsScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [points, setPoints] = useState([]);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        const fetchData = async () => {  
            setLoading(true);
            try {
                const pointRequest = await getUserCollectionPoints(page);
                setPoints(pointRequest.results);
            } catch (error) {
                console.log(error.response?.data || error.message);
                Alert.alert('Erro', 'Ocorreu um erro ao carregar os pontos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refetchTrigger, page]);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    async function handleDeletePoint(point) {
        Alert.alert(
            'Deletar ponto',
            'Você tem certeza que deseja deletar este ponto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    onPress: async () => {
                        try {
                            await deletePoint(point.id);
                            Alert.alert('Sucesso', 'Ponto deletado com sucesso');
                            setRefetchTrigger(prev => prev + 1);
                        } catch (error) {
                            console.log(error.response?.data || error.message);
                            Alert.alert('Erro', 'Ocorreu um erro ao deletar o ponto');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={points}
                renderItem={({ item }) => (
                    <PointItem 
                        point={item} 
                        navigation={navigation}
                        onDelete={handleDeletePoint}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={<Text style={styles.text}>Pontos submetidos:</Text>}
                ListEmptyComponent={<Text style={styles.noPoints}>Nenhum ponto encontrado.</Text>}
                contentContainerStyle={styles.listContentContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: '15%',
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContentContainer: {
        paddingHorizontal: 16,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    noPoints: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'gray',
    },
    pointContainer: {
        backgroundColor: '#f8f4f4',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pointField: {
        marginBottom: 10,
    },
    pointName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    pointDescription: {
        fontSize: 16,
        color: 'gray',
    },
    buttonPoint: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    viewDetails: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});