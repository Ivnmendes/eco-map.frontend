import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import MultiSelectDropdown from './MultiSelectDropdown';
import CheckBox from 'expo-checkbox';

const DAYS_OF_WEEK_CONFIG = [
    { id: 1, key: 'segunda', label: 'Segunda-feira' },
    { id: 2, key: 'terca', label: 'Terça-feira' },
    { id: 3, key: 'quarta', label: 'Quarta-feira' },
    { id: 4, key: 'quinta', label: 'Quinta-feira' },
    { id: 5, key: 'sexta', label: 'Sexta-feira' },
    { id: 6, key: 'sabado', label: 'Sábado' },
    { id: 7, key: 'domingo', label: 'Domingo' },
];
  

export default function FormHeader({
    name, setName,
    description, setDescription,
    selectedTypes, setSelectedTypes,
    withoutAddress,
    street, setStreet,
    number, setNumber,
    postcode, setPostcode,
    neighborhood, setNeighborhood,
    isDropdownOpen, setIsDropdownOpen
}) {
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

        return initialState;
    });

    const handleCheckBoxChange = (dayId) => {
        setOperatingHours(prevHours => ({
            ...prevHours,
            [dayId]: {
                ...prevHours[dayId],
                selected: !prevHours[dayId].selected,
                open: !prevHours[dayId].selected ? prevHours[dayId].open : '',
                close: !prevHours[dayId].selected ? prevHours[dayId].close : '',
            }
        }));
    };

    const handleTimeChange = (dayId, timeType, value) => {
        setOperatingHours(prevHours => ({
            ...prevHours,
            [dayId]: {
                ...prevHours[dayId],
                [timeType]: value,
            }
        }));
    };
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
                {!withoutAddress ? (
                    <>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Insira o endereço:</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Rua</Text>
                            </View>
                            <TextInput
                                placeholder="ex: Rua Brasil"
                                value={street}
                                onChangeText={setStreet}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.fieldContainer}>
                            <View style={styles.numberPostcodeContainer}>
                                <View style={styles.fieldWrapper}>
                                    <View style={styles.textContainerNumber}>
                                        <Text style={styles.label}>Número</Text>
                                    </View>
                                    <TextInput
                                        placeholder="ex: 1299"
                                        value={number}
                                        onChangeText={setNumber}
                                        style={[styles.input, styles.numberInput]}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={styles.fieldWrapper}>
                                    <View style={styles.textContainerNumber}>
                                        <Text style={styles.label}>CEP</Text>
                                    </View>
                                    <TextInput
                                        placeholder="ex: 97105-030"
                                        value={postcode}
                                        onChangeText={setPostcode}
                                        style={[styles.input, styles.postcodeInput]}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.fieldContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Bairro</Text>
                            </View>
                            <TextInput
                                placeholder="ex: Camobi"
                                value={neighborhood}
                                onChangeText={setNeighborhood}
                                style={styles.input}
                            />
                        </View>
                    </>
                ) : null}
                <Text style={styles.sectionTitle}>Horário de funcionamento:</Text>
                <View style={styles.twoColumnContainer}>
                    {DAYS_OF_WEEK_CONFIG.map((day) => {
                        const dayData = operatingHours[day.id] || { selected: false, open: '', close: '' };
                        
                        return (
                            <View style={styles.dayEntrySectionColumnItem}>
                                <View key={day.id} style={styles.dayEntryWrapper}>
                                    <View style={styles.dayLabelCheckboxRow}>
                                        <Text style={styles.dayLabel}>{day.label}</Text>
                                        <CheckBox
                                            style={styles.checkBox}
                                            value={dayData.selected}
                                            onValueChange={() => handleCheckBoxChange(day.id)}
                                            color={dayData.selected ? 'green' : undefined}
                                        />
                                    </View>
                                    {dayData.selected && (
                                        <View style={styles.timeInputsContainer}>
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Abre:</Text>
                                                <TextInput
                                                    style={styles.dayInput}
                                                    value={dayData.open}
                                                    onChangeText={(text) => handleTimeChange(day.id, 'open', text)}
                                                    placeholder="HH:MM"
                                                    maxLength={4}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Fecha:</Text>
                                                <TextInput
                                                    style={styles.dayInput}
                                                    value={dayData.close}
                                                    onChangeText={(text) => handleTimeChange(day.id, 'close', text)}
                                                    placeholder="HH:MM"
                                                    maxLength={4} 
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
                <Button title="teste" onPress={() => {console.log(operatingHours)}}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    formContent: {
        flex: 1, 
        alignItems: 'flex-start',
        justifyContent: 'center', 
        padding: 1,
    },
    fieldContainer: {
        width: '100%',
        margin: '3%',
    },
    labelContainer: {
        alignSelf: 'flex-start',
        marginHorizontal: '3.5%',
        marginBottom: '0.5%',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#888',
        padding: 10,
        borderRadius: 5,
    },
    textContainer: {
        margin: '2%',
    },
    textContainerNumber: {
        marginBottom: '2%',
        marginLeft: '10%'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    numberPostcodeContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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
    checkBox: {
        marginLeft: 8,
        borderRadius: 10
    }, 
    checkBoxText: {
        margin: 8
    },
    twoColumnContainer: {
        flexDirection: 'row',   // Organiza os filhos em uma linha
        flexWrap: 'wrap',       // Permite que os itens quebrem para a próxima linha
        justifyContent: 'space-between', // Distribui espaço entre os itens.
        paddingHorizontal: 5, // Opcional: Pequeno preenchimento nas laterais do contêiner geral
    },
    dayEntrySectionColumnItem: {
        width: '90%',
        marginBottom: 15, 
    },
    dayLabelCheckboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dayEntryWrapper: { 
        flexDirection: 'column',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 8,
        width: '50%',
        backgroundColor: '#f8f4f4',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 5,
    },
    timeInputsContainer: {
        marginTop: 8,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    inputLabel: {
        fontSize: 14,
        marginRight: 8,
    },
    dayInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        width: 70,
        fontSize: 14,
    },
});