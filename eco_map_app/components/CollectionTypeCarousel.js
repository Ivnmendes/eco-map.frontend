import React from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CollectionTypeCarousel({ collectionTypes, selectedCategoryTypes, setSelectedCategoryTypes }) {
    const { top: safeAreaTop } = useSafeAreaInsets();
    const handleSelect = (id) => {
        setSelectedCategoryTypes((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const clearFilters = () => {
        setSelectedCategoryTypes([]);
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedCategoryTypes.includes(item.id);
        return (
            <TouchableOpacity
                onPress={() => handleSelect(item.id)}
                style={[styles.button, isSelected && styles.buttonSelected]}
            >
                <Ionicons name={item.icon || 'layers-outline'} size={18} color={isSelected ? '#fff' : '#333'} />
                <Text style={[styles.text, isSelected && styles.textSelected]}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { top: safeAreaTop }]}>
            <FlatList
                horizontal
                data={collectionTypes}
                keyExtractor={item => String(item.id)}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
                ListHeaderComponent={
                    selectedCategoryTypes.length > 0 ? (
                        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                            <Ionicons name="close-circle-outline" size={18} color="#C8E6C9" />
                            <Text style={styles.clearButtonText}>Limpar</Text>
                        </TouchableOpacity>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
        paddingVertical: 8,
    },
    listContentContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    buttonSelected: {
        backgroundColor: '#256D5B',
        borderColor: '#256D5B',
    },
    text: {
        marginLeft: 8,
        color: '#333',
        fontWeight: '500',
        fontSize: 14,
    },
    textSelected: {
        color: '#fff',
    },
    clearButton: {
        backgroundColor: '#4a6b63',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearButtonText: {
        marginLeft: 6,
        color: '#C8E6C9',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
