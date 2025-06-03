import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, Image
 } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerComponent({ images, setImages }) {
    const [hasPermission, setHasPermission] = useState(null);

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasPermission(status === 'granted');
        if (!hasPermission) {
            Alert.alert(
                'Permissão necessária',
                'Precisamos de permissão para acessar a galeria de imagens.'
            );
            return;
        }
    };

    const pickImage = async () => {
        if (hasPermission === null) {
            await requestPermission();
        }
        if (hasPermission === false) {
            Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria para selecionar uma imagem.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImages(result.assets); 
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        const newImages = images.filter((_, index) => index !== indexToRemove);
        setImages(newImages);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Selecionar imagens:</Text>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Text style={styles.buttonText}>Escolher Imagens</Text>
            </TouchableOpacity>

            <FlatList
                data={images}
                renderItem={({ item, index }) => (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                        <TouchableOpacity 
                            style={styles.removeButton}
                            onPress={() => handleRemoveImage(index)}
                        >
                            <Text style={styles.removeButtonText}>X</Text>
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
        flex: 1,
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
        borderRadius: 10,
    },
    imageContainer: {
        position: 'relative',
        marginTop: 10,
        marginHorizontal: 10,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
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
    removeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});