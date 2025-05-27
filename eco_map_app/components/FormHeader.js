import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import MultiSelectDropdown from './MultiSelectDropdown';

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
});