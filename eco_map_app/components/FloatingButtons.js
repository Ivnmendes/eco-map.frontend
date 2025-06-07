import React, { useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function FloatingButtons({ loadingLocation, loadingPoints, onUpdateLocation, onReloadPoints, onAddPoint, isStaff, isAdmin, setIsAdmin }) {
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleExpand = () => {
        animation.stopAnimation(() => {
            Animated.timing(animation, {
                toValue: expanded ? 0 : 1,
                duration: 350,
                useNativeDriver: true,
            }).start(() => {
                setExpanded(!expanded);
            });
        });
    };

    const getButtonStyle = (offsetY) => ({
        opacity: animation,
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -offsetY],
                }),
            },
        ],
    });

    return (
        <>
            <TouchableOpacity
                style={[styles.floatingButton, styles.floatingButtonUpdate]}
                onPress={onUpdateLocation}
                disabled={loadingLocation}
            >
                {loadingLocation ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Ionicons name="locate-outline" size={28} color="#fff" />
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.floatingButton, styles.floatingButtonExpand]}
                onPress={toggleExpand}
            >
                <Ionicons name={expanded ? 'close' : 'ellipsis-vertical'} size={28} color="#fff" />
            </TouchableOpacity>

            <Animated.View pointerEvents={expanded ? 'auto' : 'none'} style={[styles.animatedButtonContainer, getButtonStyle(220)]}>
                <TouchableOpacity style={styles.floatingButton} onPress={onReloadPoints} disabled={loadingPoints}>
                    {loadingPoints ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="reload-outline" size={28} color="#fff" />
                    )}
                </TouchableOpacity>
            </Animated.View>

            <Animated.View pointerEvents={expanded ? 'auto' : 'none'} style={[styles.animatedButtonContainer, getButtonStyle(300)]}>
                <TouchableOpacity style={styles.floatingButton} onPress={onAddPoint}>
                    <Ionicons name="add-circle-outline" size={28} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            {isStaff && (
                <Animated.View pointerEvents={expanded ? 'auto' : 'none'} style={[styles.animatedButtonContainer, getButtonStyle(380)]}>
                    <TouchableOpacity style={styles.floatingButton} onPress={() => {
                            setIsAdmin(!isAdmin)
                        }
                    }>
                        <Ionicons name="settings-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            )}
            
        </>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        right: 20,
        backgroundColor: '#256D5B',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    floatingButtonUpdate: {
        bottom: 140,
        right: 20,
    },
    floatingButtonExpand: {
        bottom: 220,
        right: 20,
    },
    animatedButtonContainer: {
        position: 'absolute',
        right: 0,
        bottom: 140,
    },
});
