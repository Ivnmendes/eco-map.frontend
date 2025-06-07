import React, { useState, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableOpacity, Text, ScrollView, TextInput } from 'react-native';

import { createCategory } from '../services/api';
import { NotificationContext } from '../context/NotificationContext';

export default function AddCategoryForm({ route, navigation }) {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const { showNotification } = useContext(NotificationContext);

    const handleSubmit = async () => {
        if (!categoryName || !categoryDescription) {
            showNotification('error', 'Por favor, preencha todos os campos.');
            return;
        }

        await createCategory({name: categoryName, description: categoryDescription});
        showNotification('success', 'Categoria adicionada com sucesso!');
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Adicionar Categoria:</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome da Categoria</Text>
                    <TextInput
                        style={styles.input}
                        value={categoryName}
                        onChangeText={setCategoryName}
                        placeholder="Digite o nome da categoria"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={styles.input}
                        value={categoryDescription}
                        onChangeText={setCategoryDescription}
                        placeholder="Digite a descrição da categoria"
                        multiline
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Adicionar Categoria</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#256D5B',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
});