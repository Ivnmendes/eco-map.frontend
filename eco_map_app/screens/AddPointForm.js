import React, { useState } from 'react';
import { Alert, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import FormHeader from '../components/FormHeader';
import FormFooter from '../components/FormFooter';

import { addPoint } from '../services/ecoPointService';

export default function AddPointForm({ route, navigation }) {
    const { latitude, longitude } = route.params || {};
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [postcode, setPostcode] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const withoutAddress = latitude && longitude;

    async function handleSubmit() {
        if (!name || !description) {
            Alert.alert('Erro', 'Preencha os campos de nome e descrição.');
            return;
        }

        setLoading(true);
        try {
            if (!selectedTypes || selectedTypes.length === 0) {
                Alert.alert('Erro', 'Selecione ao menos um tipo de coleta.');
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
                    types: selectedTypes.map(Number),
                };
            } else {
                if (!street || !number || !postcode || !neighborhood) {
                    Alert.alert('Erro', 'Preencha todos os campos de endereço.');
                    setLoading(false);
                    return;
                }
                point = {
                    name,
                    description,
                    types: selectedTypes.map(Number),
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
            console.log(error.response?.data || error.message);
            Alert.alert('Erro', 'Falha ao adicionar ponto.');
        } finally {
            setLoading(false);
        }
    }

    const dummyData = [{ key: 'formContent' }];

    return (
        <KeyboardAvoidingView
            style={styles.containerAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
                <FlatList
                    data={dummyData}
                    keyExtractor={(item) => item.key}
                    renderItem={() => null}
                    ListHeaderComponent={
                        <FormHeader
                            name={name} setName={setName}
                            description={description} setDescription={setDescription}
                            selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
                            withoutAddress={withoutAddress}
                            street={street} setStreet={setStreet}
                            number={number} setNumber={setNumber}
                            postcode={postcode} setPostcode={setPostcode}
                            neighborhood={neighborhood} setNeighborhood={setNeighborhood}
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}

                        />
                    }
                    ListFooterComponent={
                        <FormFooter
                            handleSubmit={handleSubmit}
                            loading={loading}
                            isDropdownOpen={isDropdownOpen}
                        />
                    }
                    contentContainerStyle={styles.flatListContent}
                    keyboardShouldPersistTaps="handled"
                    onScrollBeginDrag={Keyboard.dismiss}
                />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    containerAvoidingView: {
        flex: 1,
    },
    flatListContent: {
        flexGrow: 1,
        paddingVertical: '20%',
        paddingHorizontal: 40,
    },
});