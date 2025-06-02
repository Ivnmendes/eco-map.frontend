import React, { useState } from 'react';
import { Alert, StyleSheet, View, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity, Text } from 'react-native';

import FormBasicInfo from '../components/FormBasicInfo';
import FormAddress from '../components/FormAddress';
import FormOperatingHours from '../components/FormOperatingHours';

import { addPoint } from '../services/ecoPointService';

const DAYS_OF_WEEK_CONFIG = [
    { id: 1, key: 'segunda', label: 'Segunda-feira' },
    { id: 2, key: 'terca', label: 'Terça-feira' },
    { id: 3, key: 'quarta', label: 'Quarta-feira' },
    { id: 4, key: 'quinta', label: 'Quinta-feira' },
    { id: 5, key: 'sexta', label: 'Sexta-feira' },
    { id: 6, key: 'sabado', label: 'Sábado' },
    { id: 7, key: 'domingo', label: 'Domingo' },
];

const ActualStep = ({ step }) => {
  const nSteps = 3;
  return (
    <View style={styles.stepperContainer}>
      {Array.from({ length: nSteps }).map((_, index) => {
        const actualStep = index + 1;

        const circleStyle = [
          styles.defaultCircle,
          actualStep <= step ? styles.filledCircle : styles.notFilledCircle,
        ];

        return (
          <View key={actualStep} style={circleStyle} />
        );
      })}
    </View>
  );
};

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
    const [operatingHours, setOperatingHours] = useState(() => {
        const initialState = {};
        DAYS_OF_WEEK_CONFIG.forEach(day => {
            initialState[day.id] = {
                name: day.label,
                selected: false,
                open: '',
                close: ''
            };
        });
        initialState[8] = {
            name: 'Dia útil',
            selected: false,
            open: '',
            close: ''
        };

        return initialState;
    });
    const [step, setStep] = useState(1);

    const withoutAddress = latitude && longitude;

    async function handleSubmit() {
        setLoading(true);
        try {
            let point;

            if (withoutAddress) {
                const roundedLatitude = latitude.toFixed(6);
                const roundedLongitude = longitude.toFixed(6);
                point = {
                    name,
                    description,
                    types: selectedTypes.map(Number),
                    operatingHours,
                    latitude: roundedLatitude,
                    longitude: roundedLongitude,
                };
            } else {
                point = {
                    name,
                    description,
                    types: selectedTypes.map(Number),
                    operatingHours,
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

    function nextStep() {
        if (step === 1) {
            if (!name || !description || selectedTypes.length === 0) {
                alert('Preencha nome, descrição e selecione ao menos um tipo.');
                return;
            }
            if (withoutAddress) {
                return setStep(3);
            }
        }
        if (step === 2) {
            if (!street || !number || !postcode || !neighborhood) {
                alert('Preencha todos os campos do endereço.');
                return;
            }
        }

        setStep(step + 1);
    }

    function prevStep() {
        if (step === 3 && withoutAddress) setStep(1);
        else if (step > 1) setStep(step - 1);
    }

    return (
        <KeyboardAvoidingView
            style={styles.containerAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ActualStep step={step} />
            {step === 1 && (
                <FormBasicInfo
                name={name} setName={setName}
                description={description} setDescription={setDescription}
                selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
                isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}
                />
            )}
            {step === 2 && (
                <FormAddress
                street={street} setStreet={setStreet}
                number={number} setNumber={setNumber}
                postcode={postcode} setPostcode={setPostcode}
                neighborhood={neighborhood} setNeighborhood={setNeighborhood}
                />
            )}
            {step === 3 && (
                <FormOperatingHours
                operatingHours={operatingHours} setOperatingHours={setOperatingHours}
                DAYS_OF_WEEK_CONFIG={DAYS_OF_WEEK_CONFIG}
                />
            )}

            <View style={styles.buttonsView}>
                {step !== 1 ? (
                    <TouchableOpacity style={[styles.backButton, styles.button]} onPress={prevStep}>
                        <Text style={styles.textButton}>Voltar</Text>
                    </TouchableOpacity>
                ) : (
                    <View></View>
                )}
                
                {step !== 3 ? (
                    <TouchableOpacity style={[styles.goButton, styles.button]} onPress={nextStep}>
                        <Text style={styles.textButton}>Avançar</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.goButton, styles.button]} onPress={handleSubmit}>
                        <Text style={styles.textButton}>Enviar</Text>
                    </TouchableOpacity>
                )}

            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    containerAvoidingView: {
        flex: 1,
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    goButton: {
        alignSelf: 'flex-end',
    },
    backButton: {
        alignSelf: 'flex-start',
    },
    button: {
        width: 130,
        borderRadius: 50,
        padding: 10,
        backgroundColor: 'green',
    },
    textButton: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    stepperContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 50,
        padding: 10,
    },
    defaultCircle: {
        width: 12, 
        height: 12,
        borderRadius: 6, 
        borderWidth: 1,
        borderColor: '#aaa',
        marginHorizontal: 5,
    },
    filledCircle: {
        backgroundColor: 'green',
        borderColor: '#aaa',
    },
    notFilledCircle: {
        backgroundColor: 'transparent',
        borderColor: '#aaa',
    },
});