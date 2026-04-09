import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';
import { workService } from '../services/work.service';
import type { Shift, PayStub, EPPItem, Supervisor } from '../types';

interface WorkState {
  currentShift: Shift | null;
  shifts: Shift[];
  hoursThisMonth: number;
  overtimeHours: number;
  nightHours: number;
  overtimePay: number;
  payStubs: PayStub[];
  eppItems: EPPItem[];
  supervisor: Supervisor;
  checkInTime: string | null;
  isCheckedIn: boolean;
  isLoading: boolean;
  error: string | null;

  fetchSummary: () => Promise<void>;
  fetchShifts: (month?: string) => Promise<void>;
  performCheckIn: () => Promise<void>;
  performCheckOut: () => Promise<void>;
  fetchPayStubs: (year?: number) => Promise<void>;
  fetchEPP: () => Promise<void>;
  clearError: () => void;
}

export const useWorkStore = create<WorkState>()(
  persist(
    (set) => ({
      currentShift: null,
      shifts: [],
      hoursThisMonth: 0,
      overtimeHours: 0,
      nightHours: 0,
      overtimePay: 0,
      payStubs: [],
      eppItems: [],
      supervisor: { name: '', role: '' },
      checkInTime: null,
      isCheckedIn: false,
      isLoading: false,
      error: null,

      fetchSummary: async () => {
        set({ isLoading: true, error: null });
        const res = await workService.getSummary();
        if (res.success && res.data) {
          set({
            currentShift: res.data.currentShift,
            hoursThisMonth: res.data.hoursThisMonth,
            overtimeHours: res.data.overtimeHours,
            nightHours: res.data.nightHours,
            overtimePay: res.data.overtimePay,
            isCheckedIn: res.data.isCheckedIn,
            checkInTime: res.data.checkInTime,
            supervisor: res.data.supervisor,
            isLoading: false,
          });
        } else {
          set({ error: res.error?.message ?? 'Error al cargar resumen', isLoading: false });
        }
      },

      fetchShifts: async (month) => {
        set({ isLoading: true, error: null });
        const res = await workService.getShifts(month);
        if (res.success && res.data) {
          set({ shifts: res.data, isLoading: false });
        } else {
          set({ error: res.error?.message ?? 'Error al cargar turnos', isLoading: false });
        }
      },

      performCheckIn: async () => {
        set({ isLoading: true, error: null });
        const res = await workService.checkIn();
        if (res.success && res.data) {
          set({ isCheckedIn: true, checkInTime: res.data.checkInTime, isLoading: false });
        } else {
          set({ error: res.error?.message ?? 'Error al registrar entrada', isLoading: false });
        }
      },

      performCheckOut: async () => {
        set({ isLoading: true, error: null });
        const res = await workService.checkOut();
        if (res.success) {
          set({ isCheckedIn: false, isLoading: false });
        } else {
          set({ error: res.error?.message ?? 'Error al registrar salida', isLoading: false });
        }
      },

      fetchPayStubs: async (year) => {
        set({ isLoading: true, error: null });
        const res = await workService.getPayStubs(year);
        if (res.success && res.data) {
          set({ payStubs: res.data, isLoading: false });
        } else {
          set({ error: res.error?.message ?? 'Error al cargar recibos de sueldo', isLoading: false });
        }
      },

      fetchEPP: async () => {
        set({ isLoading: true, error: null });
        const res = await workService.getEPP();
        if (res.success && res.data) {
          set({ eppItems: res.data, isLoading: false });
        } else {
          set({ error: res.error?.message ?? 'Error al cargar EPP', isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mineral-work',
      storage: mmkvStorage,
      partialize: (state) => ({
        currentShift: state.currentShift,
        shifts: state.shifts,
        hoursThisMonth: state.hoursThisMonth,
        overtimeHours: state.overtimeHours,
        nightHours: state.nightHours,
        overtimePay: state.overtimePay,
        payStubs: state.payStubs,
        eppItems: state.eppItems,
        supervisor: state.supervisor,
        checkInTime: state.checkInTime,
        isCheckedIn: state.isCheckedIn,
      }),
    }
  )
);
