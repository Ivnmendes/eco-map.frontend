import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

import { register } from '../services/api';

export default function LoginScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function validateFields() {
        const newErrors = {
            firstName: !firstName.trim(),
            lastName: !lastName.trim(),
            email: !email.trim() || !email.includes('@'),
            password: !password,
            confirmPassword: !confirmPassword || confirmPassword !== password,
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    }

    async function handleRegister() {
        if (validateFields()) {
            setLoading(true);
            try {
                await register({
                  first_name: firstName,
                  last_name: lastName,
                  email,
                  password,
                  confirm_password: confirmPassword,
                });
                navigation.replace('Main');
            } catch (error) {
                Alert.alert('Erro', 'Registro de conta falhou. Verifique os campos.');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Primeiro nome</Text>
            </View>
            <TextInput
                placeholder="Primeiro nome"
                value={firstName}
                onChangeText={setFirstName}
                style={[styles.input, errors.firstName && styles.inputError]}
            />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Último nome</Text>
            </View>
            <TextInput
                placeholder="Último nome"
                value={lastName}
                onChangeText={setLastName}
                style={[styles.input, errors.lastName && styles.inputError]}
            />
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
            <View style={styles.passwordContainer}>
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
                >
                <Text style={styles.showButtonText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Confirme sua senha</Text>
            </View>
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]}
                    secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.showButton}
                >
                <Text style={styles.showButtonText}>{showConfirmPassword ? 'Ocultar' : 'Mostrar'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                    onPress={handleRegister}
                    disabled={loading}
                    style={styles.customButton}
            >
                <Text style={styles.buttonText}>{loading ? 'Carregando...' : 'Criar conta'}</Text>
            </TouchableOpacity>

            <Text>Já tem uma conta?</Text>

            <TouchableOpacity
                onPress={() => navigation.replace('Login')}
                disabled={loading}
                style={styles.customButton}
            >
                <Text style={styles.buttonText}>Entre na sua conta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center', 
        padding: 16,
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
    passwordContainer: {
        width: '75%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    passwordInput: {
        flex: 1,
    },
    showButton: {
        paddingHorizontal: 12,
        marginBottom: 10,
        paddingVertical: 10,
    },
    showButtonText: {
        color: '#007BFF',
        fontWeight: 'bold',
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
