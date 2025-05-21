import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './authService';
import { API_URL } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

async function refreshAccessToken() {
  const refresh = await getRefreshToken();
  if (!refresh) throw new Error('No refresh token');

  const response = await axios.post(`${API_URL}/accounts/token/refresh/`, { refresh });
  await saveTokens({
    access: response.data.access,
    refresh,
  });
  return response.data.access;
}

api.interceptors.request.use(async config => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.data?.detail === 'Token is blacklisted' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        await clearTokens();
        // TODO: adicionar função de voltar para a tela de login
        // navigation.replace('Login');
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export async function verifyOrRefreshTokens() {
    const access = await getAccessToken();
    try {
        if (!access) {
            throw new Error('No access token found');
        }
        await api.post(`${API_URL}/accounts/token/verify/`, { token: access });
        return true;
    } catch (err) {
        if (err.response?.status === 401) {
        try {
            refreshAccessToken();
        } catch {
            await clearTokens();
            return false;
        }
        } else {
        return false;
        }
    }
}

export async function login(email, password) {
    const response = await api.post('/accounts/login/', { email, password });
    await saveTokens({
      access: response.data.access,
      refresh: response.data.refresh,
    });
    return response.data;
}
  
export async function logout() {
    const refresh = await getRefreshToken();
    await api.post('/accounts/logout/', { refresh });
    await clearTokens();
}
  
export async function register(data) {
    const response = await api.post('/accounts/register/', data);
    await saveTokens({
      access: response.data.access,
      refresh: response.data.refresh,
    });
    return response.data;
}

export default api;
