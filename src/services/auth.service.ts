import { api, setAuthToken, clearAuthToken } from './apiClient';
import type { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

interface BiometricChallengeResponse {
  challenge: string;
}

export const authService = {
  login: async (legajo: string, password: string) => {
    const result = await api.post<LoginResponse>('/auth/login', { legajo, password });
    if (result.success && result.data) {
      await setAuthToken(result.data.token);
    }
    return result;
  },

  getBiometricChallenge: () =>
    api.get<BiometricChallengeResponse>('/auth/biometric/challenge'),

  loginBiometric: async (signature: string) => {
    const result = await api.post<LoginResponse>('/auth/biometric/verify', { signature });
    if (result.success && result.data) {
      await setAuthToken(result.data.token);
    }
    return result;
  },

  logout: async () => {
    await api.post('/auth/logout');
    await clearAuthToken();
  },

  getProfile: () =>
    api.get<User>('/auth/profile'),

  refreshToken: async () => {
    const result = await api.post<{ token: string }>('/auth/refresh');
    if (result.success && result.data) {
      await setAuthToken(result.data.token);
    }
    return result;
  },
};
