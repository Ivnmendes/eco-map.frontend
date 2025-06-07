import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet, View, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity, Text, ScrollView, FlatList } from 'react-native';

import FormBasicInfo from '../components/FormBasicInfo';
import FormAddress from '../components/FormAddress';
import FormOperatingHours from '../components/FormOperatingHours';

import { createCollectionPoint, uploadImageForPoint } from '../services/ecoPointService';

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

const getInitialOperatingHours = () => {
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
};

export default function AddPointForm({ route, navigation }) {
    const { latitude, longitude } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        latitude: latitude || '',
        longitude: longitude || '',
        street: '',
        number: '',
        postcode: '',
        neighborhood: '',
        types: [],
        images: [],
        operatingHours: getInitialOperatingHours(),
    });

    const handleFieldChange = (fieldName, value) => {
        setFormData(currentData => ({
            ...currentData,
            [fieldName]: value
        }));
    };

    const handleOperatingHoursChange = (dayId, newValues) => {
        setFormData(currentData => ({
            ...currentData,
            operatingHours: {
                ...currentData.operatingHours,
                [dayId]: {
                    ...currentData.operatingHours[dayId],
                    ...newValues
                }
            }
        }));
    };

    const memoizedSetValue = useCallback(
        (updater) => {
            setFormData(currentData => {
            const updatedTypes = typeof updater === 'function'
                ? updater(currentData.types)
                : updater;
            return {
                ...currentData,
                types: updatedTypes || [],
            };
            });
        },
        []
    );

    const [step, setStep] = useState(1);
    const withoutAddress = latitude && longitude;

    async function handleSubmit() {
        setLoading(true);

        try {
            const pointData = {
                name: formData.name,
                description: formData.description,
                latitude: formData.latitude,
                longitude: formData.longitude,
                street: formData.street,
                number: formData.number,
                postcode: formData.postcode,
                neighborhood: formData.neighborhood,
                types: formData.types,
                operatingHours: formData.operatingHours,
            };

            const newPoint = await createCollectionPoint(pointData);

            Alert.alert("Ponto criado com sucesso", "fazendo upload de imagens...");
            
            const uploadPromises = formData.images.map(imageAsset =>
                uploadImageForPoint(newPoint.id, imageAsset)
            );
            await Promise.all(uploadPromises);

            Alert.alert('Sucesso', 'Imagens adicionadas.');
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
            if (!formData.name || !formData.description || formData.types.length === 0) {
                alert('Preencha nome, descrição e selecione ao menos um tipo.');
                return;
            }
            if (withoutAddress) {
                return setStep(3);
            }
        }
        if (step === 2) {
            if (!formData.street || !formData.number || !formData.postcode || !formData.neighborhood) {
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
            <FlatList
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <>
                        <ActualStep step={step} />
                        {step === 1 && (
                            <FormBasicInfo
                                isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}
                                values={formData}
                                onFieldChange={handleFieldChange}
                                setValue={memoizedSetValue}
                            />
                        )}
                        {step === 2 && (
                            <FormAddress
                                values={formData}
                                onFieldChange={handleFieldChange}
                            />
                        )}
                        {step === 3 && (
                            <FormOperatingHours
                                DAYS_OF_WEEK_CONFIG={DAYS_OF_WEEK_CONFIG}
                                operatingHours={formData.operatingHours}
                                onOperatingHoursChange={handleOperatingHoursChange}
                            />
                        )}
                    </>
                }
                data={[]}
                renderItem={() => null}
                keyExtractor={(item, index) => index.toString()}
            /> 
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
        paddingBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: 20, 
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
        backgroundColor: '#256D5B',
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
        backgroundColor: '#256D5B',
        borderColor: '#aaa',
    },
    notFilledCircle: {
        backgroundColor: 'transparent',
        borderColor: '#aaa',
    },
});