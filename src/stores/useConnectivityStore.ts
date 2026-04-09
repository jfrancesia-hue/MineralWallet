import { create } from 'zustand';

interface ConnectivityState {
  isOnline: boolean;
  lastOnlineAt: number | null;
  isSyncing: boolean;
  pendingSyncCount: number;
  lastSyncAt: number | null;

  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  incrementPending: () => void;
  decrementPending: () => void;
  syncCompleted: () => void;
}

export const useConnectivityStore = create<ConnectivityState>((set) => ({
  isOnline: true,
  lastOnlineAt: Date.now(),
  isSyncing: false,
  pendingSyncCount: 0,
  lastSyncAt: null,

  setOnline: (online) =>
    set((state) => ({
      isOnline: online,
      lastOnlineAt: online ? Date.now() : state.lastOnlineAt,
    })),

  setSyncing: (syncing) => set({ isSyncing: syncing }),

  incrementPending: () =>
    set((state) => ({ pendingSyncCount: state.pendingSyncCount + 1 })),

  decrementPending: () =>
    set((state) => ({ pendingSyncCount: Math.max(0, state.pendingSyncCount - 1) })),

  syncCompleted: () =>
    set({ isSyncing: false, pendingSyncCount: 0, lastSyncAt: Date.now() }),
}));
