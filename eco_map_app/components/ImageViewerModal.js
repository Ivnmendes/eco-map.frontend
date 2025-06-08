import React, { useRef, useEffect } from 'react';
import { Modal, View, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ImageViewerModal({ images, initialIndex, isVisible, onClose }) {
    const flatListRef = useRef(null);

    useEffect(() => {
        if (isVisible && flatListRef.current && images && images.length > 0) {
            setTimeout(() => {
                flatListRef.current.scrollToIndex({ animated: false, index: initialIndex });
            }, 100);
        }
    }, [isVisible, initialIndex]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={35} color="white" />
                </TouchableOpacity>
                <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <Image 
                                source={{ uri: item.image }} 
                                style={styles.image} 
                                resizeMode="contain" 
                            />
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={initialIndex}
                    getItemLayout={(data, index) => (
                        { length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index }
                    )}
                />
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
