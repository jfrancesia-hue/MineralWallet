import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';

interface User {
  id: string;
  legajo: string;
  nombre: string;
  apellido: string;
  categoria: string;
  mina: string;
  empresa: string;
  avatarUrl?: string;
  antiguedad: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (legajo: string, password: string) => Promise<void>;
  loginBiometric: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (legajo: string, _password: string) => {
        set({ isLoading: true });
        // TODO: API call to NestJS backend
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({
          user: {
            id: '1',
            legajo,
            nombre: 'Carlos',
            apellido: 'Francesia',
            categoria: 'Operador Senior A',
            mina: 'Minera Alumbrera',
            empresa: 'Obsidian Mining Co.',
            antiguedad: 7,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      loginBiometric: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({
          user: {
            id: '1',
            legajo: '4521',
            nombre: 'Carlos',
            apellido: 'Francesia',
            categoria: 'Operador Senior A',
            mina: 'Minera Alumbrera',
            empresa: 'Obsidian Mining Co.',
            antiguedad: 7,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'mineral-auth',
      storage: mmkvStorage,
    }
  )
);
