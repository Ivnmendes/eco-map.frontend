import AsyncStorage from '@react-native-async-storage/async-storage';

export const setCache = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Erro ao salvar no cache:', e);
  }
};

export const getCache = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Erro ao obter do cache:', e);
    return null;
  }
};