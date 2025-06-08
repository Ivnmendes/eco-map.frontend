import React, { useState, useContext, useRef } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from 'react-native';

import { login } from '../services/api';
import { NotificationContext } from '../context/NotificationContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });
    const { showNotification } = useContext(NotificationContext);
    const [showPassword, setShowPassword] = useState(false);

    const shakeAnimationEmail = useRef(new Animated.Value(0)).current;
    const shakeAnimationPassword = useRef(new Animated.Value(0)).current;

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
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = password.length >= 6;

        const newErrors = {
            email: !isEmailValid,
            password: !isPasswordValid,
        };

        setErrors(newErrors);

        if (!isEmailValid) {
            triggerShake(shakeAnimationEmail);
        }
        if (!isPasswordValid) {
            triggerShake(shakeAnimationPassword);
        }

        return isEmailValid && isPasswordValid;
    }

    async function handleLogin() {
        Keyboard.dismiss(); 
        if (validateFields()) {
            setLoading(true);
            try {
                await login(email, password);
                navigation.replace('Main');
            } catch (error) {
                showNotification('error', 'Login falhou. Verifique suas credenciais.');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Image source={require('../assets/logo.png')} style={styles.image} />
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Email</Text>
                </View>
                <Animated.View style={[{ transform: [{ translateX: shakeAnimationEmail }] }, styles.inputContainer]}>
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
                    {errors.password && <Text style={styles.errorText}> (mínimo 6 caracteres)</Text>}
                </View>
                <Animated.View style={styles.passwordContainer}>
                    <Animated.View style={[{ flex: 1 }, { transform: [{ translateX: shakeAnimationPassword }] }]}>
                        <TextInput
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                            style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                            secureTextEntry={!showPassword}
                        />
                    </Animated.View>
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.showButton}
                    >
                        <Ionicons name={!showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color={'#256D5B'}/>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.customButton}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>
                        Ainda não tem uma conta?
                    </Text>
                    <TouchableOpacity onPress={() => navigation.replace('Register')} disabled={loading}>
                        <Text style={styles.registerButtonText}>
                            Crie sua conta
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 250,
        height: 250,
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 20,
    },
    keyboardView: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: '30%',
        paddingHorizontal: 24,
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
    },
    inputContainer: {
        width: '91%',
        marginBottom: 12,
        borderRadius: 8,
        overflow: 'hidden',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderColor: '#CCC',
        marginBottom: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '91%',
    },
    showButton: {
        position: 'absolute',
        right: 15,
        top: 14,
        height: 30,
    },
    inputError: {
        borderColor: '#E53E3E', 
        color: '#E53E3E',
    },
    customButton: {
        width: '90%',
        backgroundColor: '#256D5B',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
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
    registerContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    registerText: {
        color: '#666',
    },
    registerButtonText: {
        color: '#256D5B',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});
