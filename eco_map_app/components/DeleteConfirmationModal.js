import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function DeleteConfirmationModal({ isVisible, onClose, onConfirm, pointName }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Ionicons name="warning-outline" size={50} color="#DC3545" />
                    <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                    <Text style={styles.modalText}>
                        Você tem certeza que deseja deletar permanentemente o ponto 
                        <Text style={{ fontWeight: 'bold' }}> "{pointName}"</Text>?
                    </Text>
                    <Text style={styles.modalSubText}>Esta ação não pode ser desfeita.</Text>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.deleteButtonText}>Sim, Deletar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
    modalTitle: {
        marginTop: 15,
        marginBottom: 10,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 5,
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    modalSubText: {
        marginBottom: 25,
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        paddingVertical: 12,
        elevation: 2,
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#F0F0F0',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: '#DC3545',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});