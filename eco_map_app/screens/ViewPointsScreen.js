import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { getUserCollectionPoints, deletePoint } from '../services/ecoPointService';
import { NotificationContext } from '../context/NotificationContext';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const convertPointStatus = (status) => {
    const statuses = { pending: 'Pendente', approved: 'Aprovado', rejected: 'Rejeitado' };
    return statuses[status] || 'Desconhecido';
};

const getStatusStyle = (status) => {
    const styles = {
        pending: { backgroundColor: '#FFA500', icon: 'hourglass-outline' },
        approved: { backgroundColor: '#28A745', icon: 'checkmark-circle-outline' },
        rejected: { backgroundColor: '#DC3545', icon: 'close-circle-outline' },
    };
    return styles[status] || { backgroundColor: 'gray', icon: 'help-circle-outline' };
};

const PointItem = ({ point, navigation, onSelectDelete }) => {
    const statusStyle = getStatusStyle(point.status);

    return (
        <View style={styles.pointContainer}>
            <View style={styles.pointHeader}>
                <Text style={styles.pointName} numberOfLines={1}>{point.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Ionicons name={statusStyle.icon} size={14} color="white" />
                    <Text style={styles.statusText}>{convertPointStatus(point.status)}</Text>
                </View>
            </View>
            <Text style={styles.pointDescription} numberOfLines={2}>
                {point.description || 'Nenhuma descrição fornecida.'}
            </Text>
            <View style={styles.pointActions}>
                <TouchableOpacity style={[styles.actionButton, styles.detailsButton]} onPress={() => navigation.navigate('PointDetail', { pointId: point.id })}>
                    <Ionicons name="eye-outline" size={18} color="#256D5B" />
                    <Text style={[styles.actionButtonText, styles.detailsButtonText]}>Ver Detalhes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => onSelectDelete(point)}>
                    <Ionicons name="trash-outline" size={18} color="#DC3545" />
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Deletar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function ViewPointsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [points, setPoints] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [pointToDelete, setPointToDelete] = useState(null);

    const { showNotification } = useContext(NotificationContext);

    const fetchData = useCallback(async (isRefreshing = false) => {
        if (!hasNext && !isRefreshing) return;
        if (isRefreshing) {
            setRefreshing(true);
        } else if (page === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const currentPage = isRefreshing ? 1 : page;
            const response = await getUserCollectionPoints(currentPage);
            
            if (isRefreshing) {
                setPoints(response.results);
            } else {
                setPoints(prevPoints => [...prevPoints, ...response.results]);
            }
            
            setHasNext(response.next !== null);
            if (response.next) {
                setPage(currentPage + 1);
            }
        } catch (error) {
            showNotification('error', 'Ocorreu um erro ao carregar os pontos');
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, [page, hasNext]);

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setPage(1);
        setHasNext(true);
        fetchData(true);
    };

    const handleSelectDelete = (point) => {
        setPointToDelete(point);
        setModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        if (!pointToDelete) return;
        setModalVisible(false);
        try {
            await deletePoint(pointToDelete.id);
            setPoints(prevPoints => prevPoints.filter(p => p.id !== pointToDelete.id));
            showNotification('success', 'Ponto deletado com sucesso');
        } catch (error) {
            showNotification('error', 'Ocorreu um erro ao deletar o ponto');
        } finally {
            setPointToDelete(null);
        }
    };

    if (loading && page === 1) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#256D5B" />
            </SafeAreaView>
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
                        onSelectDelete={handleSelectDelete}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={<Text style={styles.title}>Meus Pontos de Coleta</Text>}
                ListEmptyComponent={!loading && <Text style={styles.noPoints}>Nenhum ponto encontrado.</Text>}
                contentContainerStyle={styles.listContentContainer}
                onEndReached={() => !loadingMore && hasNext && fetchData()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore && <ActivityIndicator style={{ marginVertical: 20 }} color="#256D5B" />}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#256D5B"]} />}
            />
            <DeleteConfirmationModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleDeleteConfirm}
                pointName={pointToDelete?.name}
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
        backgroundColor: '#F5F5F5',
    },
    listContentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
        color: '#333',
    },
    noPoints: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
    pointContainer: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    pointHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    pointName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    pointDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        lineHeight: 20,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5,
    },
    pointActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 10,
        marginTop: 5,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    detailsButton: {
        backgroundColor: '#E8F5E9',
    },
    detailsButtonText: {
        color: '#256D5B',
    },
    deleteButton: {
        backgroundColor: '#FFEBEE',
    },
    deleteButtonText: {
        color: '#DC3545',
    },
});
