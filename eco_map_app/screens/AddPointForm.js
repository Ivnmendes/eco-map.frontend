import React, { useState, useCallback, useContext, useRef } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableOpacity, Text, ScrollView, ActivityIndicator, Animated, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FormBasicInfo from '../components/FormBasicInfo';
import FormAddress from '../components/FormAddress';
import FormOperatingHours from '../components/FormOperatingHours';
import { NotificationContext } from '../context/NotificationContext';

import { createCollectionPoint, uploadImageForPoint } from '../services/ecoPointService';

const DAYS_OF_WEEK_CONFIG = [
    { id: 1, key: 'segunda', label: 'Segunda-feira' }, { id: 2, key: 'terca', label: 'Terça-feira' },
    { id: 3, key: 'quarta', label: 'Quarta-feira' }, { id: 4, key: 'quinta', label: 'Quinta-feira' },
    { id: 5, key: 'sexta', label: 'Sexta-feira' }, { id: 6, key: 'sabado', label: 'Sábado' },
    { id: 7, key: 'domingo', label: 'Domingo' },
];

const getInitialOperatingHours = () => {
    const initialState = {};
    [...DAYS_OF_WEEK_CONFIG, { id: 8, label: 'Dia útil' }].forEach(day => {
        initialState[day.id] = { name: day.label, selected: false, open: '', close: '' };
    });
    return initialState;
};

const getInitialErrors = () => ({
    name: false, description: false, types: false, images:false,
    street: false, number: false, postcode: false, neighborhood: false,
    operatingHours: {}
});

const ActualStep = ({ step }) => (
    <View style={styles.stepperContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={[styles.defaultCircle, index + 1 <= step ? styles.filledCircle : {}]} />
        ))}
    </View>
);

export default function AddPointForm({ route, navigation }) {
    const { latitude, longitude } = route.params || {};
    const [loading, setLoading] = useState(false);
    const { showNotification } = useContext(NotificationContext);
    const [step, setStep] = useState(1);
    const withoutAddress = latitude && longitude;

    const insets = useSafeAreaInsets();

    const [formData, setFormData] = useState({
        name: '', description: '', latitude: latitude || '', longitude: longitude || '',
        street: '', number: '', postcode: '', neighborhood: '',
        types: [], images: [], operatingHours: getInitialOperatingHours(),
    });
    const [errors, setErrors] = useState(getInitialErrors());

    const shakeAnimations = {
        name: useRef(new Animated.Value(0)).current,
        description: useRef(new Animated.Value(0)).current,
        types: useRef(new Animated.Value(0)).current,
        images: useRef(new Animated.Value(0)).current,
        street: useRef(new Animated.Value(0)).current,
        number: useRef(new Animated.Value(0)).current,
        postcode: useRef(new Animated.Value(0)).current,
        neighborhood: useRef(new Animated.Value(0)).current,
    };

    const triggerShake = (animationValue) => {
        animationValue.setValue(0);
        Animated.sequence([
            Animated.timing(animationValue, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(animationValue, { toValue: -10, duration: 80, useNativeDriver: true }),
            Animated.timing(animationValue, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(animationValue, { toValue: 0, duration: 80, useNativeDriver: true }),
        ]).start();
    };
    
    const handleFieldChange = (fieldName, value) => {
        setFormData(currentData => ({ ...currentData, [fieldName]: value }));
        if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: false }));
    };

    const handleOperatingHoursChange = (dayId, newValues) => {
        setFormData(currentData => ({
            ...currentData,
            operatingHours: { ...currentData.operatingHours, [dayId]: { ...currentData.operatingHours[dayId], ...newValues } }
        }));
    };

    const memoizedSetValue = useCallback((updater) => {
        setFormData(currentData => ({ ...currentData, types: typeof updater === 'function' ? updater(currentData.types) : updater || [] }));
        if (errors.types) setErrors(prev => ({ ...prev, types: false }));
    }, [errors.types]);

    const validateStep = (currentStep) => {
        const newErrors = { ...getInitialErrors(), operatingHours: {} };
        let isValid = true;

        switch (currentStep) {
            case 1:
                if (formData.name.trim() === '' || formData.name.length > 100) {
                    newErrors.name = true;
                    triggerShake(shakeAnimations.name);
                    isValid = false;
                }
                if (formData.description.length > 500) {
                    newErrors.description = true;
                    triggerShake(shakeAnimations.description);
                    isValid = false;
                }
                if (formData.types.length === 0) {
                    newErrors.types = true;
                    triggerShake(shakeAnimations.types);
                    isValid = false;
                }
                if (formData.images.length === 0) {
                    newErrors.images = true;
                    triggerShake(shakeAnimations.images);
                    isValid = false;
                }
                break;
            case 2:
                if (formData.street.trim() === '') { newErrors.street = true; triggerShake(shakeAnimations.street); isValid = false; }
                if (formData.number.trim() === '') { newErrors.number = true; triggerShake(shakeAnimations.number); isValid = false; }
                if (formData.postcode.trim() === '') { newErrors.postcode = true; triggerShake(shakeAnimations.postcode); isValid = false; }
                if (formData.neighborhood.trim() === '') { newErrors.neighborhood = true; triggerShake(shakeAnimations.neighborhood); isValid = false; }
                break;
        }
        setErrors(newErrors);
        return isValid;
    };
    
    async function handleSubmit() {
        if (!validateStep(1) || (!withoutAddress && !validateStep(2))) {
            showNotification('error', 'Existem erros nos passos anteriores. Por favor, verifique.');
            return;
        }
        
        setLoading(true);
        try {
            const pointData = { ...formData };
            const newPoint = await createCollectionPoint(pointData);
            
            if (formData.images.length > 0) {
                showNotification("success", "Ponto Criado! A fazer upload das imagens...");
                const uploadPromises = formData.images.map(imageAsset => uploadImageForPoint(newPoint.id, imageAsset));
                await Promise.all(uploadPromises);
            }
            
            showNotification('success', 'Ponto de coleta adicionado com sucesso!');
            setTimeout(() => navigation.replace('Main'), 1500);
        } catch (error) {
            if (error.response?.data?.name) {
                showNotification('error', 'Um ponto de coleta com este nome já existe.');
                setErrors(prev => ({ ...prev, name: true }));
                triggerShake(shakeAnimations.name);
                setStep(1);
            } else {
                showNotification('error', 'Falha ao adicionar ponto.');
            }
        } finally {
            setLoading(false);
        }
    }

    function nextStep() {
        if (!validateStep(step)) {
            showNotification('error', 'Por favor, corrija os campos marcados.');
            return;
        }
        if (step === 1 && withoutAddress) {
            setStep(3);
        } else if (step < 3) {
            setStep(step + 1);
        }
    }

    function prevStep() {
        if (step === 3 && withoutAddress) setStep(1);
        else if (step > 1) setStep(step - 1);
    }
    
    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView
                style={styles.containerAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContentContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <ActualStep step={step} />
                    {step === 1 && (
                        <FormBasicInfo
                            values={formData}
                            errors={errors}
                            onFieldChange={handleFieldChange}
                            setValue={memoizedSetValue}
                            shakeAnimations={shakeAnimations}
                            showNotification={showNotification}
                        />
                    )}
                    {step === 2 && !withoutAddress && (
                        <FormAddress
                            values={formData}
                            errors={errors}
                            onFieldChange={handleFieldChange}
                            shakeAnimations={shakeAnimations}
                        />
                    )}
                    {step === 3 && (
                        <FormOperatingHours
                            operatingHours={formData.operatingHours}
                            onOperatingHoursChange={handleOperatingHoursChange}
                            DAYS_OF_WEEK_CONFIG={DAYS_OF_WEEK_CONFIG}
                        />
                    )}
                </ScrollView>
                <View style={styles.buttonsView}>
                    <TouchableOpacity style={[styles.button, styles.backButton, step === 1 && styles.disabledButton]} onPress={prevStep} disabled={step === 1}>
                        <Text style={styles.textButton}>Voltar</Text>
                    </TouchableOpacity>
                    {step !== 3 ? (
                        <TouchableOpacity style={[styles.button, styles.goButton]} onPress={nextStep}>
                            <Text style={styles.textButton}>Avançar</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={[styles.button, styles.goButton]} onPress={handleSubmit} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textButton}>Enviar</Text>}
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


// --- Styles ---
const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#F5F5F5' 
    },
    containerAvoidingView: { 
        flex: 1 
    },
    scrollView: { 
        flex: 1 
    },
    scrollContentContainer: { 
        flexGrow: 1, 
        paddingBottom: 20 
    },
    buttonsView: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, paddingVertical: 15, 
        borderTopWidth: 1, 
        borderTopColor: '#e0e0e0', 
        backgroundColor: '#F5F5F5' 
    },
    button: { 
        borderRadius: 50, 
        paddingVertical: 12, 
        paddingHorizontal: 30, 
        backgroundColor: '#256D5B', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    textButton: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    backButton: { 
        backgroundColor: '#256D5B' 
    },
    goButton: {},
    disabledButton: { 
        opacity: 0.5 
    },
    stepperContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginVertical: 30 
    },
    defaultCircle: { 
        width: 12, 
        height: 12, 
        borderRadius: 6, 
        backgroundColor: '#ccc', 
        marginHorizontal: 8 
    },
    filledCircle: { 
        backgroundColor: '#256D5B' 
    },
});
