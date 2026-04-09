import { createJSONStorage } from 'zustand/middleware';

let mmkvInstance: any = null;

function getMmkv() {
  if (!mmkvInstance) {
    try {
      const { MMKV } = require('react-native-mmkv');
      mmkvInstance = new MMKV({ id: 'mineralwallet-storage' });
    } catch {
      // Fallback for environments where MMKV is not available
      const memoryStore = new Map<string, string>();
      mmkvInstance = {
        getString: (key: string) => memoryStore.get(key),
        set: (key: string, value: string) => memoryStore.set(key, value),
        delete: (key: string) => memoryStore.delete(key),
      };
    }
  }
  return mmkvInstance;
}

const mmkvStateStorage = {
  getItem: (name: string): string | null => {
    const value = getMmkv().getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    getMmkv().set(name, value);
  },
  removeItem: (name: string) => {
    getMmkv().delete(name);
  },
};

export const mmkvStorage = createJSONStorage(() => mmkvStateStorage);
