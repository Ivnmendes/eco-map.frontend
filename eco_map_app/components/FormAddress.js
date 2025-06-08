import React from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';

export default function FormAddress({ values, errors, onFieldChange, shakeAnimations }) {
    return (
        <View style={styles.formContent}>
            <Text style={styles.title}>Endereço</Text>
            
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Rua</Text>
                {errors.street && <Text style={styles.errorText}>(obrigatório)</Text>}
            </View>
            <Animated.View style={[{ transform: [{ translateX: shakeAnimations.street }] }]}>
                <TextInput
                    placeholder="Ex: Av. Roraima"
                    value={values.street}
                    onChangeText={(text) => onFieldChange('street', text)}
                    style={[styles.input, errors.street && styles.inputError]}
                />
            </Animated.View>

            <View style={styles.rowContainer}>
                <View style={styles.fieldWrapper}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>Número</Text>
                        {errors.number && <Text style={styles.errorText}>(obrigatório)</Text>}
                    </View>
                    <Animated.View style={[{ transform: [{ translateX: shakeAnimations.number }] }]}>
                        <TextInput
                            placeholder="Ex: 1000"
                            value={values.number}
                            onChangeText={(text) => onFieldChange('number', text)}
                            style={[styles.input, errors.number && styles.inputError]}
                            keyboardType="numeric"
                        />
                    </Animated.View>
                </View>
                <View style={styles.fieldWrapper}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>CEP</Text>
                        {errors.postcode && <Text style={styles.errorText}>(obrigatório)</Text>}
                    </View>
                    <Animated.View style={[{ transform: [{ translateX: shakeAnimations.postcode }] }]}>
                        <TextInput
                            placeholder="Ex: 97105-900"
                            value={values.postcode}
                            onChangeText={(text) => onFieldChange('postcode', text)}
                            style={[styles.input, errors.postcode && styles.inputError]}
                            keyboardType="numeric"
                        />
                    </Animated.View>
                </View>
            </View>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>Bairro</Text>
                {errors.neighborhood && <Text style={styles.errorText}>(obrigatório)</Text>}
            </View>
            <Animated.View style={[{ transform: [{ translateX: shakeAnimations.neighborhood }] }]}>
                <TextInput
                    placeholder="Ex: Camobi"
                    value={values.neighborhood}
                    onChangeText={(text) => onFieldChange('neighborhood', text)}
                    style={[styles.input, errors.neighborhood && styles.inputError]}
                />
            </Animated.View>
        </View>
    );
}
const styles = StyleSheet.create({
    formContent: {
        paddingHorizontal: 24,
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fieldWrapper: {
        flex: 1,
        marginRight: 10,
    },
});
