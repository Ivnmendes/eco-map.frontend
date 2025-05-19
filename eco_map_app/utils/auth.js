import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../constants';


export async function getAccessToken() {
    return await AsyncStorage.getItem('access_token');
}

export async function getRefreshToken() {
    return await AsyncStorage.getItem('refresh_token');
}

export async function saveTokens({ access, refresh }) {
    await AsyncStorage.setItem('access_token', access);
    await AsyncStorage.setItem('refresh_token', refresh);
}

export async function clearTokens() {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
}

export async function verifyOrRefreshTokens() {
    const access = await getAccessToken();
    try {
        await axios.post(`${API_URL}/accounts/token/verify/`, { token: access });
        return true;
    } catch (err) {
        if (err.response?.status === 401) {
        const refresh = await getRefreshToken();
        try {
            const res = await axios.post(`${API_URL}/accounts/token/refresh/`, {
            refresh,
            });
            await saveTokens({
            access: res.data.access,
            refresh: refresh,
            });
            return true;
        } catch {
            await clearTokens();
            return false;
        }
        } else {
        return false;
        }
    }
}
