import React, { useState, useContext, useRef } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from 'react-native';

import { register } from '../services/api';
import { NotificationContext } from '../context/NotificationContext';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
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
    const { showNotification } = useContext(NotificationContext);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const shakeAnimationFirstName = useRef(new Animated.Value(0)).current;
    const shakeAnimationLastName = useRef(new Animated.Value(0)).current;
    const shakeAnimationEmail = useRef(new Animated.Value(0)).current;
    const shakeAnimationPassword = useRef(new Animated.Value(0)).current;
    const shakeAnimationConfirmPassword = useRef(new Animated.Value(0)).current;

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
        const isFirstNameValid = firstName.trim() !== '' && firstName.length <= 30;
        const isLastNameValid = lastName.trim() !== '' && lastName.length <= 150;
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = password.length >= 8 && !/^\d+$/.test(password);
        const doPasswordsMatch = password === confirmPassword;

        const newErrors = {
            firstName: !isFirstNameValid,
            lastName: !isLastNameValid,
            email: !isEmailValid,
            password: !isPasswordValid,
            confirmPassword: !doPasswordsMatch || !confirmPassword,
        };

        setErrors(newErrors);

        if (newErrors.firstName) triggerShake(shakeAnimationFirstName);
        if (newErrors.lastName) triggerShake(shakeAnimationLastName);
        if (newErrors.email) triggerShake(shakeAnimationEmail);
        if (newErrors.password) triggerShake(shakeAnimationPassword);
        if (newErrors.confirmPassword) triggerShake(shakeAnimationConfirmPassword);

        return !Object.values(newErrors).some(Boolean);
    }

    async function handleRegister() {
        Keyboard.dismiss();
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
                showNotification('success', 'Conta criada com sucesso!');
                navigation.replace('Main');
            } catch (error) {
                if (error.response && error.response.data && error.response.data.email) {
                    showNotification('error', 'Este email já está cadastrado. Tente outro.');
                    setErrors(prevErrors => ({ ...prevErrors, email: true }));
                    triggerShake(shakeAnimationEmail);
                } else {
                    showNotification('error', 'Registro de conta falhou. Verifique os campos.');
                }
            } finally {
                setLoading(false);
            }
        }
    }

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
                <Text style={styles.title}>Crie sua Conta</Text>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Primeiro nome</Text>
                    {errors.firstName && <Text style={styles.errorText}> (obrigatório, máx. 30 caracteres)</Text>}
                </View>
                <Animated.View style={[{ transform: [{ translateX: shakeAnimationFirstName }] }, styles.inputWrapper]}>
                    <TextInput
                        placeholder="Ex: João"
                        value={firstName}
                        onChangeText={setFirstName}
                        style={[styles.input, errors.firstName && styles.inputError]}
                    />
                </Animated.View>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Último nome</Text>
                    {errors.lastName && <Text style={styles.errorText}> (obrigatório, máx. 150 caracteres)</Text>}
                </View>
                <Animated.View style={[{ transform: [{ translateX: shakeAnimationLastName }] }, styles.inputWrapper]}>
                    <TextInput
                        placeholder="Ex: Silva"
                        value={lastName}
                        onChangeText={setLastName}
                        style={[styles.input, errors.lastName && styles.inputError]}
                    />
                </Animated.View>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Email</Text>
                    {errors.email && <Text style={styles.errorText}> (formato inválido ou já existente)</Text>}
                </View>
                <Animated.View style={[{ transform: [{ translateX: shakeAnimationEmail }] }, styles.inputWrapper]}>
                    <TextInput
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChangeText={setEmail}
                        style={[styles.input, errors.email && styles.inputError]}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </Animated.View>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Senha</Text>
                    {errors.password && <Text style={styles.errorText}> (mínimo 8 caracteres, não apenas números)</Text>}
                </View>
                <Animated.View style={[{ transform: [{ translateX: shakeAnimationPassword }] }, styles.passwordContainer]}>
                    <TextInput
                        placeholder="Crie uma senha forte"
                        value={password}
                        onChangeText={setPassword}
                        style={[styles.input, errors.password && styles.inputError]}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showButton}>
                        <Ionicons name={!showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color={'#256D5B'}/>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Confirme sua senha</Text>
                    {errors.confirmPassword && <Text style={styles.errorText}> (as senhas não correspondem)</Text>}
                </View>
                <Animated.View style={[{ transform: [{ translateX: shakeAnimationConfirmPassword }] }, styles.passwordContainer]}>
                    <TextInput
                        placeholder="Repita a senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={[styles.input, errors.confirmPassword && styles.inputError]}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.showButton}>
                        <Ionicons name={!showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color={'#256D5B'}/>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.customButton}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Criar conta</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Já tem uma conta?</Text>
                    <TouchableOpacity onPress={() => navigation.replace('Login')} disabled={loading}>
                        <Text style={styles.loginButtonText}>Faça o login</Text>
                    </TouchableOpacity>
                </View>
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
        alignItems: 'center',
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
        width: '90%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 4,
    },
    inputWrapper: {
        width: '90%',
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
        marginBottom: 16,
    },
    inputError: {
        borderColor: '#E53E3E',
    },
    passwordContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    showButton: {
        position: 'absolute',
        right: 15,
        top: 13,
        height: 30,
    },
    customButton: {
        width: '90%',
        backgroundColor: '#256D5B',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
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
    loginContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    loginText: {
        color: '#666',
    },
    loginButtonText: {
        color: '#256D5B',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});
