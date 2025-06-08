import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Linking } from 'react-native'; 
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ExternalLinkModal from '../components/ExternalLinkModal'; 

export default function InfoScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [webViewKey, setWebViewKey] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [externalUrl, setExternalUrl] = useState('');

    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            setWebViewKey(prevKey => prevKey + 1);
            return () => setIsLoading(true);
        }, [])
    );

    const handleConfirmOpenLink = () => {
        if (externalUrl) {
            Linking.openURL(externalUrl);
        }
        setModalVisible(false);
        setExternalUrl('');
    };

    const onShouldStartLoadWithRequest = useCallback((request) => {
        const allowedDomain = 'santamaria.rs.gov.br/descarte-legal';

        if (request.url.includes(allowedDomain)) {
            return true;
        }

        if (!request.url.startsWith('http')) {
            return false;
        }
        
        setExternalUrl(request.url);
        setModalVisible(true);
        return false;
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {isLoading && (
                <ActivityIndicator
                    size="large"
                    color="#256D5B"
                    style={styles.activityIndicator}
                />
            )}
            <WebView
                key={webViewKey.toString()}
                source={{ uri: 'https://www.santamaria.rs.gov.br/descarte-legal/' }}
                style={[styles.webView, isLoading && { opacity: 0 }]}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)} 
                onError={() => setIsLoading(false)}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            />
            <ExternalLinkModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleConfirmOpenLink}
                url={externalUrl}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
        zIndex: 1,
    },
});
