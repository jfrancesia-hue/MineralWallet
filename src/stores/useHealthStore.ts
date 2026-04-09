import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';
import { healthService } from '../services/health.service';
import type { FatigueLevel, MedicalExam, HealthMetric } from '../types';

interface HealthState {
  fatigueLevel: FatigueLevel;
  readinessScore: number;
  sleepHours: number;
  shiftLoad: string;
  hydrationCurrent: number;
  hydrationGoal: number;
  hydrationPercent: number;
  temperature: number;
  medicalExams: MedicalExam[];
  aptoVigente: string;
  metrics: HealthMetric;
  moodToday: number | null;
  daysAwayFromHome: number;
  daysUntilReturn: number;
  isLoading: boolean;
  error: string | null;

  fetchSummary: () => Promise<void>;
  addWater: (ml?: number) => Promise<void>;
  setMood: (mood: number) => Promise<void>;
  updateMetrics: (metrics: Partial<HealthMetric>) => Promise<void>;
  fetchExams: () => Promise<void>;
  clearError: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      fatigueLevel: 'optimo',
      readinessScore: 0,
      sleepHours: 0,
      shiftLoad: '',
      hydrationCurrent: 0,
      hydrationGoal: 4000,
      hydrationPercent: 0,
      temperature: 0,
      medicalExams: [],
      aptoVigente: '',
      metrics: {
        heartRate: 0,
        steps: 0,
        deepSleep: 0,
        sleepQuality: '',
      },
      moodToday: null,
      daysAwayFromHome: 0,
      daysUntilReturn: 0,
      isLoading: false,
      error: null,

      fetchSummary: async () => {
        set({ isLoading: true, error: null });
        const res = await healthService.getSummary();
        if (res.success && res.data) {
          const { hydrationCurrent, hydrationGoal } = res.data;
          set({
            fatigueLevel: res.data.fatigueLevel,
            readinessScore: res.data.readinessScore,
            sleepHours: res.data.sleepHours,
            shiftLoad: res.data.shiftLoad,
            hydrationCurrent,
            hydrationGoal,
            hydrationPercent: Math.round((hydrationCurrent / hydrationGoal) * 100),
            temperature: res.data.temperature,
            aptoVigente: res.data.aptoVigente,
            metrics: res.data.metrics,
            daysAwayFromHome: res.data.daysAwayFromHome,
            daysUntilReturn: res.data.daysUntilReturn,
            isLoading: false,
          });
        } else {
          set({ error: res.error?.message ?? 'Error al cargar resumen de salud', isLoading: false });
        }
      },

      addWater: async (ml = 250) => {
        const { hydrationCurrent, hydrationGoal } = get();
        const newCurrent = Math.min(hydrationCurrent + ml, hydrationGoal);
        set({
          hydrationCurrent: newCurrent,
          hydrationPercent: Math.round((newCurrent / hydrationGoal) * 100),
        });
        const res = await healthService.logHydration(ml);
        if (!res.success) {
          set({
            hydrationCurrent,
            hydrationPercent: Math.round((hydrationCurrent / hydrationGoal) * 100),
            error: res.error?.message ?? 'Error al registrar hidratacion',
          });
        }
      },

      setMood: async (mood) => {
        const prevMood = get().moodToday;
        set({ moodToday: mood });
        const res = await healthService.logMood(mood);
        if (!res.success) {
          set({
            moodToday: prevMood,
            error: res.error?.message ?? 'Error al registrar estado de animo',
          });
        }
      },

      updateMetrics: async (metrics) => {
        const prevMetrics = get().metrics;
        set((state) => ({ metrics: { ...state.metrics, ...metrics } }));
        const res = await healthService.updateMetrics(metrics);
        if (res.success && res.data) {
          set({ metrics: res.data });
        } else {
          set({
            metrics: prevMetrics,
            error: res.error?.message ?? 'Error al actualizar metricas',
          });
        }
      },

      fetchExams: async () => {
        set({ isLoading: true, error: null });
        const res = await healthService.getMedicalExams();
        if (res.success && res.data) {
          set({ medicalExams: res.data, isLoading: false });
        } else {
          set({ error: res.error?.message ?? 'Error al cargar examenes medicos', isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mineral-health',
      storage: mmkvStorage,
      partialize: (state) => ({
        fatigueLevel: state.fatigueLevel,
        readinessScore: state.readinessScore,
        sleepHours: state.sleepHours,
        shiftLoad: state.shiftLoad,
        hydrationCurrent: state.hydrationCurrent,
        hydrationGoal: state.hydrationGoal,
        hydrationPercent: state.hydrationPercent,
        temperature: state.temperature,
        medicalExams: state.medicalExams,
        aptoVigente: state.aptoVigente,
        metrics: state.metrics,
        moodToday: state.moodToday,
        daysAwayFromHome: state.daysAwayFromHome,
        daysUntilReturn: state.daysUntilReturn,
      }),
    }
  )
);
