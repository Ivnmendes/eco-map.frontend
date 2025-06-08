import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, PanResponder, Animated, Dimensions } from 'react-native';
import { DataContext } from '../context/DataProvider';
import CheckBox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MultiSelectModal({ selectedItems, onSelectionChange, hasError }) { 
    const { collectionTypes } = useContext(DataContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [items, setItems] = useState([]);
    const [tempSelection, setTempSelection] = useState(selectedItems || []);

    const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        if (collectionTypes?.results) {
            setItems(collectionTypes.results.map(type => ({
                label: type.name,
                value: type.id
            })));
        }
    }, [collectionTypes]);
    
    const slideUp = () => {
        Animated.timing(panY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    const slideDown = (callback) => {
        Animated.timing(panY, {
            toValue: SCREEN_HEIGHT,
            duration: 300, 
            useNativeDriver: true,
        }).start(callback);
    };

    useEffect(() => {
        if (modalVisible) {
            setTempSelection(selectedItems || []);
            slideUp();
        }
    }, [modalVisible]);

    const closeModal = () => {
        slideDown(() => setModalVisible(false));
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                if (gestureState.dy > 0) {
                    panY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 100) {
                    closeModal();
                } else {
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleConfirm = () => {
        onSelectionChange(tempSelection);
        closeModal();
    };

    const handleCancel = () => {
        setTempSelection(selectedItems || []);
        closeModal();
    };
    
    const getLabelForValue = (value) => {
        const item = items.find(i => i.value === value);
        return item ? item.label : '';
    };

    const handleToggleItem = (itemValue) => {
        setTempSelection(currentSelection => 
            currentSelection.includes(itemValue)
                ? currentSelection.filter(v => v !== itemValue)
                : [...currentSelection, itemValue]
        );
    };

    return (
        <View>
            <TouchableOpacity style={[styles.triggerButton, hasError && styles.inputError]} onPress={() => setModalVisible(true)}>
                {selectedItems.length > 0 ? (
                     <View style={styles.badgeContainer}>
                        {selectedItems.map(value => (
                            <View key={value} style={styles.badge}>
                                <Text style={styles.badgeText}>{getLabelForValue(value)}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.placeholderText}>Selecione as categorias</Text>
                )}
                <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View style={[styles.modalContent, { transform: [{ translateY: panY }] }]}>
                        <View {...panResponder.panHandlers} style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>
                        <Text style={styles.modalTitle}>Selecione os Tipos</Text>
                        <FlatList
                            data={items}
                            keyExtractor={item => item.value.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.optionRow} onPress={() => handleToggleItem(item.value)}>
                                    <CheckBox
                                        value={tempSelection.includes(item.value)}
                                        onValueChange={() => handleToggleItem(item.value)}
                                        color={tempSelection.includes(item.value) ? '#256D5B' : '#888'}
                                    />
                                    <Text style={styles.optionLabel}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                                <Text style={styles.buttonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    triggerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderColor: '#CCC',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        minHeight: 50,
        marginBottom: 16,
    },
    inputError: {
        borderColor: '#E53E3E',
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    badge: {
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    badgeText: {
        color: '#333',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    handle: {
        width: 50,
        height: 5,
        backgroundColor: '#256D5B',
        borderRadius: 2.5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    optionLabel: {
        fontSize: 18,
        marginLeft: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 10,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    button: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmButton: {
        backgroundColor: '#256D5B',
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#888',
    },
});
