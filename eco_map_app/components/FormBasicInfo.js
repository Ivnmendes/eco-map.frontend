import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native';
import MultiSelectDropdown from './MultiSelectDropdown'; 
import ImagePickerComponent from './imagePicker';

export default function FormBasicInfo({
    values,
    onFieldChange,
    isDropdownOpen,
    setIsDropdownOpen,
    setValue
}) {
    return (
        <View style={styles.formContent}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Insira os dados básicos do ponto:</Text>
            </View>
            <View style={styles.fieldContainer}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Nome</Text>
                </View>
                <TextInput
                    placeholder="Nome"
                    value={values.name}
                    onChangeText={(text) => onFieldChange('name', text)}
                    style={styles.input}
                />
            </View>
            <View style={styles.fieldContainer}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Descrição</Text>
                </View>
                <TextInput
                    placeholder="Descrição"
                    value={values.description}
                    onChangeText={(text) => onFieldChange('description', text)}
                    style={styles.input}
                />
            </View>
            <ImagePickerComponent
                images={values.images} 
                setImages={(images) => onFieldChange('images', images)}
            />
            <View style={[styles.fieldContainer, isDropdownOpen && styles.dropdownContainerOpen]}>
                <MultiSelectDropdown 
                    key="multi-select-dropdown"
                    value={values.types} 
                    setValue={setValue}
                    open={isDropdownOpen}
                    setOpen={setIsDropdownOpen}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formContent: {
        flex: 1,
        justifyContent: 'flex-start', 
        paddingHorizontal: '10%',
    },
    textContainer: {
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    fieldContainer: {
        marginBottom: 20,
    },
    labelContainer: {
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    dropdownContainerOpen: {
        zIndex: 1000,
    },
});