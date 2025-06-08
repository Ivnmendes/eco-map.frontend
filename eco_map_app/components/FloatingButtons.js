import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FloatingButtons({
    loadingLocation,
    loadingPoints,
    onUpdateLocation,
    onReloadPoints,
    onAddPoint,
    isStaff,
    isAdmin,
    setIsAdmin,
}) {
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = expanded ? 0 : 1;
        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: true, 
        }).start(() => {
            setExpanded(!expanded);
        });
    };

    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '135deg'],
    });

    const getAnimatedButtonStyle = (index) => ({
        opacity: animation,
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(index * 70 + 70)],
                }),
            },
        ],
    });

    return (
        <View 
            style={styles.container}
        >
            <TouchableOpacity
                style={[styles.floatingButton, styles.locateButton]}
                onPress={onUpdateLocation}
                disabled={loadingLocation}
                onStartShouldSetResponder={() => true}
            >
                {loadingLocation ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="locate" size={24} color="#fff" />}
            </TouchableOpacity>

            <Animated.View style={[styles.secondaryButtonContainer, getAnimatedButtonStyle(0)]}>
                <TouchableOpacity style={styles.floatingButton} onPress={onReloadPoints} disabled={loadingPoints} onStartShouldSetResponder={() => true}>
                    {loadingPoints ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="refresh" size={24} color="#fff" />}
                </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={[styles.secondaryButtonContainer, getAnimatedButtonStyle(1)]}>
                <TouchableOpacity style={styles.floatingButton} onPress={onAddPoint} onStartShouldSetResponder={() => true}>
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            {isStaff && (
                <Animated.View style={[styles.secondaryButtonContainer, getAnimatedButtonStyle(2)]}>
                    <TouchableOpacity 
                        style={[styles.floatingButton, isAdmin && styles.adminActive]}
                        onPress={() => setIsAdmin(!isAdmin)}
                        onStartShouldSetResponder={() => true}
                    >
                        <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            )}

            <TouchableOpacity
                style={[styles.floatingButton, styles.mainButton]}
                onPress={toggleMenu}
                onStartShouldSetResponder={() => true}
            >
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <Ionicons name="add" size={32} color="#fff" />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '1%',
        right: 20,
        alignItems: 'center',
    },
    floatingButton: {
        backgroundColor: '#256D5B',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    mainButton: {
    },
    locateButton: {
        position: 'absolute',
        right: 80, 
    },
    secondaryButtonContainer: {
        position: 'absolute',
        right: 0, 
        bottom: 0,
    },
    adminActive: {
        backgroundColor: '#c4a20e',
    },
});