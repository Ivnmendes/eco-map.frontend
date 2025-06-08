import React from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import MultiSelectModal from './MultiSelectModal';
import ImagePickerComponent from './ImagePicker';

export default function FormBasicInfo({
    values, errors, onFieldChange,
    setValue, 
    shakeAnimations, showNotification
}) {
    return (
        <View style={styles.formContent}>
            <Text style={styles.title}>Dados Básicos</Text>
            
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Nome do Ponto</Text>
                {errors.name && <Text style={styles.errorText}>(obrigatório, máx. 100 caracteres)</Text>}
            </View>
            <Animated.View style={[{ transform: [{ translateX: shakeAnimations.name }] }]}>
                <TextInput
                    placeholder="Ex: Ponto de Coleta Central"
                    value={values.name}
                    onChangeText={(text) => onFieldChange('name', text)}
                    style={[styles.input, errors.name && styles.inputError]}
                    maxLength={100}
                />
            </Animated.View>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>Descrição</Text>
                {errors.description && <Text style={styles.errorText}>(máx. 500 caracteres)</Text>}
            </View>
            <Animated.View style={[{ transform: [{ translateX: shakeAnimations.description }] }]}>
                <TextInput
                    placeholder="Descreva o local e os materiais aceitos (opcional)"
                    value={values.description}
                    onChangeText={(text) => onFieldChange('description', text)}
                    style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                    multiline
                    maxLength={500}
                />
            </Animated.View>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>Imagens do Ponto</Text>
                {errors.images && <Text style={styles.errorText}>(selecione ao menos uma)</Text>}
            </View>
            <Animated.View style={[{ transform: [{ translateX: shakeAnimations.images }] }]}>
                <ImagePickerComponent
                    images={values.images}
                    setImages={(images) => onFieldChange('images', images)}
                    showNotification={showNotification}
                />
            </Animated.View>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>Tipos de Coleta</Text>
                {errors.types && <Text style={styles.errorText}>(selecione ao menos um)</Text>}
            </View>
            <Animated.View style={[{ transform: [{ translateX: shakeAnimations.types }] }]}>
                <MultiSelectModal
                    selectedItems={values.types}
                    onSelectionChange={setValue}
                    hasError={errors.types}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    formContent: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 5,
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 8,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderColor: '#CCC',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    inputError: {
        borderColor: '#E53E3E',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
});
