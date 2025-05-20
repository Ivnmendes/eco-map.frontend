import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, Alert } from 'react-native';
import axios from 'axios';
import { getAccessToken, getRefreshToken, clearTokens } from '../utils/auth';
import { API_URL } from '../constants';

import MapView from 'react-native-maps';

export default function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    return (
        <Text>Hello World! :D</Text>
    )
}

const styles = StyleSheet.create({

});