import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';


export default function FormAddress({
    street, setStreet,
    number, setNumber,
    postcode, setPostcode,
    neighborhood, setNeighborhood,
}) {
    return (
        <View style={styles.formContent}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    formContent: {
        flex: 1,
        justifyContent: 'center',
        padding: '10%',
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
        fontWeight: '600',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    numberPostcodeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fieldWrapper: {
        flex: 1,
        marginRight: 10,
    },
    textContainerNumber: {
        marginBottom: 5,
    },
    numberInput: {
        width: '100%',
    },
    postcodeInput: {
        width: '100%',
    },
});