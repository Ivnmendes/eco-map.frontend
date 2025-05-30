import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native';
import MultiSelectDropdown from './MultiSelectDropdown'; 

export default function FormBasicInfo({
    name, setName,
    description, setDescription,
    selectedTypes, setSelectedTypes,
    isDropdownOpen, setIsDropdownOpen
}) {

    return (
        <View style={styles.formContent}>
            <View style={styles.fieldContainer}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Nome</Text>
                </View>
                <TextInput
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />
            </View>
            <View style={styles.fieldContainer}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Descrição</Text>
                </View>
                <TextInput
                    placeholder="Descrição"
                    value={description}
                    onChangeText={setDescription}
                    style={styles.input}
                />
            </View>
            <View style={styles.fieldContainer}>
                <MultiSelectDropdown 
                    value={selectedTypes} 
                    setValue={setSelectedTypes}
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
        justifyContent: 'center', 
        padding: '10%',
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
});