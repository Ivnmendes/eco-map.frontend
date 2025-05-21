import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, Alert } from 'react-native';

import { logout } from '../services/api';

export default function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        try {
          await logout();
          navigation.replace('Login');
        } catch (error) {
          console.log(error.response?.data || error.message);
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