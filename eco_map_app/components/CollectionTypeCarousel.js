import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CollectionTypeCarousel({ collectionTypes, onSelectCollectionType }) {
    const [selectedCategoryTypes, setSelectedCategoryTypes] = useState([]);

    function handleSelect(id) {
        setSelectedCategoryTypes((prev) =>
            prev.includes(id) ? prev : [...prev, id]
        );
    }

    function handleDeselect(id) {
        setSelectedCategoryTypes((prev) => prev.filter((item) => item !== id));
    }

    function renderItem({ item }) {
        const isSelected = selectedCategoryTypes.includes(item.id);
        return (
            <TouchableOpacity
                onPress={isSelected ? () => handleDeselect(item.id) : () => handleSelect(item.id)}
                style={[styles.button, isSelected && styles.buttonSelected]}
            >
                <Ionicons name={item.icon || 'layers-outline'} size={18} color={isSelected ? '#fff' : '#333'} />
                <Text style={[styles.text, isSelected && styles.textSelected]}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                data={collectionTypes}
                keyExtractor={item => String(item.id)}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        paddingVertical: 10,
        height: 53,
        zIndex: 10,
    },
    button: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonSelected: {
        backgroundColor: 'green',
    },
    text: {
        marginLeft: 8,
        color: '#333',
        fontWeight: '500',
        fontSize: 12,
    },
    textSelected: {
        color: '#fff',
    },
});
