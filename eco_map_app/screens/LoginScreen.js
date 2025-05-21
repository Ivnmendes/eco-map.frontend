import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

import { login } from '../services/api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: false,
        password: false,
        confirmPassword: false
    })

    const [showPassword, setShowPassword] = useState(false);
    
    function validateFields() {
        const newErrors = {
            email: !email.trim() || !email.includes('@'),
            password: !password
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    }

    async function handleLogin() {
        if (validateFields()) {
            setLoading(true);
            try {
                await login(email, password);
                navigation.replace('Main');
            } catch (error) {
                Alert.alert('Erro', 'Login falhou. Verifique suas credenciais.');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, errors.email && styles.inputError]}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Senha</Text>
            </View>
            <TextInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                secureTextEntry={!showPassword}
            />
            <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showButton}
            ></TouchableOpacity>
            <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.customButton}>
                <Text style={styles.buttonText}>
                    {loading ? 'Carregando...' : 'Entrar'}
                </Text>
            </TouchableOpacity>
            <Text>
                Ainda não tem uma conta? Crie uma
            </Text>
            <TouchableOpacity onPress={() => navigation.replace('Register')} disabled={loading} style={styles.customButton}>
                <Text style={styles.buttonText}>
                    Crie sua conta
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center', 
        padding: 16 
    },
    labelContainer: {
        alignSelf: 'flex-start',
        marginLeft: '55'
    },
    input: {
        width: '75%',
        borderWidth: 1,
        borderColor: '#888',
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
    },
    inputError: {
        borderColor: 'red',
        color: 'red'
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
});