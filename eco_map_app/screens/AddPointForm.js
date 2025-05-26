import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, Button, Alert, StyleSheet, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { DataContext } from '../context/DataContext';

import { addPoint } from '../services/ecoPointService';

export default function AddPointForm({ route, navigation }) {
    const { latitude, longitude } = route.params || null;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [postcode, setPostcode] = useState('');
    const { collectionTypes, userDetails } = useContext(DataContext);
    const [selectedValue, setSelectedValue] = useState(collectionTypes.results[0]?.id);
    const [loading, setLoading] = useState(false);

    const withoutAddress = latitude && longitude;

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
      
            let point;
            
            if (withoutAddress) {
                const roundedLatitude = latitude.toFixed(6);
                const roundedLongitude = longitude.toFixed(6);
                point = {
                    name,
                    description,
                    latitude: roundedLatitude,
                    longitude: roundedLongitude,
                    types: [Number(selectedValue)],
                };
            } else {
                point = {
                    name, 
                    description,
                    types: [Number(selectedValue)],
                    street,
                    number,
                    postcode,
                    neighborhood
                }
            }
            
            await addPoint(point);

            Alert.alert('Sucesso', 'Ponto adicionado.');
            navigation.replace('Main');
        } catch (error) {
            console.log(error.response.data);
            Alert.alert('Erro', 'Falha ao adicionar ponto.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.containerAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.container}>
                        <View style={styles.sector}></View>
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
                        {!withoutAddress ? (
                            <>
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>Insira o endereço:</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Rua</Text>
                                </View>
                                <TextInput
                                    placeholder="ex: Rua Brasil"
                                    value={street}
                                    onChangeText={setStreet}
                                    style={styles.input}
                                />
                                <View style={styles.numberPostcodeContainer}>
                                    <View style={styles.fieldWrapper}>
                                        <Text style={styles.label}>Número</Text>
                                        <TextInput
                                            placeholder="ex: 1299"
                                            value={number}
                                            onChangeText={setNumber}
                                            style={[styles.input, styles.numberInput]}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={styles.fieldWrapper}>
                                        <Text style={styles.label}>CEP</Text>
                                        <TextInput
                                            placeholder="ex: 97105-030"
                                            value={postcode}
                                            onChangeText={setPostcode}
                                            style={[styles.input, styles.postcodeInput]}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Bairro</Text>
                                </View>
                                <TextInput
                                    placeholder="ex: Camobi"
                                    value={neighborhood}
                                    onChangeText={setNeighborhood}
                                    style={styles.input}
                                />
                            </>
                        ) : (
                            <></>
                        )}
                        <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.customButton}>
                            <Text style={styles.buttonText}>
                                {loading ? 'Carregando...' : 'Salvar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    containerAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1, 
        paddingVertical: 18,
    },
    container: { 
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center', 
        padding: 16 
    },
    labelContainer: {
        alignSelf: 'flex-start',
        marginLeft: 55
    },
    input: {
        width: '75%',
        borderWidth: 1,
        borderColor: '#888',
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
    },
    textContainer: {
        marginVertical: '20',
    },
    numberPostcodeContainer: {
        width: '75%',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'flex-start', 
        alignSelf: 'flex-start',
        marginLeft: 50,
    },
    fieldWrapper: { 
        flexDirection: 'column', 
    },
    numberInput: {
        width: 120,
    },
    postcodeInput: {
        width: 120,
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
