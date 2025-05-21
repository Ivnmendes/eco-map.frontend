import AsyncStorage from '@react-native-async-storage/async-storage';

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