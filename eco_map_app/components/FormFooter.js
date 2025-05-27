import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FormFooter({ handleSubmit, loading, isDropdownOpen }) {
    const showButton = !isDropdownOpen;

    return (
        <View style={styles.formFooter}>
            {showButton ? (
                <TouchableOpacity 
                    onPress={handleSubmit} 
                    disabled={loading}
                    style={[
                        styles.customButton, 
                        loading && styles.loadingButton 
                    ]}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Carregando...' : 'Salvar'}
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.buttonPlaceholder} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    formFooter: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    customButton: {
        width: '50%',
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0,
    },
    loadingButton: { 
        backgroundColor: '#A5D6A7',
    },
    buttonPlaceholder: { 
        width: '50%',
        padding: 12,        
        borderRadius: 8,    
        marginVertical: 8,  
    },
});