import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, Button, Alert, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { DataContext } from '../context/DataContext';

import { addPoint } from '../services/ecoPointService';

export default function AddPointForm({ route, navigation }) {
    const { latitude, longitude } = route.params;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { collectionTypes, userDetails } = useContext(DataContext);
    const [selectedValue, setSelectedValue] = useState(collectionTypes.results[0]?.id);
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!name || !description) {
          Alert.alert('Erro', 'Preencha todos os campos.');
          return;
        }
      
        setLoading(true);
        try {
          if (!selectedValue) {
            Alert.alert('Erro', 'Selecione um tipo válido.');
            setLoading(false);
            return;
          }
      
          const roundedLatitude = latitude.toFixed(6);
          const roundedLongitude = longitude.toFixed(6);
      
          await addPoint({
            name,
            description,
            latitude: roundedLatitude,
            longitude: roundedLongitude,
            types: [Number(selectedValue)],
          });
      
          Alert.alert('Sucesso', 'Ponto adicionado.');
          navigation.replace('Main');
        } catch (error) {
          console.log(error.response);
          Alert.alert('Erro', 'Falha ao adicionar ponto.');
        } finally {
          setLoading(false);
        }
    }

    return (
    <View style={styles.container}>
        <View style={styles.labelContainer}>
            <Text style={styles.label}>Nome</Text>
        </View>
            <TextInput
                placeholder="Nome"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Descrição</Text>
            </View>
            <TextInput
                placeholder="Descrição"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Escolha uma opção:</Text>
            </View>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue) => setSelectedValue(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#4CAF50"
                >
                    {collectionTypes.results.map(type => (
                        <Picker.Item 
                            key={type.id} 
                            label={type.name} 
                            value={type.id} 
                        />
                    ))}
                </Picker>
            </View>
            <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.customButton}>
                <Text style={styles.buttonText}>
                    {loading ? 'Carregando...' : 'Salvar'}
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
    pickerContainer: {
        width: '75%',
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 5,
        marginBottom: 12,
        overflow: 'hidden',
    },
    picker: {
        width: '100%', 
        height: 55,
    }
});
