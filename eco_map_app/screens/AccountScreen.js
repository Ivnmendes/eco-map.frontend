import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { logout } from '../services/api';
import { DataContext } from '../context/DataProvider';
import { NotificationContext } from '../context/NotificationContext';

export default function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const { showNotification } = useContext(NotificationContext);
    const { userDetails, clearContextData } = useContext(DataContext);

    const insets = useSafeAreaInsets();

    async function handleLogout() {
        setLoading(true);
        try {
            await logout();
            clearContextData();
            navigation.replace('Login');
        } catch (error) {
            console.log(error.response?.data || error.message);
            showNotification('error', 'Ocorreu um erro interno');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Image source={require('../assets/logo.png')} style={styles.image} />
            <View style={styles.userContainer}>
                <View style={styles.fieldItem}>
                    <Ionicons name="person-circle-outline" size={40} color="gray" />
                </View>
                <View style={[styles.fieldItem, {marginLeft: 40}]}>
                    <Text style={styles.textField}>
                        Bem vindo, {userDetails.first_name} {userDetails.last_name}
                        {userDetails.is_staff ? '\nUsuário administrador' : null}
                        </Text>
                </View>
            </View>
            <View style={styles.separator}/>
            <View style={styles.buttonsView}>
                {userDetails.is_staff && (
                    <TouchableOpacity onPress={() => navigation.navigate('AddCategoryForm')} disabled={loading} style={styles.button}>
                        <Text style={styles.buttonText}>Adicionar categoria</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleLogout} disabled={loading} style={styles.button}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sair</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'flex-start', 
        marginTop: "15%",
        paddingHorizontal: 20, 
    },
    image: {
        width: 300,
        height: 300,
        alignSelf: 'center',
        marginBottom: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fieldItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 1,
        marginRight: 10,
    },
    textField: {
        fontSize: 18,
        marginVertical: 5,
        textAlign: 'center',
    },
    buttonsView: {
        marginTop: '5%'
    },
    bottomButtonsView: {
        marginTop: 'auto',
        marginBottom: 300,
    },
    button: {
        backgroundColor: '#256D5B',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
        marginBottom: 70,
    },
});