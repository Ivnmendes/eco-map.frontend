import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Button, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'; 
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InfoScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [webViewKey, setWebViewKey] = useState(0);

    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            setWebViewKey(prevKey => prevKey + 1);

            return () => {
                setIsLoading(true);
                setError(null);
            };
        }, [])
    );

    const onShouldStartLoadWithRequest = useCallback((request) => {
        const allowedBaseHost = 'www.santamaria.rs.gov.br/descarte-legal';

        if (request.url.includes(allowedBaseHost)) {
            console.log('Navegação permitida para:', request.url);
            return true;
        }

        if (!request.url.startsWith('about:') && request.url !== 'blank' && request.url !== 'data:') {
            Alert.alert(
                'Navegação Restrita',
                `Este aplicativo só permite navegar dentro do site da prefeitura de Santa Maria. Abrir ${request.url} no navegador externo?`,
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Abrir no Navegador',
                    },
                ],
                { cancelable: true }
            );
        }
        return false;
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {isLoading && (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={styles.activityIndicator}
                />
            )}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Erro ao carregar a página:</Text>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            <WebView
                key={webViewKey.toString()}
                source={{ uri: 'https://www.santamaria.rs.gov.br/descarte-legal/' }}
                style={[styles.webView, isLoading ? { height: 0.1 } : { flex: 1 }]}
                onLoadStart={() => { 
                    setIsLoading(true);
                    setError(null);
                }}
                onLoadEnd={() => setIsLoading(false)} 
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    setError(`Código: ${nativeEvent.code}, Descrição: ${nativeEvent.description}`);
                    setIsLoading(false);
                }}
                onLoad={() => { 
                    setIsLoading(false);
                    setError(null);
                }}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                javaScriptEnabled={true}
                domStorageEnabled={true} 
                thirdPartyCookiesEnabled={true} 
                allowsInlineMediaPlayback={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'green',
    },
    webView: {
        flex: 1,
        width: '100%',
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    errorContainer: {
        position: 'absolute',
        top: '30%',
        left: '10%',
        right: '10%',
        backgroundColor: 'rgba(255,0,0,0.8)',
        padding: 20,
        borderRadius: 10,
        zIndex: 1, 
    },
    errorText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});