import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';
import { safetyService } from '../services/safety.service';
import type { SOSEvent, EmergencyContact, SafetyTalk } from '../types';

interface SafetyState {
  safetyScore: number;
  incidentCount: number;
  consecutiveTalks: number;
  eppCompliancePercent: number;
  sosActive: boolean;
  sosCountdown: number;
  lastSOSTest: string;
  emergencyContacts: EmergencyContact[];
  sosEvents: SOSEvent[];
  todayTalk: SafetyTalk | null;
  completedCourses: number;
  totalCourses: number;
  isLoading: boolean;
  error: string | null;

  fetchSummary: () => Promise<void>;
  activateSOS: (lat: number, lng: number) => Promise<void>;
  cancelSOS: () => Promise<void>;
  completeTalk: (talkId: string) => Promise<void>;
  resetCountdown: () => void;
  clearError: () => void;
}

export const useSafetyStore = create<SafetyState>()(
  persist(
    (set, get) => ({
      safetyScore: 0,
      incidentCount: 0,
      consecutiveTalks: 0,
      eppCompliancePercent: 0,
      sosActive: false,
      sosCountdown: 30,
      lastSOSTest: '',
      emergencyContacts: [],
      sosEvents: [],
      todayTalk: null,
      completedCourses: 0,
      totalCourses: 0,
      isLoading: false,
      error: null,

      fetchSummary: async () => {
        set({ isLoading: true, error: null });
        const [summaryRes, contactsRes, talkRes] = await Promise.all([
          safetyService.getSummary(),
          safetyService.getEmergencyContacts(),
          safetyService.getTodayTalk(),
        ]);
        if (summaryRes.success && summaryRes.data) {
          set({
            safetyScore: summaryRes.data.safetyScore,
            incidentCount: summaryRes.data.incidentCount,
            consecutiveTalks: summaryRes.data.consecutiveTalks,
            eppCompliancePercent: summaryRes.data.eppCompliancePercent,
            lastSOSTest: summaryRes.data.lastSOSTest,
            completedCourses: summaryRes.data.completedCourses,
            totalCourses: summaryRes.data.totalCourses,
          });
        }
        if (contactsRes.success && contactsRes.data) {
          set({ emergencyContacts: contactsRes.data });
        }
        if (talkRes.success && talkRes.data) {
          set({ todayTalk: talkRes.data });
        }
        if (!summaryRes.success) {
          set({ error: summaryRes.error?.message ?? 'Error al cargar resumen de seguridad' });
        }
        set({ isLoading: false });
      },

      activateSOS: async (lat, lng) => {
        const optimisticEvent: SOSEvent = {
          id: `sos-${Date.now()}`,
          timestamp: Date.now(),
          latitude: lat,
          longitude: lng,
          type: 'sos',
          status: 'activated',
        };
        set((state) => ({
          sosActive: true,
          sosEvents: [optimisticEvent, ...state.sosEvents],
        }));
        const res = await safetyService.activateSOS({ latitude: lat, longitude: lng });
        if (res.success && res.data) {
          set((state) => ({
            sosEvents: state.sosEvents.map((e) =>
              e.id === optimisticEvent.id ? res.data! : e
            ),
          }));
        } else {
          set((state) => ({
            sosActive: false,
            sosEvents: state.sosEvents.filter((e) => e.id !== optimisticEvent.id),
            error: res.error?.message ?? 'Error al activar SOS',
          }));
        }
      },

      cancelSOS: async () => {
        const lastEvent = get().sosEvents[0];
        set({ sosActive: false, sosCountdown: 30 });
        if (lastEvent) {
          const res = await safetyService.cancelSOS(lastEvent.id);
          if (res.success && res.data) {
            set((state) => ({
              sosEvents: state.sosEvents.map((e) =>
                e.id === lastEvent.id ? res.data! : e
              ),
            }));
          } else {
            set({ error: res.error?.message ?? 'Error al cancelar SOS' });
          }
        }
      },

      completeTalk: async (talkId) => {
        set((state) => ({
          todayTalk: state.todayTalk?.id === talkId
            ? { ...state.todayTalk, completed: true }
            : state.todayTalk,
          consecutiveTalks: state.consecutiveTalks + 1,
        }));
        const res = await safetyService.completeTalk(talkId);
        if (res.success && res.data) {
          set({ todayTalk: res.data });
        } else {
          set((state) => ({
            todayTalk: state.todayTalk?.id === talkId
              ? { ...state.todayTalk, completed: false }
              : state.todayTalk,
            consecutiveTalks: Math.max(0, state.consecutiveTalks - 1),
            error: res.error?.message ?? 'Error al completar charla',
          }));
        }
      },

      resetCountdown: () => set({ sosCountdown: 30 }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mineral-safety',
      storage: mmkvStorage,
      partialize: (state) => ({
        safetyScore: state.safetyScore,
        incidentCount: state.incidentCount,
        consecutiveTalks: state.consecutiveTalks,
        eppCompliancePercent: state.eppCompliancePercent,
        sosActive: state.sosActive,
        sosCountdown: state.sosCountdown,
        lastSOSTest: state.lastSOSTest,
        emergencyContacts: state.emergencyContacts,
        sosEvents: state.sosEvents,
        todayTalk: state.todayTalk,
        completedCourses: state.completedCourses,
        totalCourses: state.totalCourses,
      }),
    }
  )
);
