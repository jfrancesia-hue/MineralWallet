import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';

export interface SOSEvent {
  id: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  type: 'sos' | 'report';
  status: 'activated' | 'resolved' | 'cancelled';
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  role: 'family' | 'mine' | 'medical';
  label: string;
}

export interface SafetyTalk {
  id: string;
  title: string;
  duration: string;
  date: string;
  completed: boolean;
}

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

  activateSOS: (lat: number, lng: number) => void;
  cancelSOS: () => void;
  completeTalk: (talkId: string) => void;
  resetCountdown: () => void;
}

export const useSafetyStore = create<SafetyState>()(
  persist(
    (set, get) => ({
      safetyScore: 94,
      incidentCount: 0,
      consecutiveTalks: 23,
      eppCompliancePercent: 80,
      sosActive: false,
      sosCountdown: 30,
      lastSOSTest: '2026-03-28',
      emergencyContacts: [
        { id: '1', name: 'Emergencias Medicas', phone: '107', role: 'medical', label: 'Public Utility' },
        { id: '2', name: 'Emergency Mine', phone: '+543834567890', role: 'mine', label: 'Internal Site' },
        { id: '3', name: 'Maria (Family)', phone: '+5491155667788', role: 'family', label: 'Primary Kin' },
      ],
      sosEvents: [],
      todayTalk: {
        id: 'talk-1',
        title: 'Riesgos electricos en operaciones subterraneas',
        duration: '5 min',
        date: '2026-04-09',
        completed: false,
      },
      completedCourses: 12,
      totalCourses: 15,

      activateSOS: (lat, lng) => {
        const event: SOSEvent = {
          id: `sos-${Date.now()}`,
          timestamp: Date.now(),
          latitude: lat,
          longitude: lng,
          type: 'sos',
          status: 'activated',
        };
        set((state) => ({
          sosActive: true,
          sosEvents: [event, ...state.sosEvents],
        }));
      },

      cancelSOS: () => set({ sosActive: false, sosCountdown: 30 }),

      completeTalk: (talkId) => set((state) => ({
        todayTalk: state.todayTalk?.id === talkId
          ? { ...state.todayTalk, completed: true }
          : state.todayTalk,
        consecutiveTalks: state.consecutiveTalks + 1,
      })),

      resetCountdown: () => set({ sosCountdown: 30 }),
    }),
    { name: 'mineral-safety', storage: mmkvStorage }
  )
);
