import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';
import { authService } from '../services/auth.service';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (legajo: string, password: string) => Promise<void>;
  loginBiometric: () => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (legajo: string, password: string) => {
        set({ isLoading: true, error: null });
        const result = await authService.login(legajo, password);

        if (result.success && result.data) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          set({
            isLoading: false,
            error: result.error?.message ?? 'Error al iniciar sesion',
          });
        }
      },

      loginBiometric: async () => {
        set({ isLoading: true, error: null });

        const challengeResult = await authService.getBiometricChallenge();
        if (!challengeResult.success || !challengeResult.data) {
          set({ isLoading: false, error: 'No se pudo obtener desafio biometrico' });
          return;
        }

        const loginResult = await authService.loginBiometric(challengeResult.data.challenge);
        if (loginResult.success && loginResult.data) {
          set({
            user: loginResult.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          set({
            isLoading: false,
            error: loginResult.error?.message ?? 'Error en autenticacion biometrica',
          });
        }
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false, error: null });
      },

      hydrate: async () => {
        if (get().isAuthenticated && get().user) return;

        set({ isLoading: true });
        const result = await authService.getProfile();

        if (result.success && result.data) {
          set({
            user: result.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mineral-auth',
      storage: mmkvStorage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
