import { api } from './apiClient';
import type { FatigueLevel, MedicalExam, HealthMetric } from '../types';

interface HealthSummary {
  fatigueLevel: FatigueLevel;
  readinessScore: number;
  sleepHours: number;
  shiftLoad: string;
  hydrationCurrent: number;
  hydrationGoal: number;
  temperature: number;
  aptoVigente: string;
  metrics: HealthMetric;
  daysAwayFromHome: number;
  daysUntilReturn: number;
}

interface HydrationLog {
  ml: number;
  timestamp: number;
}

interface MoodLog {
  mood: number;
  timestamp: number;
  note?: string;
}

export const healthService = {
  getSummary: () =>
    api.get<HealthSummary>('/health/summary'),

  logHydration: (ml: number) =>
    api.post<HydrationLog>('/health/hydration', { ml }),

  logMood: (mood: number, note?: string) =>
    api.post<MoodLog>('/health/mood', { mood, note }),

  updateMetrics: (metrics: Partial<HealthMetric>) =>
    api.patch<HealthMetric>('/health/metrics', metrics),

  getMedicalExams: () =>
    api.get<MedicalExam[]>('/health/exams'),

  confirmExamPreparation: (examId: string, item: string) =>
    api.post<MedicalExam>(`/health/exams/${examId}/preparation`, { item }),
};
