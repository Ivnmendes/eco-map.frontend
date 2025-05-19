import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, Alert } from 'react-native';
import axios from 'axios';
import { getAccessToken, getRefreshToken, clearTokens } from '../utils/auth';
import { API_URL } from '../constants';

export default function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);

        try {
            const access = await getAccessToken();
            const refresh = await getRefreshToken();

            const response = await axios.post(
                `${API_URL}/accounts/logout/`,
                { refresh },
                {
                  headers: {
                    Authorization: `Bearer ${access}`
                  },
                }
              );
            await clearTokens();
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro interno');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Button title={loading ? 'Carregando...' : 'Sair'} onPress={handleLogout} disabled={loading}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    input: {
      borderWidth: 1,
      borderColor: '#888',
      marginBottom: 12,
      padding: 10,
      borderRadius: 5,
    },
});