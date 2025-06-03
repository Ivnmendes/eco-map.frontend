import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';


export default function FormAddress({
    values,
    onFieldChange,
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
                    value={values.street}
                    onChangeText={(text) => onFieldChange('street', text)}
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
                            value={values.number}
                            onChangeText={(text) => onFieldChange('number', text)}
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
                            value={values.postcode}
                            onChangeText={(text) => onFieldChange('postcode', text)}
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
                    value={values.neighborhood}
                    onChangeText={(text) => onFieldChange('neighborhood', text)}
                    style={styles.input}
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