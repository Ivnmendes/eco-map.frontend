import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function ImagePickerComponent({ images, setImages, showNotification }) {

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showNotification(
                'error',
                'É necessário permitir o acesso à galeria de imagens.'
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImages(result.assets); 
        }
    };

    const handleRemoveImage = (uriToRemove) => {
        setImages(prevImages => prevImages.filter((image) => image.uri !== uriToRemove));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Ionicons name="camera-outline" size={22} color="#FFFFFF" />
                <Text style={styles.buttonText}>Adicionar Imagens</Text>
            </TouchableOpacity>

            <FlatList
                data={images}
                renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                        <TouchableOpacity 
                            style={styles.removeButton}
                            onPress={() => handleRemoveImage(item.uri)}
                        >
                            <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.uri}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#256D5B',
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    list: {
        marginTop: 10,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});