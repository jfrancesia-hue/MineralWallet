import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';

export type FatigueLevel = 'optimo' | 'precaucion' | 'riesgo';

export interface MedicalExam {
  id: string;
  type: string;
  date: string;
  location: string;
  status: 'pendiente' | 'completado';
  result?: string;
  preparation: string[];
}

export interface HealthMetric {
  heartRate: number;
  steps: number;
  deepSleep: number;
  sleepQuality: string;
}

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

  addWater: (ml?: number) => void;
  setMood: (mood: number) => void;
  updateMetrics: (metrics: Partial<HealthMetric>) => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set) => ({
      fatigueLevel: 'optimo',
      readinessScore: 94,
      sleepHours: 7.75,
      shiftLoad: 'Normal',
      hydrationCurrent: 2500,
      hydrationGoal: 4000,
      hydrationPercent: 62,
      temperature: 38,
      medicalExams: [
        {
          id: 'exam-1',
          type: 'Examen Periodico',
          date: '2026-05-15',
          location: 'Hospital Catamarca',
          status: 'pendiente',
          preparation: ['Ayuno de 12 horas', 'Documento de Identidad', 'Uniforme de Faena'],
        },
        {
          id: 'exam-2',
          type: 'Audiometria',
          date: '2026-03-15',
          location: 'Hospital Catamarca',
          status: 'completado',
          result: 'Normal',
          preparation: [],
        },
      ],
      aptoVigente: 'Noviembre 2026',
      metrics: {
        heartRate: 72,
        steps: 8420,
        deepSleep: 2.1,
        sleepQuality: '07:45h',
      },
      moodToday: null,
      daysAwayFromHome: 5,
      daysUntilReturn: 2,

      addWater: (ml = 250) =>
        set((state) => {
          const newCurrent = Math.min(state.hydrationCurrent + ml, state.hydrationGoal);
          return {
            hydrationCurrent: newCurrent,
            hydrationPercent: Math.round((newCurrent / state.hydrationGoal) * 100),
          };
        }),

      setMood: (mood) => set({ moodToday: mood }),

      updateMetrics: (metrics) =>
        set((state) => ({ metrics: { ...state.metrics, ...metrics } })),
    }),
    { name: 'mineral-health', storage: mmkvStorage }
  )
);
