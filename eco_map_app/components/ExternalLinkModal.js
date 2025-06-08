import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ExternalLinkModal({ isVisible, onClose, onConfirm, url }) {
    if (!isVisible) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Ionicons name="alert-circle-outline" size={50} color="#f0ad4e" />
                    <Text style={styles.modalTitle}>Navegação Externa</Text>
                    <Text style={styles.modalText}>
                        Você está prestes a sair do aplicativo para abrir o seguinte endereço:
                    </Text>
                    <Text style={styles.urlText}>{url}</Text>
                    <Text style={styles.modalSubText}>Deseja continuar?</Text>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>Sim, Abrir</Text>
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
        shadowOffset: { width: 0, height: 2 },
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
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    urlText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#256D5B',
        textDecorationLine: 'underline',
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
    confirmButton: {
        backgroundColor: '#256D5B',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
