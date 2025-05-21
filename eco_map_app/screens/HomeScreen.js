import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Animated, FlatList } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';

import { getAccessToken } from '../utils/auth';
import { API_URL } from '../constants';

import { DataContext } from '../context/DataContext'

export default function HomeScreen({ navigation }) {
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [loadingPoints, setLoadingPoints] = useState(false);
    const [region, setRegion] = useState({
        latitude: -29.7137724,
        longitude: -53.7162037,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [hasPermission, setHasPermission] = useState(false);
    const { collectionPoints, fetchCollectionPoints, collectionTypes } = useContext(DataContext);
    const { loadInitialData } = useContext(DataContext);
    const isFirstLoad = useRef(true);
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    export default function CollectionTypeCarousel({ onSelectCollectionType }) {
        const [selectedId, setSelectedId] = useState(null);
      
        function handleSelect(id) {
          setSelectedId(id);
          if(onSelectCollectionType) onSelectCollectionType(id);
        }

        const renderItem = ({ item }) => {
            const isSelected = item.id === selectedId;
            return (
              <TouchableOpacity
                onPress={() => handleSelect(item.id)}
                style={[styles.button, isSelected && styles.buttonSelected]}
              >
                <Ionicons name={item.icon} size={24} color={isSelected ? '#fff' : '#333'} />
                <Text style={[styles.text, isSelected && styles.textSelected]}>{item.name}</Text>
              </TouchableOpacity>
            );
    }
        
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
      

    useFocusEffect(
        React.useCallback(() => {
          if (isFirstLoad.current) {
            loadInitialData();
            isFirstLoad.current = false;
          }
        }, [])
    );

    async function reloadFetchCollectionPoints() {
        setLoadingPoints(true);

        await fetchCollectionPoints();

        setLoadingPoints(false);
    }

    useEffect(() => {
        reloadFetchCollectionPoints();
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          setHasPermission(status === 'granted');
          if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Permissão para acessar localização é necessária.');
          }
        })();
    }, []);

    const mapRef = useRef(null);

    async function handleAddPoint() {
        try {
            setLoadingLocation(true);
            if (!hasPermission) {
                Alert.alert('Permissão não concedida');
                setLoadingLocation(false);
                return;
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low
            });

            navigation.navigate('AddPointForm', {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível obter a localização');
        } finally {
            setLoadingLocation(false);
        }
    }

    async function handleUpdateLocation() {
        setLoadingLocation(true);

        try {
            if (!hasPermission) {
                Alert.alert('Permissão não concedida');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low
            });
            const newRegion = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }

            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 500);
            setLoadingLocation(false)
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível obter a localização');
        }
    }
    
    return (
        <View style={{ flex: 1}}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton={false}
            >
                {collectionPoints && collectionPoints.results && collectionPoints.results.map(point => (
                    <Marker
                        key={point.id}
                        coordinate={{
                            latitude: Number(point.latitude),
                            longitude: Number(point.longitude)
                        }}
                        title={point.name}
                        description={point.description}
                    />
                ))}
            </MapView>

            <TouchableOpacity style={[styles.floatingButton, styles.floatingButtonUpdate]} onPress={ handleUpdateLocation } disabled={ loadingLocation }>
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
                <Ionicons name={expanded ? "close" : "ellipsis-vertical"} size={28} color="#fff" />
            </TouchableOpacity>

            <Animated.View pointerEvents={expanded ? 'auto' : 'none'} style={[styles.animatedButtonContainer, getButtonStyle(220)]}>
                <TouchableOpacity style={styles.floatingButton} onPress={reloadFetchCollectionPoints} disabled={loadingPoints}>
                    {loadingPoints ? (
                    <ActivityIndicator size="small" color="#fff" />
                    ) : (
                    <Ionicons name="reload-outline" size={28} color="#fff" />
                    )}
                </TouchableOpacity>
            </Animated.View>

            <Animated.View pointerEvents={expanded ? 'auto' : 'none'} style={[styles.animatedButtonContainer, getButtonStyle(300)]}>
                <TouchableOpacity style={styles.floatingButton} onPress={handleAddPoint}>
                    <Ionicons name="add-circle-outline" size={28} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View pointerEvents={expanded ? 'auto' : 'none'} style={[styles.animatedButtonContainer, getButtonStyle(380)]}>
                <TouchableOpacity style={styles.floatingButton} onPress={() => {}}>
                    <Ionicons name="filter-circle-outline" size={28} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

        </View>
    )
}

const styles = StyleSheet.create({
    floatingButton: {
      position: 'absolute',
      right: 20,
      backgroundColor: 'green',
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
    floatingButtonMain: {
      bottom: 140,
      backgroundColor: '#03dac4',
    },
    animatedButtonContainer: {
      position: 'absolute',
      right: 0,
      bottom: 140,
    },
    floatingButtonExpand: {
        bottom: 140,
    },
    floatingButtonUpdate: {
        bottom: 140, 
        right: 20,
     },
      floatingButtonExpand: {
        bottom: 220,
        right: 20,
    },
  });
}