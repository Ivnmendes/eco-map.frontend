import React, { useState, useContext, useRef } from 'react';
import { 
    StyleSheet, 
    View, 
    KeyboardAvoidingView, 
    Platform, 
    TouchableOpacity, 
    Text, 
    ScrollView, 
    TextInput,
    Animated,
    Keyboard,
    ActivityIndicator
} from 'react-native';

import { createCategory } from '../services/api';
import { NotificationContext } from '../context/NotificationContext';

export default function AddCategoryScreen({ navigation }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: false,
        description: false,
    });
    const { showNotification } = useContext(NotificationContext);

    const shakeAnimationName = useRef(new Animated.Value(0)).current;
    const shakeAnimationDescription = useRef(new Animated.Value(0)).current;

    const triggerShake = (animationValue) => {
        animationValue.setValue(0);
        Animated.sequence([
            Animated.timing(animationValue, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(animationValue, { toValue: -10, duration: 80, useNativeDriver: true }),
            Animated.timing(animationValue, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(animationValue, { toValue: 0, duration: 80, useNativeDriver: true }),
        ]).start();
    };
    
    function validateFields() {
        const isNameValid = name.trim() !== '' && name.length <= 100;
        const isDescriptionValid = description.length <= 500;

        const newErrors = {
            name: !isNameValid,
            description: !isDescriptionValid,
        };

        setErrors(newErrors);

        if (newErrors.name) triggerShake(shakeAnimationName);
        if (newErrors.description) triggerShake(shakeAnimationDescription);

        return isNameValid && isDescriptionValid;
    }

    const handleSubmit = async () => {
        Keyboard.dismiss();
        if (!validateFields()) {
            return;
        }

        setLoading(true);
        try {
            await createCategory({ name, description });
            showNotification('success', 'Categoria adicionada com sucesso!');
            navigation.goBack();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.name) {
                showNotification('error', 'Uma categoria com este nome já existe.');
                setErrors(prev => ({...prev, name: true}));
                triggerShake(shakeAnimationName);
            } else {
                showNotification('error', 'Não foi possível criar a categoria.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Adicionar Nova Categoria</Text>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Nome da Categoria</Text>
                    {errors.name && <Text style={styles.errorText}> (obrigatório, máx. 100 caracteres)</Text>}
                </View>
                <Animated.View style={[{ transform: [{ translateX: shakeAnimationName }] }, styles.inputWrapper]}>
                    <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Ex: Lixo Eletrônico"
                        maxLength={100}
                    />
                </Animated.View>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Descrição</Text>
                    {errors.description && <Text style={styles.errorText}> (máx. 500 caracteres)</Text>}
                </View>
                <Animated.View style={[{ transform: [{ translateX: shakeAnimationDescription }] }, styles.inputWrapper]}>
                    <TextInput
                        style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Descreva o tipo de item que pertence a esta categoria (opcional)"
                        multiline
                        maxLength={500}
                    />
                </Animated.View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Adicionar Categoria</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    labelContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 4,
    },
    inputWrapper: {
        width: '100%',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderColor: '#CCC',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
    },
    inputError: {
        borderColor: '#E53E3E',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    button: {
        width: '100%',
        backgroundColor: '#256D5B',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
