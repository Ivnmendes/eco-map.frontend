import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';

export default function FormOperatingHours({ operatingHours, onOperatingHoursChange, DAYS_OF_WEEK_CONFIG }) {

    const handleCheckBoxChange = (dayId) => {
        const dayData = operatingHours[dayId];
        const newSelectedState = !dayData.selected;

        if (dayId === 8) { 
            onOperatingHoursChange(dayId, { selected: newSelectedState, open: operatingHours[dayId].open, close: operatingHours[dayId].close });
            for (let id = 1; id <= 5; id++) {
                onOperatingHoursChange(id, { selected: newSelectedState, open: operatingHours[dayId].open, close: operatingHours[dayId].close });
            }
        } else {
            onOperatingHoursChange(dayId, { selected: newSelectedState });
        }
    };

    const handleTimeChange = (dayId, timeType, value) => {
        const formattedTime = formatTime(value);
        if (dayId === 8 && operatingHours[8].selected) {
            onOperatingHoursChange(dayId, { [timeType]: formattedTime });
            for (let id = 1; id <= 5; id++) {
                onOperatingHoursChange(id, { [timeType]: formattedTime });
            }
        } else {
            onOperatingHoursChange(dayId, { [timeType]: formattedTime });
        }
    };

    const formatTime = (text) => {
        const cleaned = text.replace(/[^\d]/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
        return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    };

    const renderDayRow = (day, isUtilityDay = false) => {
        const dayData = operatingHours[day.id];
        return (
            <View key={day.id} style={[styles.dayRow, dayData.selected && styles.dayRowSelected]}>
                <TouchableOpacity style={styles.checkboxContainer} onPress={() => handleCheckBoxChange(day.id)}>
                    <CheckBox value={dayData.selected} onValueChange={() => handleCheckBoxChange(day.id)} color={dayData.selected ? '#256D5B' : '#888'} />
                    <Text style={styles.dayLabel}>{day.label}</Text>
                </TouchableOpacity>
                <View style={styles.timeInputsContainer}>
                    <TextInput
                        style={[styles.dayInput, !dayData.selected && styles.dayInputDisabled]}
                        value={dayData.open}
                        onChangeText={(text) => handleTimeChange(day.id, 'open', text)}
                        placeholder="Abre"
                        maxLength={5}
                        keyboardType="numeric"
                        editable={dayData.selected}
                    />
                    <TextInput
                        style={[styles.dayInput, !dayData.selected && styles.dayInputDisabled]}
                        value={dayData.close}
                        onChangeText={(text) => handleTimeChange(day.id, 'close', text)}
                        placeholder="Fecha"
                        maxLength={5}
                        keyboardType="numeric"
                        editable={dayData.selected}
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.formContent}>
            <Text style={styles.title}>Horário de Funcionamento</Text>
            {DAYS_OF_WEEK_CONFIG.map(day => renderDayRow(day))}
            <View style={styles.separator} />
            {renderDayRow({ id: 8, label: 'Dias úteis' }, true)}
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
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        backgroundColor: '#FFF',
    },
    dayRowSelected: {
        borderColor: '#256D5B',
        backgroundColor: '#F0F8F5',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.2,
    },
    dayLabel: {
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
    timeInputsContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
    },
    dayInput: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 40,
        width: 75,
        textAlign: 'center',
        marginLeft: 8,
        backgroundColor: '#FFF',
    },
    dayInputDisabled: {
        backgroundColor: '#F0F0F0',
        color: '#AAA',
    },
    separator: {
        height: 1,
        backgroundColor: '#DDD',
        marginVertical: 15,
    },
});
